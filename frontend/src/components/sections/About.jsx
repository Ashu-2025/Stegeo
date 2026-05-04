import { EyeOff, MessagesSquare, ShieldEllipsis } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

function About() {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionHeading
        eyebrow="About Project"
        title="Steganography turns ordinary images into silent carriers of private information"
        description="Instead of sending a message in visible text, the system encrypts it first and then hides it inside an image. To anyone else, the image looks normal. Only a trusted recipient with the correct key can recover the protected content."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          {
            icon: EyeOff,
            title: "Invisible by Design",
            text: "Steganography conceals the presence of data itself, making the communication less obvious than sending an encrypted message alone.",
          },
          {
            icon: ShieldEllipsis,
            title: "Built for Secure Communication",
            text: "AES encryption protects the message before embedding, adding a second layer of defense against interception and unauthorized access.",
          },
          {
            icon: MessagesSquare,
            title: "Practical for Modern Sharing",
            text: "The project extends beyond hiding data by supporting one-time access, auto-expiry links, and QR-based key sharing for safer exchange.",
          },
        ].map(({ icon: Icon, title, text }, index) => (
          <article
            key={title}
            className={`glass-panel rounded-3xl p-6 opacity-0 fade-in-up delay-${index + 1}`}
          >
            <div className="mb-5 inline-flex rounded-2xl bg-violet-500/10 p-3 text-violet-600">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-black">{title}</h3>
            <p className="mt-3 text-sm leading-7 text-black">{text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default About;
