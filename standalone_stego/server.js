const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'public/uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// --- Robust Encryption (AES-256-CBC with IV) ---
const algorithm = 'aes-256-cbc';

function getSecretKey(password) {
    // Generate a consistent 32-byte key from the password
    return crypto.createHash('sha256').update(password).digest();
}

function encrypt(text, password) {
    const key = getSecretKey(password);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    // Return IV + Encrypted Data (separated by colon)
    return iv.toString('hex') + ':' + encrypted;
}

function decrypt(text, password) {
    try {
        const key = getSecretKey(password);
        const parts = text.split(':');
        const iv = Buffer.from(parts[0], 'hex');
        const encryptedText = parts[1];
        const decipher = crypto.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (e) {
        console.error('Decryption error:', e.message);
        return null;
    }
}

// --- API Endpoints ---

// 1. Hide message in image (Encode)
app.post('/api/hide', upload.single('image'), async (req, res) => {
    try {
        const { message, password } = req.body;
        const filePath = req.file.path;

        if (!message || !password || !filePath) {
            return res.status(400).json({ error: 'Missing parameters' });
        }

        // 🔐 Encrypt message with IV
        const encrypted = encrypt(message, password);
        const payload = `##START##${encrypted}##END##`;

        // 🖼️ Load image
        const image = await Jimp.read(filePath);
        const { width, height } = image.bitmap;

        // Convert payload to binary
        let binaryMessage = '';
        for (let i = 0; i < payload.length; i++) {
            binaryMessage += payload.charCodeAt(i).toString(2).padStart(8, '0');
        }

        if (binaryMessage.length > width * height * 3) {
            return res.status(400).json({ error: 'Message too long for this image size' });
        }

        // Embed bits into LSB of RGB channels
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

        const outName = `stego-${Date.now()}.png`;
        const outPath = path.join(uploadsDir, outName);
        await image.writeAsync(outPath);

        // Cleanup original upload
        fs.unlinkSync(filePath);

        res.json({ 
            success: true, 
            imageUrl: `/uploads/${outName}`,
            fullUrl: `${req.protocol}://${req.get('host')}/uploads/${outName}`
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Encoding failed: ' + err.message });
    }
});

// 2. Extract message from image (Decode)
app.post('/api/extract', upload.single('image'), async (req, res) => {
    try {
        const { password } = req.body;
        const filePath = req.file.path;

        const image = await Jimp.read(filePath);
        const { width, height } = image.bitmap;

        let currentByte = '';
        let decodedData = '';
        const startMarker = "##START##";
        const endMarker = "##END##";

        extraction: for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const idx = image.getPixelIndex(x, y);
                for (let c = 0; c < 3; c++) {
                    const value = image.bitmap.data[idx + c];
                    currentByte += (value & 1).toString();

                    if (currentByte.length === 8) {
                        const charCode = parseInt(currentByte, 2);
                        decodedData += String.fromCharCode(charCode);
                        currentByte = '';

                        if (decodedData.endsWith(endMarker)) break extraction;
                        if (decodedData.length > 50000) break extraction; 
                    }
                }
            }
        }

        fs.unlinkSync(filePath);

        if (!decodedData.startsWith(startMarker)) {
            return res.status(400).json({ error: 'No hidden data found in this image' });
        }

        const encryptedPart = decodedData.slice(startMarker.length, -endMarker.length);
        
        // 🔍 Decrypt with IV
        const decrypted = decrypt(encryptedPart, password);

        if (!decrypted) {
            return res.status(401).json({ error: 'Invalid password or corrupted data' });
        }

        res.json({ success: true, message: decrypted });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Extraction failed: ' + err.message });
    }
});

app.listen(port, () => console.log(`🚀 Stego server running at http://localhost:${port}`));
