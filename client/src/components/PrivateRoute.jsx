import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({element}) => {
  const { user } = useAuth();

  // If no user is found in context, redirect to login
  return user ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;

PrivateRoute.propTypes= false