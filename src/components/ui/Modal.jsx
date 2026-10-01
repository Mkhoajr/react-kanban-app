import { useEffect } from 'react';
import { FiX } from 'react-icons/fi';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-md' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div 
        className={`w-full ${maxWidth} rounded-xl bg-[#22272b] border border-[#38414a] shadow-2xl text-[#b6c2cf] overflow-hidden`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#38414a] px-4 py-3">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#8c9bab] hover:bg-[#38414a] hover:text-white transition"
          >
            <FiX size={18} />
          </button>
        </div>
        <div className="p-4 max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#38414a]">
          {children}
        </div>
      </div>
    </div>
  );
}
