const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const Jimp = require("jimp");
const fernet = require("fernet");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const sharp = require("sharp");
const db = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config({ path: path.join(__dirname, ".env") });

console.log("✅ Using Local JSON Database (database.json)");

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: "1gb" }));
app.use(express.urlencoded({ limit: "1gb", extended: true }));

// Storage Config
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const upload = multer({
    dest: uploadsDir
});

// S3 Client
const s3 = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    }
});
const BUCKET_NAME = process.env.S3_BUCKET_NAME;

app.use("/uploads", express.static(uploadsDir));

// --- ROUTES ---

app.get("/", (req, res) => {
    res.json({ status: "online", message: "StegoShield Secure API" });
});

// --- AUTH ROUTES ---

app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) return res.status(400).json({ error: "Missing fields" });

        const existingUser = db.findUser(u => u.email === email || u.username === username);
        if (existingUser) return res.status(400).json({ error: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        db.addUser({ username, email, password: hashedPassword, role: "user" });

        db.addActivity({ event: "New User Registered", user: username, status: "Success" });

        res.json({ message: "Registration successful" });
    } catch (err) {
        res.status(500).json({ error: "Registration failed: " + err.message });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const user = db.findUser(u => u.email === identifier || u.username === identifier);
        
        if (!user) return res.status(400).json({ error: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            db.addActivity({ event: "Login Attempt", user: identifier, status: "Failed" });
            return res.status(400).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user.username, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "1d" });
        db.addActivity({ event: "User Login", user: user.username, status: "Success" });

        res.json({ token, user: { username: user.username, role: user.role } });
    } catch (err) {
        res.status(500).json({ error: "Login failed" });
    }
});

// --- ADMIN ROUTES ---

app.get("/api/admin/stats", async (req, res) => {
    try {
        const users = db.getUsers().map(u => ({ username: u.username, email: u.email, role: u.role }));
        const totalUsers = users.length;
        const imagesEncoded = db.countActivity(a => a.event === "Image Encoded" && a.status === "Success");
        const failedAttempts = db.countActivity(a => a.status === "Failed");
        const recentActivity = db.getRecentActivity(10);

        res.json({
            users,
            totalUsers,
            imagesEncoded,
            failedAttempts,
            recentActivity: recentActivity.map(a => ({
                event: a.event,
                user: a.user,
                status: a.status,
                time: a.timestamp
            }))
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch stats" });
    }
});

app.get("/api/user/stats", async (req, res) => {
    try {
        const { username } = req.query;
        if (!username) return res.status(400).json({ error: "Username required" });

        const totalUsers = db.countUsers();
        const imagesEncoded = db.countActivity(a => a.event === "Image Encoded" && a.user === username && a.status === "Success");
        const recentActivity = db.getRecentActivity(10, a => a.user === username);

        res.json({
            totalUsers,
            imagesEncoded,
            recentActivity: recentActivity.map(a => ({
                event: a.event,
                status: a.status,
                time: a.timestamp
            }))
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user stats" });
    }
});

// 1. HIDE MESSAGE (LSB Steganography + AES)
app.post("/hide", upload.single("image"), async (req, res) => {
    const filePath = req.file?.path;

    try {
        const { message, password } = req.body;

        if (!filePath || !message || !password) {
            return res.status(400).json({ error: "Missing image, message or password" });
        }

        // 🔐 Encrypt Message
        const secretKey = crypto.createHash("sha256").update(password).digest("base64");
        const secret = new fernet.Secret(secretKey);

        const token = new fernet.Token({
            secret: secret
        });

        const encryptedMessage = token.encode(message);

        // Standardize any image format into a raw PNG buffer
        const pngBuffer = await sharp(filePath).png().toBuffer();
        const image = await Jimp.read(pngBuffer);

        const marker = "##LSB##";
        const endMarker = "##END##";
        const payload = marker + encryptedMessage + endMarker;

        let binaryMessage = "";
        for (let i = 0; i < payload.length; i++) {
            binaryMessage += payload.charCodeAt(i).toString(2).padStart(8, "0");
        }

        const { width, height } = image.bitmap;

        if (binaryMessage.length > width * height * 3) {
            return res.status(400).json({ error: "Message too large for this image." });
        }

        let bitIndex = 0;

        outer: for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = image.getPixelIndex(x, y);

                for (let c = 0; c < 3; c++) {
                    if (bitIndex < binaryMessage.length) {
                        let value = image.bitmap.data[idx + c];
                        value = (value & 0xFE) | parseInt(binaryMessage[bitIndex++]);
                        image.bitmap.data[idx + c] = value;
                    } else {
                        break outer;
                    }
                }
            }
        }

        const outputPath = path.join(uploadsDir, `stego-${Date.now()}.png`);

        await image.write(outputPath);

        // Log Activity
        const username = req.body.username || "Anonymous";
        db.addActivity({ event: "Image Encoded", user: username, status: "Success" });

        try {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) {
            console.warn("Could not delete temp file:", e.message);
        }

        res.json({
            message: "Success",
            downloadLocal: `/uploads/${path.basename(outputPath)}`
        });

    } catch (err) {
        console.error(err);

        try {
            if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) {
            console.warn("Could not delete temp file in catch:", e.message);
        }

        res.status(500).json({ error: "Encoding failed: " + err.message });
    }
});

// 2. EXTRACT MESSAGE
app.post("/extract", upload.single("image"), async (req, res) => {
    const filePath = req.file?.path;
    try {
        const { password, imageUrl } = req.body;
        if ((!filePath && !imageUrl) || !password) return res.status(400).json({ error: "Missing image/url or password" });

        let pngBuffer;
        if (imageUrl) {
            const response = await fetch(imageUrl);
            const arrayBuffer = await response.arrayBuffer();
            pngBuffer = await sharp(Buffer.from(arrayBuffer)).png().toBuffer();
        } else {
            pngBuffer = await sharp(filePath).png().toBuffer();
        }

        const image = await Jimp.read(pngBuffer);
        const { width, height } = image.bitmap;

        let currentByte = "";
        let decodedPayload = "";
        const marker = "##LSB##";
        const endMarker = "##END##";

        extractionLoop: for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const pixelIndex = image.getPixelIndex(x, y);
                for (let channel = 0; channel < 3; channel++) {
                    const value = image.bitmap.data[pixelIndex + channel];
                    currentByte += (value & 1).toString();

                    if (currentByte.length === 8) {
                        const charCode = parseInt(currentByte, 2);
                        decodedPayload += String.fromCharCode(charCode);
                        currentByte = "";

                        if (decodedPayload.endsWith(endMarker)) break extractionLoop;
                        if (decodedPayload.length > 100000) break extractionLoop;
                    }
                }
            }
        }

        try {
            if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) { }

        if (!decodedPayload.startsWith(marker)) {
            return res.status(400).json({ error: "No hidden message found." });
        }

        const encryptedToken = decodedPayload.substring(marker.length, decodedPayload.length - endMarker.length);
        const secretKey = crypto.createHash('sha256').update(password).digest('base64');
        const secret = new fernet.Secret(secretKey);
        const token = new fernet.Token({
            secret: secret,
            token: encryptedToken,
            ttl: 0
        });

        const decryptedMessage = token.decode();
        if (!decryptedMessage) {
            db.addActivity({ event: "Extraction Attempt", user: "Anonymous", status: "Failed" });
            return res.status(400).json({ error: "Invalid password or corrupted data." });
        }

        db.addActivity({ event: "Image Decoded", user: "Anonymous", status: "Success" });
        res.json({ message: decryptedMessage });
    } catch (err) {
        console.error(err);
        db.addActivity({ event: "Extraction Error", user: "Anonymous", status: "Failed" });
        try {
            if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        } catch (e) { }
        res.status(500).json({ error: "Extraction failed: " + err.message });
    }
});

// 3. SECURE SHARE (S3 + Presigned URL)
app.post("/share", async (req, res) => {
    try {
        const { filePath } = req.body;
        if (!filePath) return res.status(400).json({ error: "Missing file path" });

        const absolutePath = path.join(__dirname, filePath);
        if (!fs.existsSync(absolutePath)) return res.status(404).json({ error: "File not found" });

        const storageMode = process.env.STORAGE_MODE || "local";

        if (storageMode === "local") {
            const hostUrl = `${req.protocol}://${req.get("host")}`;
            return res.json({ shareLink: `${hostUrl}${filePath}` });
        }

        const fileBuffer = fs.readFileSync(absolutePath);
        const fileName = path.basename(absolutePath);

        const uploadParams = {
            Bucket: BUCKET_NAME,
            Key: `stego_shares/${Date.now()}-${fileName}`,
            Body: fileBuffer,
            ContentType: "image/png"
        };
        await s3.send(new PutObjectCommand(uploadParams));

        const presignedUrl = await getSignedUrl(s3, new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: uploadParams.Key,
        }), { expiresIn: 3600 * 24 }); // 24 hours

        db.addActivity({ event: "Link Shared", user: "Anonymous", status: "Success" });
        res.json({ shareLink: presignedUrl });
    } catch (err) {
        console.error(err);
        db.addActivity({ event: "Sharing Error", user: "Anonymous", status: "Failed" });
        res.status(500).json({ error: "Cloud sharing failed" });
    }
});

// 4. BASIC ENCODE (User Snippet)
app.post("/encode", upload.single("image"), async (req, res) => {
    try {
        const image = await Jimp.read(req.file.path);

        // your LSB logic here (currently saves as a demonstration)
        const outPath = path.join(uploadsDir, "encoded.png");
        await image.write(outPath);

        try {
            if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        } catch (e) {
            console.warn("Could not delete temp file:", e.message);
        }
        res.json({ success: true, downloadUrl: "/uploads/encoded.png" });
    } catch (err) {
        console.error(err);
        try {
            if (req.file?.path && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        } catch (e) {
            console.warn("Could not delete temp file in catch:", e.message);
        }
        res.status(500).send("Encoding failed");
    }
});

// 🛡️ GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        return res.status(400).json({ error: `Upload error: ${err.message}` });
    }
    res.status(500).json({ error: "Internal Server Error", details: err.message });
});

// Start Server
app.listen(4002, "0.0.0.0", () => {
    console.log("Server running on port 4002");
});
