import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { getRawToken } from '../../utils/storage';

/**
 * Week 5 Day 1 & Day 4: Protected route component.
 * Reads the authentication token directly from Local Storage.
 * If the user is unauthenticated, redirects immediately to /login
 * while preserving the attempted location in navigation state.
 */
export function ProtectedRoute() {
  const token = getRawToken();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
