import { Braces, Cpu, DatabaseZap } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

const stack = [
  {
    icon: Braces,
    title: "Frontend",
    items: ["React", "Tailwind CSS", "JavaScript"],
    description: "Responsive user interface with reusable components and interactive workflow panels.",
  },
  {
    icon: Cpu,
    title: "Backend",
    items: ["Python", "Secure API logic", "Image handling pipeline"],
    description: "Python serves as the application core for encryption operations, routing, and processing logic.",
  },
  {
    icon: DatabaseZap,
    title: "Libraries",
    items: ["OpenCV", "cryptography (AES)", "QR utilities"],
    description: "Image processing and encryption utilities support the hidden-message and secure-sharing lifecycle.",
  },
];

function TechnologyStack() {
  return (
    <section id="stack" className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionHeading
        eyebrow="Technology Stack"
        title="A practical stack for secure image-based communication"
        description="The project pairs a clean browser experience with Python-powered processing and trusted security libraries."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {stack.map(({ icon: Icon, title, items, description }, index) => (
          <article
            key={title}
            className="glass-panel rounded-3xl p-6 opacity-0 fade-in-up"
            style={{ animationDelay: `${index * 0.14}s` }}
          >
            <div className="mb-5 inline-flex rounded-2xl bg-violet-500/10 p-3 text-violet-600">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-semibold text-black">{title}</h3>
            <p className="mt-3 text-sm leading-6 text-black">{description}</p>
            <ul className="mt-5 space-y-2 text-sm text-black">
              {items.map((item) => (
                <li key={item} className="rounded-2xl border border-violet-200 bg-white/60 px-4 py-3">
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}

export default TechnologyStack;
