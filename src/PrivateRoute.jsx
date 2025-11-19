import { Navigate } from "react-router-dom";
import { useIsLoggedIn } from "./Context/LoggedInContext";

const PrivateRoute = ({ children }) => {
  const { authData } = useIsLoggedIn();

  const isAuthenticated = Boolean(authData);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default PrivateRoute;
