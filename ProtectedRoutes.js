import { Navigate, Outlet } from "react-router-dom";

export const checkAuth = () => {
  if(localStorage.getItem("isLogin")){
    return true;
  } else {
    return false;
  }
}

const ProtectedRoutes = () => {
  return checkAuth() ? <Outlet /> : <Navigate to="/" replace />;
}

export default ProtectedRoutes;
