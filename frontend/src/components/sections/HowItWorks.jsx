import { Lock, ScanLine, Send, Upload, WandSparkles } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const steps = [
  {
    icon: Upload,
    title: "Enter Secret Message",
    description: "The sender writes the sensitive text and selects a cover image.",
  },
  {
    icon: Lock,
    title: "Encrypt Message",
    description: "AES transforms the message into ciphertext before any embedding begins.",
  },
  {
    icon: WandSparkles,
    title: "Embed into Image",
    description: "The encrypted payload is hidden inside image data to create a stego-image.",
  },
  {
    icon: Send,
    title: "Share Securely",
    description: "The image can be delivered with one-time access, expiry, and protected key exchange.",
  },
  {
    icon: ScanLine,
    title: "Decode with Key",
    description: "An authorized recipient extracts and decrypts the hidden message using the correct key.",
  },
];

function HowItWorks() {
  return (
    <section id="workflow" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionHeading
        eyebrow="How It Works"
        title="A simple flow backed by strong security principles"
        description="The process keeps the user experience straightforward while combining encryption and image steganography under the hood."
      />

      <div className="glass-panel rounded-[2rem] p-6 md:p-8">
        <div className="grid gap-5 lg:grid-cols-5">
          {steps.map(({ icon: Icon, title, description }, index) => (
            <div
              key={title}
              className="relative opacity-0 fade-in-up"
              style={{ animationDelay: `${index * 0.12}s` }}
            >
              <div className="h-full rounded-3xl border border-white/8 bg-white/5 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.28em] text-violet-500">
                    0{index + 1}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-black">{description}</p>
              </div>

              {index < steps.length - 1 ? (
                <div
                  className="absolute -right-3 top-1/2 hidden h-0.5 w-6 -translate-y-1/2 bg-gradient-to-r from-teal-300 to-sky-400 lg:block"
                  aria-hidden="true"
                />
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
