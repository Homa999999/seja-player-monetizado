export default function Logo({ size = 'md' }) {
  return (
    <div className={`brand-logo brand-logo--${size}`}>
      <span className="brand-logo__icon">
        <svg viewBox="0 0 32 32" fill="none"><rect width="32" height="32" rx="8" fill="url(#g)"/><path d="M8 22V10h16v12" stroke="#fff" strokeWidth="1.5" strokeLinecap="round"/><path d="M10 22c3-6 6-10 12-8" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round"/><defs><linearGradient id="g" x1="0" y1="0" x2="32" y2="32"><stop stopColor="#10b981"/><stop offset="1" stopColor="#059669"/></linearGradient></defs></svg>
      </span>
      <span className="brand-logo__text">
        <strong>Player</strong>Monetizado
      </span>
    </div>
  );
}
