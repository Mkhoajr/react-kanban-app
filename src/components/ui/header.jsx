import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiSearch, 
  FiBell, 
  FiHelpCircle, 
  FiGrid, 
  FiLogOut,
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

export default function Header({ onSearch}) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="flex h-12 items-center justify-between border-b border-[#282e33] bg-[#1d2125] px-4">
      {/* Block 1: Left Nav (Logo & Apps) */}
      <div className="flex flex-1 items-center gap-3">
            <button 
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded text-[#9fadbc] hover:bg-[#282e33]"
            >
            <FiGrid size={18} />
            </button>
            
            {/* Logo */}
            <Link
                to="/" 
                className="flex items-center gap-1.5 font-bold text-[#b6c2cf] hover:text-white cursor-pointer">
                <div className="flex h-5 w-5 items-center justify-center rounded-sm bg-[#579dff] text-[#1d2125]">
                    <div className="flex gap-[2px]">
                    <div className="h-3 w-1 bg-[#1d2125] rounded-[1px]" />
                    <div className="h-2 w-1 bg-[#1d2125] rounded-[1px]" />
                    </div>
                </div>
                <span className="text-base font-extrabold tracking-tight text-white">Kanban</span>
            </Link>
        </div>

      {/* Block 2: Center Search & Create */}
      <div className="flex items-center justify-center gap-2 px-4">
        <div className="flex h-8 w-48 sm:w-64 md:w-80 lg:w-[500px] items-center gap-2 rounded border border-[#38414a] bg-[#22272b] px-3 focus-within:border-[#579dff] transition-all">
          <FiSearch className="flex-shrink-0 text-[#8c9bab]" size={14} />
          <input
            type="text"
            placeholder="Search"
            onChange={(e) => onSearch?.(e.target.value)}
            className="w-full bg-transparent text-sm text-[#b6c2cf] placeholder-[#8c9bab] focus:outline-none"
          />
        </div>
      </div>

      {/* Block 3: Right Nav Actions & User Avatar */}
      <div className="flex flex-1 items-center justify-end gap-2">
        <button 
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#9fadbc] hover:bg-[#282e33]"
        >
          <FiBell size={16} />
        </button>
        <button 
          type="button"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#9fadbc] hover:bg-[#282e33]"
        >
          <FiHelpCircle size={16} />
        </button>

        {/* User Avatar & Dropdown */}
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white cursor-pointer border-2 border-[#579dff] hover:opacity-80"
            title={user?.name}
          >
            {user?.picture ? (
              <img 
                src={user.picture} 
                alt={user.name}
                className="h-7 w-7 rounded-full"
              />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#0055cc]">
                {user?.name?.charAt(0)?.toUpperCase()}
              </div>
            )}
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-[#22272b] border border-[#38414a] z-50">
              <div className="px-4 py-3 border-b border-[#38414a]">
                <p className="text-sm font-semibold text-white">{user?.name}</p>
                <p className="text-xs text-[#8c9bab]">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-[#b6c2cf] hover:bg-[#282e33] flex items-center gap-2 transition-colors"
              >
                <FiLogOut size={16} />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}