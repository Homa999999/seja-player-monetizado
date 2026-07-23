export default function Icon({ name, className = '' }) {
  return <i className={`fas fa-${name} ${className}`.trim()} aria-hidden="true" />;
}
