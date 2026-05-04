import { ArrowRight, ImageUp, LockKeyhole, ScanSearch } from "lucide-react";
import Button from "../ui/Button";

function Hero() {
  return (
    <section id="top" className="mx-auto max-w-7xl px-6 pb-16 pt-16 lg:px-8 lg:pt-24">
      <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="opacity-0 fade-in-up">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-300/20 bg-violet-400/10 px-4 py-2 text-sm font-medium text-violet-600">
            <LockKeyhole className="h-4 w-4" />
            Secure Your Data with Invisible Communication
          </p>

          <h1 className="max-w-4xl text-4xl font-black leading-tight text-[#000000] sm:text-5xl lg:text-6xl">
            Hide Secret Messages{" "}
            <span className="bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-600 bg-clip-text text-transparent">
              Inside Image
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#000000]">
            A modern image steganography platform that encrypts sensitive data with AES,
            embeds it inside an image, and supports secure sharing with one-time access,
            auto-expiry links, and QR-based key distribution.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button href="/encode">Encode Message</Button>
            <Button href="/decode" variant="secondary">
              Decode Message
            </Button>
          </div>

          <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <ImageUp className="h-4 w-4 text-violet-500" />
              Stego-image generation
            </div>
            <div className="flex items-center gap-2">
              <ScanSearch className="h-4 w-4 text-violet-500" />
              Secure decoding workflow
            </div>
            <div className="flex items-center gap-2">
              <ArrowRight className="h-4 w-4 text-violet-500" />
              Portfolio-ready project showcase
            </div>
          </div>
        </div>

        <div className="opacity-0 fade-in-up delay-2">
          <div className="glass-panel neon-ring relative overflow-hidden rounded-[2rem] p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(139,92,246,0.18),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(167,139,250,0.16),transparent_26%)]" />
            <div className="relative space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-gray-600">
                    Security Layer
                  </p>
                  <p className="mt-2 text-lg font-semibold text-gray-900">AES + Steganography</p>
                </div>
                <div className="pulse-glow rounded-full bg-purple-400/18 px-4 py-2 text-sm font-medium text-purple-600">
                  Active
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-gray-200 bg-gray-100 p-4">
                  <p className="text-sm text-gray-600">Hidden Payload</p>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">256-bit AES</p>
                </div>
                <div className="rounded-2xl border border-gray-200 bg-gray-100 p-4">
                  <p className="text-sm text-gray-600">Stego Delivery</p>
                  <p className="mt-3 text-2xl font-semibold text-gray-900">One-Time Share</p>
                </div>
              </div>

              <div className="rounded-3xl border border-violet-300/16 bg-gray-50 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800">Workflow Monitor</p>
                  <span className="text-xs uppercase tracking-[0.24em] text-purple-600/80">
                    Secure Pipeline
                  </span>
                </div>

                <div className="space-y-3">
                  {[
                    "Encrypt plaintext message",
                    "Embed encrypted payload in image",
                    "Generate temporary secure share link",
                  ].map((step) => (
                    <div
                      key={step}
                      className="flex items-center justify-between rounded-2xl border border-gray-200 bg-gray-100 px-4 py-3 text-sm text-gray-800"
                    >
                      <span>{step}</span>
                      <span className="rounded-full bg-purple-400/12 px-3 py-1 text-xs text-purple-600">
                        Ready
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
