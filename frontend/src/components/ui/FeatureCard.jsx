function FeatureCard({ icon: Icon, title, description, accent = "teal", delayClass = "" }) {
  const accentMap = {
    violet: "from-violet-400/20 to-purple-400/5 text-violet-600",
    purple: "from-purple-400/20 to-indigo-400/5 text-purple-600",
    indigo: "from-indigo-400/20 to-violet-400/5 text-indigo-600",
  };

  return (
    <article
      className={`glass-panel group rounded-3xl p-6 opacity-0 fade-in-up ${delayClass} transition duration-300 hover:-translate-y-1 hover:border-violet-300/40`}
    >
      <div
        className={`mb-5 inline-flex rounded-2xl bg-gradient-to-br ${accentMap[accent] || accentMap.violet} p-3`}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-black">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-black">{description}</p>
    </article>
  );
}

export default FeatureCard;
