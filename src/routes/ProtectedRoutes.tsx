import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

type ProtectedRouteProps = {
  children: React.ReactElement;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  return children;
}
