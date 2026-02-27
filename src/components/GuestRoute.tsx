import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

interface GuestRoute{
    children : React.ReactNode;
}

export default function GuestRoute({children} : GuestRoute){
    const auth = useContext(AuthContext);

    if(auth?.token){
        return <Navigate to="/" replace />
    }else{
        return <>{children}</>;
    }
}