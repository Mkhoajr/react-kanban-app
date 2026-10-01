export default function Avatar({ src, name, size = 'sm', className = '' }) {
  const sizes = {
    xs: 'h-6 w-6 text-[10px]',
    sm: 'h-7 w-7 text-xs',
    md: 'h-9 w-9 text-sm',
    lg: 'h-12 w-12 text-base',
  };

  const initials = name
    ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={`rounded-full object-cover border border-[#38414a] ${sizes[size]} ${className}`}
      />
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-[#0055cc] font-bold text-white border border-[#38414a] ${sizes[size]} ${className}`}>
      {initials}
    </div>
  );
}
