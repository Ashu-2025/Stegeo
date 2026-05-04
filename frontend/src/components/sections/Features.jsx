import {
  ImagePlus,
  KeyRound,
  Link2,
  QrCode,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import SectionHeading from "../ui/SectionHeading";
import FeatureCard from "../ui/FeatureCard";

const features = [
  {
    icon: KeyRound,
    title: "AES Message Encryption",
    description:
      "Sensitive text is secured before embedding, reducing the risk of readable data exposure even if the payload is detected.",
    accent: "teal",
  },
  {
    icon: ImagePlus,
    title: "Image-Based Data Hiding",
    description:
      "Encrypted content is embedded into a cover image while preserving its visible appearance for discreet transmission.",
    accent: "blue",
  },
  {
    icon: ShieldCheck,
    title: "Stego-Image Generation",
    description:
      "The system produces a stego-image that behaves like a normal image file while safely carrying the hidden payload.",
    accent: "green",
  },
  {
    icon: Link2,
    title: "One-Time Secure Access",
    description:
      "Shared access can be limited to a single authorized retrieval, minimizing exposure after delivery.",
    accent: "blue",
  },
  {
    icon: TimerReset,
    title: "Auto-Expiry Links",
    description:
      "Temporary links automatically expire after a defined period, adding a time-based control to the sharing process.",
    accent: "teal",
  },
  {
    icon: QrCode,
    title: "QR Code Key Sharing",
    description:
      "Decryption keys can be shared as scannable QR content, improving convenience without sacrificing a secure experience.",
    accent: "green",
  },
];

function Features() {
  return (
    <section id="features" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionHeading
        eyebrow="Features"
        title="Every layer is designed for confidentiality, control, and seamless sharing"
        description="The project combines cryptography, hidden-image transmission, and controlled-access sharing patterns to create a stronger communication workflow."
      />

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            {...feature}
            delayClass={`delay-${(index % 4) + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

export default Features;
