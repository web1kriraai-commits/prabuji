/**
 * Navbar Component
 * Production-ready navigation with responsive design and authentication
 */

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LogoutButton from './LogoutButton';
import logoImage from '../assets/image/Gaurangas-Group-Logo.png';
import '../styles/navbar.css';

const Navbar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
        setIsDropdownOpen(false);
        setShowUserMenu(false);
    }, [location]);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const toggleUserMenu = () => {
        setShowUserMenu(!showUserMenu);
    };

    const isActive = (path) => {
        return location.pathname === path;
    };

    const handleDashboardClick = () => {
        if (user?.role === 'admin') {
            navigate('/admin/dashboard');
        } else if (user?.role === 'counselor') {
            navigate('/counselor/dashboard');
        } else {
            navigate('/dashboard');
        }
    };

    // Base navigation items
    const baseNavigationItems = [
        { path: '/', label: 'Home' },
        { path: '/about', label: 'About Us' },
        {
            label: 'Gauranga Vidhyapitha',
            dropdown: [
                { path: '/gauranga-vidhyapitha', label: 'Gauranga Vidhyapitha' },
                { path: '/accountability', label: 'Accountability' },
                { path: '/chalo-tirthyatra', label: 'Chalo Tirthyatra' },
            ],
        },
        { path: '/contact', label: 'Contact Us' },
        { path: '/blog', label: 'Blog' },
    ];

    // Get role badge color
    const getRoleBadgeColor = () => {
        if (!user) return '';
        switch (user.role) {
            case 'admin':
                return 'bg-lavender text-white';
            case 'counselor':
                return 'bg-soft-green text-gray-800';
            case 'user':
                return 'bg-sky-blue text-gray-800';
            default:
                return 'bg-gray-200 text-gray-800';
        }
    };

    // Render a single navigation item
    const renderNavItem = (item, index) => {
        const style = { '--i': index };

        if (item.dropdown) {
            return (
                <li
                    key={index}
                    style={style}
                    className={`navbar-menu-item navbar-dropdown ${isDropdownOpen ? 'active' : ''}`}
                    onMouseEnter={() => !isMobileMenuOpen && setIsDropdownOpen(true)}
                    onMouseLeave={() => !isMobileMenuOpen && setIsDropdownOpen(false)}
                >
                    <button
                        type="button"
                        className="navbar-menu-link"
                        onClick={toggleDropdown}
                        aria-expanded={isDropdownOpen}
                        aria-haspopup="true"
                    >
                        {item.label}
                        <svg
                            className="navbar-dropdown-icon"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </button>
                    <ul className="navbar-dropdown-menu">
                        <div className="navbar-dropdown-inner">
                            {item.dropdown.map((subItem, subIndex) => (
                                <li key={subIndex} className="navbar-dropdown-item">
                                    <Link
                                        to={subItem.path}
                                        className="navbar-dropdown-link"
                                    >
                                        {subItem.label}
                                    </Link>
                                </li>
                            ))}
                        </div>
                    </ul>
                </li>
            );
        }

        return (
            <li key={index} style={style} className="navbar-menu-item">
                <Link
                    to={item.path}
                    className={`navbar-menu-link ${isActive(item.path) ? 'active' : ''}`}
                >
                    {item.label}
                </Link>
            </li>
        );
    };

    return (
        <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
            <div className="navbar-container">
                {/* Logo */}
                <Link to="/" className="navbar-logo" aria-label="Gaurangas Group Home">
                    <img
                        src={logoImage}
                        alt="Gaurangas Group Logo"
                        className="navbar-logo-image"
                    />
                </Link>

                {/* Navigation Menu */}
                <ul className={`navbar-menu ${isMobileMenuOpen ? 'active' : ''}`}>
                    {baseNavigationItems.map((item, index) => renderNavItem(item, index))}
                </ul>

                {/* Login Button or User Profile */}
                <div className="navbar-cta">
                    {loading ? (
                        // Show nothing or a small loader while checking auth
                        <div className="w-24 h-10"></div>
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={toggleUserMenu}
                                className="flex items-center gap-3 px-4 py-2 rounded-full bg-white border border-gray-200 hover:shadow-md transition-all duration-300"
                            >
                                <div className={`w-9 h-9 rounded-full ${getRoleBadgeColor()} flex items-center justify-center font-semibold text-sm`}>
                                    {user.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="hidden md:block text-left">
                                    <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                                </div>
                                <svg
                                    className={`w-4 h-4 text-gray-600 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* User Dropdown Menu */}
                            <div className={`absolute right-4 top-16 w-72 bg-white rounded-3xl shadow-2xl border border-gray-100 py-3 z-50 transform transition-all duration-300 origin-top-right ${showUserMenu ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-4 pointer-events-none'}`}>
                                <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-3xl -mt-3 -mx-0.5 mb-2">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className={`w-12 h-12 rounded-full ${getRoleBadgeColor()} flex items-center justify-center font-bold text-lg shadow-inner`}>
                                            {user.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-base font-bold text-gray-900 leading-tight">{user.name}</p>
                                            <p className="text-xs text-gray-500 font-medium">{user.email}</p>
                                        </div>
                                    </div>
                                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleBadgeColor()}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70"></span>
                                        {user.role}
                                    </span>
                                </div>
                                <div className="px-2 space-y-1">
                                    <button
                                        onClick={() => {
                                            handleDashboardClick();
                                            setShowUserMenu(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 rounded-xl transition-all group text-left"
                                    >
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100 transition-colors">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                                        </div>
                                        <div>
                                            <span className="block text-sm font-bold text-gray-700 group-hover:text-gray-900">My Dashboard</span>
                                            <span className="block text-xs text-gray-500">Access your personalized tools</span>
                                        </div>
                                    </button>

                                    <div className="h-px bg-gray-100 my-2 mx-4"></div>

                                    <div className="px-2">
                                        {/* Wrapped LogoutButton to pass className correctly or handle click */}
                                        <LogoutButton className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 text-left rounded-xl transition-all group !border-none !shadow-none !bg-transparent text-gray-700" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link to="/login" className="navbar-cta-button">
                            Login
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <button
                    className={`navbar-mobile-toggle ${isMobileMenuOpen ? 'active' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label="Toggle navigation menu"
                    aria-expanded={isMobileMenuOpen}
                >
                    <span className="navbar-mobile-toggle-bar"></span>
                    <span className="navbar-mobile-toggle-bar"></span>
                    <span className="navbar-mobile-toggle-bar"></span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
