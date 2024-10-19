import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { RootState } from "@/lib/redux/store"; // Adjust based on your actual store path

export interface ProtectedRouteProps {
  [key: string]: any;
}

const ProtectedRoute = <P extends ProtectedRouteProps>(
  WrappedComponent: React.ComponentType<P>
) => {
  const Protected: React.FC<P> = (props) => {
    const currentUser = useSelector((state: RootState) => state.users.currentUser);
    const navigate = useNavigate();

    useEffect(() => {
      if (!currentUser || currentUser.Name !== "Admin") {
        navigate("/401"); 
      }
    }, [currentUser, navigate]);

    if (!currentUser || currentUser.Name !== "Admin") {
      return null; 
    }

    return <WrappedComponent {...props} />;
  };

  return Protected;
};

export default ProtectedRoute;
