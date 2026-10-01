export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-[#579dff] text-[#1d2125] hover:bg-[#79b8ff] focus:ring-[#579dff]',
    secondary: 'bg-[#22272b] text-[#b6c2cf] hover:bg-[#38414a] border border-[#38414a]',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'bg-transparent text-[#b6c2cf] hover:bg-[#282e33] hover:text-white',
  };

  const sizes = {
    sm: 'px-2.5 py-1 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
