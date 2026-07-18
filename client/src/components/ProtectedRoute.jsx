import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  console.log('clicked')  
  const { userData } = useSelector((state) => state.user);
  console.log(userData)
  
  if (userData === undefined || userData === null) {
    return <Navigate to="/auth" />;
  }
  return  <Outlet />;
};

export default ProtectedRoute;