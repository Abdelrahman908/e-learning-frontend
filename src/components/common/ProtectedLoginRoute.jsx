// components/common/ProtectedLoginRoute.jsx
import { useAuth } from "../../contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import LoadingSpinner from "../ui/LoadingSpinner";

const ProtectedLoginRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <LoadingSpinner fullScreen />;
  
  if (isAuthenticated) {
    // Redirect to saved path or home
    const redirectPath = localStorage.getItem('redirectPath') || '/';
    localStorage.removeItem('redirectPath');
    return <Navigate to={redirectPath} replace />;
  }
  
  return children;
};

export default ProtectedLoginRoute;