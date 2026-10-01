import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';
import Button from '../components/common/Button';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-[#1d2125] text-white flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#4c2222] text-[#ef7564] border border-[#b83a3a] mb-4">
        <FiAlertTriangle size={32} />
      </div>
      <h1 className="text-4xl font-extrabold mb-2">Page Not Found</h1>
      <p className="text-sm text-[#8c9bab] max-w-md mb-6">
        The page you are looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link to="/">
        <Button>Back to Boards</Button>
      </Link>
    </div>
  );
}
