import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  
  // Kiểm tra token/user lưu tạm dưới localStorage để tránh bị lệch nhịp state
  const hasToken = localStorage.getItem('token') || localStorage.getItem('user');

  // Khi AuthContext đang khởi tạo hoặc đang xử lý login, hiển thị trạng thái chờ
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1d2125] text-white">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Nếu không có user trong state VÀ cũng không có token lưu trong máy -> Mới đá về /login
  if (!user && !hasToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}