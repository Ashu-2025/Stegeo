app.post("/hide", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        if (!req.body.message) {
            return res.status(400).json({ message: "No message provided" });
        }

        const inputPath = req.file.path;
        const outputPath = "output/encoded.png";

        const password = req.body.password || "";
        const finalMessage = password + "|" + req.body.message;

        hideMessage(inputPath, outputPath, finalMessage);

        fs.unlinkSync(inputPath); // cleanup

        if (!fs.existsSync(outputPath)) {
            return res.json({ message: "Encoding failed" });
        }

        res.json({
            message: "Message hidden successfully!",
            file: "output/encoded.png"
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error: " + err.message });
    }
});
//  EXTRACT MESSAGE ROUTE
app.post("/extract", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send("No file uploaded");
        }

        const imagePath = req.file.path;

        const message = extractMessage(imagePath);

        fs.unlinkSync(imagePath); // cleanup

        if (!message || message.trim() === "") {
            return res.send("No hidden message found");
        }

        res.send(message);

    } catch (err) {
        console.error(err);
        res.status(500).send("Error: " + err.message);
    }
});