import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface AdminGuardProps {
  children: React.ReactNode;
}

const AdminGuard = ({ children }: AdminGuardProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  return <>{children}</>;
};

export default AdminGuard;
