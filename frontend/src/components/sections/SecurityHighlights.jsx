import { Fingerprint, Layers3, LockKeyholeOpen, Shield } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const points = [
  {
    icon: Layers3,
    title: "Dual-Layer Security",
    text: "The message is encrypted first and hidden second, combining confidentiality with concealment.",
  },
  {
    icon: Shield,
    title: "Unauthorized Access Protection",
    text: "Without the correct key and extraction path, the hidden payload remains inaccessible and unreadable.",
  },
  {
    icon: Fingerprint,
    title: "Controlled Sharing",
    text: "One-time retrieval and expiry-based delivery reduce the attack window for intercepted links.",
  },
  {
    icon: LockKeyholeOpen,
    title: "Confidential Data Recovery",
    text: "Only trusted recipients can recover and decrypt the hidden information through a guided decode flow.",
  },
];

function SecurityHighlights() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionHeading
        eyebrow="Security Highlights"
        title="Security is not a single feature here, it is the full interaction model"
        description="This concept treats privacy as a system design problem by securing data before transmission, during transport, and at the point of access."
      />

      <div className="grid gap-6 md:grid-cols-2">
        {points.map(({ icon: Icon, title, text }, index) => (
          <div
            key={title}
            className="glass-panel rounded-3xl p-6 opacity-0 fade-in-up"
            style={{ animationDelay: `${index * 0.12}s` }}
          >
            <div className="flex items-start gap-4">
              <div className="rounded-2xl bg-violet-500/10 p-3 text-violet-600">
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-black">{text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default SecurityHighlights;
