import { useContext } from "react";
import {Navigate} from 'react-router-dom'
import { AuthContext } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
}
export default function ProtectedRoute({children}: ProtectedRouteProps){
    const auth = useContext(AuthContext);
    if(!auth?.token){
        return <Navigate to="/login" replace />
    }else{
        return <>{children}</>
    }
}