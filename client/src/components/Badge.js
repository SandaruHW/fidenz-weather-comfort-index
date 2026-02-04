export default function Badge({ children, variant = 'default' }) {
  const base = "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border";
  const variants = {
    success: 'bg-green-100 text-green-800 border-green-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    danger: 'bg-orange-100 text-orange-800 border-orange-300',
    default: 'bg-gray-100 text-gray-800 border-gray-300',
  };

  return (
    <span className={`${base} ${variants[variant] || variants.default}`}>
      {children}
    </span>
  );
}