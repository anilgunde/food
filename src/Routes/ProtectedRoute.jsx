import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const useAuth = () => {
  
  const appState = useSelector((state) => state?.app);
 
  const accessToken = appState?.accessToken
  if (!!accessToken) {
    return true;
  } else if (
    accessToken === null ||
    accessToken === undefined
  ) {
    return false;
  }
};

const ProtectedRoutes = () => {
  const auth = useAuth();
  return auth ? <Outlet /> : <Navigate to='/' />;
};

export default ProtectedRoutes;
