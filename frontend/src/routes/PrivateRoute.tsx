import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PrivateRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const { currentUser, userData, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!currentUser) {
    return <Navigate to="/" />;
  }

  if (requireAdmin && (!userData || userData.role !== 'admin')) {
    return <Navigate to="/intervenant" />;
  }

  return <>{children}</>;
};