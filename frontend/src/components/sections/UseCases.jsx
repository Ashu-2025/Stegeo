import { GlobeLock, ScanEye, WalletCards } from "lucide-react";
import SectionHeading from "../ui/SectionHeading";

function UseCases() {
  const cases = [
    {
      icon: GlobeLock,
      title: "Secure Communication",
      text: "Exchange confidential text through images when privacy and message secrecy are essential.",
    },
    {
      icon: ScanEye,
      title: "Digital Privacy",
      text: "Avoid exposing sensitive information in plain text across messaging and sharing channels.",
    },
    {
      icon: WalletCards,
      title: "Data Protection",
      text: "Protect project details, credentials, or private notes with a more discreet delivery format.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
      <SectionHeading
        eyebrow="Use Cases"
        title="Useful anywhere sensitive information needs a more discreet path"
        description="This approach is especially relevant for private communication, secure demonstrations, and educational cybersecurity projects."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {cases.map(({ icon: Icon, title, text }, index) => (
          <article
            key={title}
            className="glass-panel rounded-3xl p-6 opacity-0 fade-in-up"
            style={{ animationDelay: `${index * 0.14}s` }}
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

export default UseCases;
