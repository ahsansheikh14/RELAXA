import { Navigate, Outlet, useLocation } from 'react-router-dom';

function UserProtectedRoute() {
  const location = useLocation();
  const userToken = localStorage.getItem('relaxaToken');

  if (!userToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default UserProtectedRoute;
