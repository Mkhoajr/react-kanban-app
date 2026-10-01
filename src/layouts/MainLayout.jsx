import Header from '../components/layout/Header';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#1d2125] text-[#9fadbc] font-sans flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
