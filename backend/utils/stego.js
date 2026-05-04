const fs = require("fs");
/*

HIDE MESSAGE IN IMAGE (LSB)

*/
function hideMessage(inputPath, outputPath, message) {
    try {
        // ✅ ADD MARKER
        const finalMessage = "##SECRET##" + message;
     

        let imageBuffer = fs.readFileSync(inputPath);

        // USE finalMessage (FIXED)
        let binaryMessage = finalMessage.split("").map(char =>
            char.charCodeAt(0).toString(2).padStart(8, "0")
        ).join("");

        // End marker
        binaryMessage += "11111110";

        let buffer = Buffer.from(imageBuffer);

        // Check size
        if (binaryMessage.length > buffer.length) {
            throw new Error("Message too large for this image");
        }

        // Embed message
        for (let i = 0; i < binaryMessage.length; i++) {
            let bit = parseInt(binaryMessage[i]);
            buffer[i] = (buffer[i] & 254) | bit;
        }

        fs.writeFileSync(outputPath, buffer);

        return "Message hidden successfully!";
    } catch (err) {
        console.error(err);
        return "Error hiding message";
    }
}
/*
 EXTRACT MESSAGE FROM IMAGE
*/
function extractMessage(imagePath) {
    try {
        let imageBuffer = fs.readFileSync(imagePath);

        let binary = "";

        for (let i = 0; i < imageBuffer.length; i++) {
            binary += (imageBuffer[i] & 1);
        }

        let bytes = binary.match(/.{1,8}/g);

        let message = "";

        for (let byte of bytes) {
            if (byte === "11111110") break;

            let charCode = parseInt(byte, 2);
            message += String.fromCharCode(charCode);
        }

        // ✅ CHECK MARKER AFTER FULL EXTRACTION
        if (!message.startsWith("##SECRET##")) {
            return "❌ Not an encoded image";
        }

        // ✅ REMOVE MARKER
        return message.replace("##SECRET##", "");

    } catch (err) {
        console.error(err);
        return "Error extracting message";
    }
}


/*
🖼️ MULTI-IMAGE STEGANOGRAPHY
*/
function hideMessageMulti(images, message) {
    let parts = message.match(/.{1,20}/g);

    if (parts.length > images.length) {
        throw new Error("Not enough images for message");
    }

    let results = [];

    for (let i = 0; i < parts.length; i++) {
        let output = `output/encoded_${i}.png`;
        hideMessage(images[i], output, parts[i]);
        results.push(output);
    }

    return results;
}
/*

🔍 BASIC STEGO CHECK
*/
function detectStego(imagePath) {
    let buffer = fs.readFileSync(imagePath);

    let changes = 0;

    for (let i = 1; i < 1000; i++) {
        if ((buffer[i] & 1) !== (buffer[i - 1] & 1)) {
            changes++;
        }
    }

    return changes > 400
        ? "Possible hidden data detected"
        : "Image looks normal";
}


module.exports = {
    hideMessage,
    extractMessage,
    hideMessageMulti,
    detectStego
};