import { useState } from 'react';
import Header from '../components/ui/header';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiLock, FiBell, FiShield } from 'react-icons/fi';
import Button from '../components/common/Button';

export default function SettingsPage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#1d2125] text-[#9fadbc] font-sans">
      <Header />
      <main className="mx-auto max-w-3xl px-6 py-8">
        <h1 className="text-2xl font-bold text-white mb-6">Account Settings</h1>

        {saved && (
          <div className="mb-4 p-3 rounded-lg bg-[#203a30] text-[#2bbb75] border border-[#1f845a] text-sm">
            Settings updated successfully!
          </div>
        )}

        <div className="rounded-xl bg-[#22272b] border border-[#38414a] p-6 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[#38414a]">
            {user?.picture ? (
              <img src={user.picture} alt={user.name} className="h-16 w-16 rounded-full border-2 border-[#579dff]" />
            ) : (
              <div className="h-16 w-16 rounded-full bg-[#0055cc] flex items-center justify-center text-xl font-bold text-white">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <h2 className="text-lg font-bold text-white">{user?.name || 'User'}</h2>
              <p className="text-xs text-[#8c9bab]">{user?.email || 'user@example.com'}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8c9bab] mb-1">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg bg-[#1d2125] px-3 py-2 text-sm text-white border border-[#38414a] focus:border-[#579dff] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#8c9bab] mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-[#1d2125] px-3 py-2 text-sm text-white border border-[#38414a] focus:border-[#579dff] focus:outline-none"
              />
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit">Save Changes</Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
