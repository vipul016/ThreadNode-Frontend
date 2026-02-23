import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        auth?.logout();
        navigate('/');
    }

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-3xl mx-auto px-4 py-3 flex justify-between items-center">
                
                {/* Logo / Brand */}
                <Link to="/" className="text-2xl font-extrabold tracking-tight text-orange-600 hover:text-orange-700 transition-colors">
                    ThreadNode
                </Link>

                {/* Dynamic Auth Buttons */}
                <div>
                    {auth?.token ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium text-gray-500 hidden sm:block">Logged In</span>
                            <button 
                                onClick={handleLogout}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                    <div className="flex items-center gap-3">
                        <Link 
                            to="/login"
                            className="px-4 py-2 text-sm font-medium text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-md transition-colors"
                        >
                            Login
                        </Link>
                        <Link 
                            to="/signup"
                            className="px-4 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-md transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                    )}
                </div>
                
            </div>
        </nav>
    );
}