import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LogoutButton = ({ className = '' }) => {
    const { logout } = useAuth();

    return (
        <button
            onClick={logout}
            className={`group flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 font-semibold border border-gray-200 hover:border-gray-300 ${className}`}
        >
            <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Logout
        </button>
    );
};

export default LogoutButton;
