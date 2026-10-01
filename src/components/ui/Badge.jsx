export default function Badge({ children, color = 'slate', className = '' }) {
  const colors = {
    slate: 'bg-[#282e33] text-[#b6c2cf] border border-[#38414a]',
    blue: 'bg-[#1c2b41] text-[#579dff] border border-[#205493]',
    green: 'bg-[#203a30] text-[#2bbb75] border border-[#1f845a]',
    red: 'bg-[#4c2222] text-[#ef7564] border border-[#b83a3a]',
    yellow: 'bg-[#413822] text-[#f5cd47] border border-[#8a721c]',
  };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color] || colors.slate} ${className}`}>
      {children}
    </span>
  );
}
