function Button({
  children,
  href,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
}) {
  const base =
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/80 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 active:scale-95";
  const variants = {
    primary:
      "bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30 hover:scale-105 hover:shadow-violet-500/40 hover:-translate-y-1",
    secondary:
      "bg-white/40 backdrop-blur-md border border-violet-500/30 text-violet-700 shadow-sm hover:scale-105 hover:-translate-y-1 hover:bg-white/60 hover:border-violet-500/50 hover:shadow-violet-500/20",
  };

  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <a className={classes} href={href}>
        {children}
      </a>
    );
  }

  return (
    <button className={classes} onClick={onClick} type={type} disabled={disabled}>
      {children}
    </button>
  );
}

export default Button;
