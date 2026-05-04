import { AlertTriangle, KeyRound, LoaderCircle, ScanSearch, Unlock, Link2 } from "lucide-react";
import { useState } from "react";
import Button from "../ui/Button";

// const API_BASE = "http://localhost:4002";
const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4002";


function DecodePanel() {
  const [stegoFile, setStegoFile] = useState(null);
  const [stegoLink, setStegoLink] = useState("");
  const [key, setKey] = useState("");
  const [isDecoding, setIsDecoding] = useState(false);
  const [status, setStatus] = useState(null);

  const canDecode = (Boolean(stegoFile) || stegoLink.trim().length > 0) && key.trim().length > 0;

  const handleDecode = async () => {
    if (!canDecode) {
      setStatus({
        type: "error",
        title: "Missing secure inputs",
        message: "Upload a stego-image and enter the decryption key to continue.",
      });
      return;
    }

    setIsDecoding(true);
    setStatus(null);

    try {
      const formData = new FormData();
      if (stegoFile) {
        formData.append("image", stegoFile);
      } else if (stegoLink) {
        formData.append("imageUrl", stegoLink);
      }
      formData.append("password", key);

      const res = await fetch(`${API_BASE}/extract`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Decryption failed");
      }

      setStatus({
        type: "success",
        title: "Hidden message recovered",
        message: "Payload successfully identified, extracted, and decrypted with the supplied key.",
        secret: data.message,
      });
    } catch (err) {
      setStatus({
        type: "error",
        title: "Extraction failed",
        message: err.message || "The provided key could not validate the hidden payload.",
      });
    } finally {
      setIsDecoding(false);
    }
  };



  return (
    <section className="glass-panel rounded-[2rem] p-6 md:p-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-violet-600">
            Decode Section
          </p>
          <h2 className="mt-2 text-2xl font-bold text-black">Decode and Extract Secret</h2>
        </div>
        <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-600">
          <Unlock className="h-6 w-6" />
        </div>
      </div>

      <div className="space-y-5">
        <label className="block">
          {/* <span className="mb-2 block text-sm font-medium text-gray-800">Upload stego-image OR paste link</span> */}
          <span className="mb-2 block text-sm font-medium text-gray-800">Upload stego-image </span>
          <div className="rounded-3xl border border-dashed border-violet-300/24 bg-violet-400/6 p-5 space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 text-sm text-gray-700">
                <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-600">
                  <ScanSearch className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {stegoFile ? stegoFile.name : "Choose the stego-image you received"}
                  </p>
                  <p className="text-gray-600">System will perform payload extraction on decode.</p>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(event) => {
                  setStegoFile(event.target.files?.[0] ?? null);
                  if (event.target.files?.[0]) setStegoLink("");
                }}
                className="block w-full max-w-xs cursor-pointer rounded-full border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 file:mr-3 file:rounded-full file:border-0 file:bg-violet-400/15 file:px-4 file:py-2 file:text-violet-600"
              />
            </div>

            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10"></div>
              <span className="text-xs font-semibold uppercase tracking-widest text-gray-500">OR</span>
              <div className="h-px flex-1 bg-white/10"></div>
            </div>

            <div className="relative">
              <Link2 className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
              <input
                type="url"
                value={stegoLink}
                onChange={(event) => {
                  setStegoLink(event.target.value);
                  if (event.target.value) setStegoFile(null);
                }}
                placeholder="Paste the secure share link..."
                className="w-full rounded-3xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-violet-600/60 focus:ring-2 focus:ring-violet-600/25"
              />
            </div>
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-gray-800">Enter decryption key</span>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="password"
              value={key}
              onChange={(event) => setKey(event.target.value)}
              placeholder="••••••••"
              minLength={6}
              maxLength={6}
              pattern="(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{6}"
              title="Must be 6 characters including at least one letter, one number, and one symbol"
              className="w-full rounded-3xl border border-gray-200 bg-gray-50 py-4 pl-12 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:border-violet-600/60 focus:ring-2 focus:ring-violet-600/25"
            />
          </div>
        </label>

        <div className="rounded-3xl border border-gray-200 bg-gray-100 p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-gray-600">
            Secure Decode Checklist
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              "Verify link and source image",
              "Supply correct decryption key",
              "Extract hidden payload",
              "Display plaintext to user",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-800">
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            variant="primary"
            onClick={handleDecode}
            disabled={isDecoding || !canDecode}
            className="w-full sm:w-auto"
          >
            {isDecoding ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                Decoding Secure Payload...
              </>
            ) : (
              "Decode Message"
            )}
          </Button>
        </div>

        {status ? (
          <div
            className={`opacity-0 fade-in-up rounded-3xl border p-5 ${status.type === "success"
              ? "border-emerald-300/20 bg-emerald-400/8"
              : "border-rose-300/20 bg-rose-400/8"
              }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`rounded-2xl p-3 ${status.type === "success"
                  ? "bg-emerald-400/12 text-emerald-300"
                  : "bg-rose-400/12 text-rose-300"
                  }`}
              >
                {status.type === "success" ? (
                  <Unlock className="h-5 w-5" />
                ) : (
                  <AlertTriangle className="h-5 w-5" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{status.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-800">{status.message}</p>
                {status.secret ? (
                  <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-200 px-4 py-4">
                    <span className="block text-xs uppercase tracking-[0.24em] text-gray-500">
                      Extracted Message
                    </span>
                    <p className="mt-2 text-sm leading-6 text-gray-900">{status.secret}</p>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default DecodePanel;

