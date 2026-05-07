import { Copy, Download, ImageUp, Link2, LoaderCircle, QrCode, Sparkles, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";
import { QRCodeSVG } from "qrcode.react";

// const API_BASE = "http://localhost:4002";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4002";


function EncodePanel() {
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEncoding, setIsEncoding] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const canEncode = Boolean(
    message && message.trim().length > 0 &&
    selectedFile !== null &&
    password && password.trim().length > 0
  );

  const handleEncode = async () => {
    if (!canEncode) {
      return;
    }

    setIsEncoding(true);
    setResult(null);
    setError(null);

    try {
      // 1. Hide/Encode message in image
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      
      const formData = new FormData();
      formData.append("image", selectedFile);
      formData.append("message", message);
      formData.append("password", password);
      if (user) formData.append("username", user.username);

      const hideRes = await fetch(`${API_BASE}/hide`, {
        method: "POST",
        body: formData,
      });

      const hideData = await hideRes.json();
      if (!hideRes.ok) throw new Error(hideData.error || "Encoding failed");

      // 2. Share the generated stego image
      const shareRes = await fetch(`${API_BASE}/share`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filePath: hideData.downloadLocal,
          expiryHours: 24,
          selfDestruct: false
        }),
      });

      const shareData = await shareRes.json();
      if (!shareRes.ok) throw new Error(shareData.error || "Sharing failed");

      setResult({
        key: password,
        fileName: `stego-${selectedFile.name}`,
        link: shareData.shareLink,
        expires: "24 hours",
        downloadUrl: shareData.shareLink,
        note: "Message encrypted, embedded, and prepared for secure delivery.",
      });

      // Auto-download the image
      try {
        const response = await fetch(shareData.shareLink);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = blobUrl;
        anchor.download = `stego-${selectedFile.name}`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        window.URL.revokeObjectURL(blobUrl);
      } catch (dlErr) {
        console.error("Auto-download failed:", dlErr);
      }

      // Redirection removed as per user request

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsEncoding(false);
    }
  };



  const handleCopy = async () => {
    if (!result) {
      return;
    }

    try {
      await navigator.clipboard.writeText(result.link);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = async () => {
    if (!result) return;

    try {
      const response = await fetch(result.downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const anchor = document.createElement("a");
      anchor.href = blobUrl;
      anchor.download = result.fileName;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Direct download failed, opening in new tab:", err);
      // Fallback if CORS prevents the fetch
      const anchor = document.createElement("a");
      anchor.href = result.downloadUrl;
      anchor.download = result.fileName;
      anchor.target = "_blank";
      anchor.click();
    }
  };

  return (
    <section className="glass-panel rounded-[2rem] p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600/80">
            Encode Section
          </p>
          <h2 className="mt-2 text-2xl font-bold text-black">Encrypt and Embed Message</h2>
        </div>
        <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-600">
          <Sparkles className="h-6 w-6" />
        </div>
      </div>

      <div className="space-y-5">
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-800">Secret message</span>
          <textarea
            rows="4"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Type the confidential message you want to hide..."
            className="w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-violet-300/60 focus:ring-2 focus:ring-violet-300/25"
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-800">Security Password</span>
          <div className="relative">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              minLength={6}
              maxLength={6}
              pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6}"
              title="Must be 6 characters including at least one letter, one number, and one symbol"
              className="w-full rounded-full border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition focus:border-violet-300/60 focus:ring-2 focus:ring-violet-300/25"
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-800">Upload cover image</span>
          <div className="rounded-3xl border border-dashed border-violet-300/24 bg-violet-400/6 p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-600">
                  <ImageUp className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium text-gray-900">
                    {selectedFile ? selectedFile.name : "Upload an Image"}
                  </p>
                  <p className="text-gray-600 text-xs mt-1">Image is required for steganography.</p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
                className="block w-full max-w-xs cursor-pointer rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 file:mr-3 file:rounded-full file:border-0 file:bg-violet-400/15 file:px-4 file:py-2 file:text-violet-600"
              />
            </div>
          </div>
        </label>

        <div className="rounded-3xl border border-gray-200 bg-gray-100 p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-600">
              Security Pipeline
            </h3>
            <span className="rounded-full border border-violet-300/20 bg-violet-500/10 px-3 py-1 text-xs text-violet-300">
              Active Server
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {["AES Encryption", "LSB Embedding", "Cloud Storage"].map((item) => (
              <div key={item} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                {item}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleEncode} disabled={!canEncode || isEncoding} className="w-full sm:w-auto">
            {isEncoding ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Processing Pipeline...
              </>
            ) : (
              "Encrypt + Encode"
            )}
          </Button>
        </div>

        {result ? (
          <div className="glass-panel rounded-3xl border border-violet-600/20 p-5 opacity-0 fade-in-up">
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-600/80">
                  Stego Package Ready
                </p>
                <h3 className="mt-2 text-xl font-semibold text-[#4c1d95]">{result.fileName}</h3>
                <p className="mt-2 text-sm text-gray-700">Image successfully downloaded. You can now share the link or key.</p>
              </div>
              <div className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                Success
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div className="space-y-3">
                <div className="rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-800">
                  <span className="block text-xs uppercase tracking-[0.24em] text-gray-500">Decryption Key</span>
                  <span className="mt-2 block font-medium text-gray-900">{result.key}</span>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-800">
                  <span className="block text-xs uppercase tracking-[0.24em] text-gray-500">Secure Share Link</span>
                  <span className="mt-2 block break-all text-gray-900">{result.link}</span>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-800">
                  <span className="block text-xs uppercase tracking-[0.24em] text-gray-500">Expiry</span>
                  <span className="mt-2 block text-gray-900">One-time access • {result.expires}</span>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={handleDownload} variant="secondary">
                    <Download className="mr-2 h-4 w-4" />
                    Download Stego-Image
                  </Button>
                  <Button onClick={handleCopy} variant="secondary">
                    <Copy className="mr-2 h-4 w-4" />
                    {copied ? "Copied" : "Copy Share Link"}
                  </Button>
                  <Button href="/decode" className="bg-violet-500/20 text-violet-600 hover:bg-violet-500/30 border border-violet-500/50">
                    Go to Decode Page
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-3xl border border-violet-300/14 bg-slate-950/75 p-4 flex flex-col">
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-violet-200">
                  <QrCode className="h-4 w-4" />
                  Scan to Access
                </div>
                <div className="mx-auto rounded-2xl bg-white p-3 flex items-center justify-center">
                  <QRCodeSVG
                    value={result.link}
                    size={144}
                    bgColor={"#ffffff"}
                    fgColor={"#020617"}
                    level={"L"}
                    includeMargin={false}
                  />
                </div>
                <p className="mt-3 text-center text-xs leading-5 text-slate-400">
                  Scan to open the share link directly.
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default EncodePanel;

