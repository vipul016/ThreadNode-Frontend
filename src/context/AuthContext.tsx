import {createContext,useState,useEffect,ReactNode} from "react";

interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children} : {children : ReactNode}){
    const [token,setToken] = useState<string | null>(localStorage.getItem('token'));

    useEffect(()=>{
        const checkToken = localStorage.getItem('token');
        if(checkToken){
            setToken(checkToken);
        }
    },[]);
    
    const login = (newToken : string) => {
        localStorage.setItem('token',newToken);
        setToken(newToken);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
    }
    return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );

}