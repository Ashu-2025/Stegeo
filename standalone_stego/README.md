# StegoShare Full-Stack Implementation

This is a complete standalone Image Steganography website built with Node.js, Express, and Vanilla JS.

## Features
- **Modern UI**: Lavender-themed, glassmorphic design.
- **Secure Encoding**: AES-256 encryption + LSB steganography.
- **Native Sharing**: Integrated with the `navigator.share()` API to send images directly to WhatsApp, Telegram, etc.
- **Responsive**: Works perfectly on mobile and desktop.

## Installation

1. Navigate to the `standalone_stego` folder:
   ```bash
   cd standalone_stego
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. Open your browser:
   `http://localhost:3000`

## How it works
1. **Hide**: Upload an image, type a secret message and a 6-character key. The server encrypts the message and embeds it into the pixels of the image.
2. **Share**: Click "Share Image" to use your device's native sharing menu (mobile) or copy the link (desktop).
3. **Extract**: Upload the stego-image, enter the key, and the secret message is revealed!

## Dependencies
- `express`: Web server
- `multer`: File uploads
- `jimp`: Image pixel manipulation
- `crypto`: Built-in Node.js encryption
- `cors`: Cross-Origin support
