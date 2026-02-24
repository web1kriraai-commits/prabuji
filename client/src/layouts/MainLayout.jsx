/**
 * MainLayout Component
 * Main layout wrapper with navbar for all pages
 */

import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = () => {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        let title = 'Gaurangas Group'; // Default title

        if (path === '/') title = 'Home | Gaurangas Group';
        else if (path === '/about') title = 'About Us | Gaurangas Group';
        else if (path === '/contact') title = 'Contact Us | Gaurangas Group';
        else if (path === '/blog') title = 'Blog | Gaurangas Group';
        else if (path === '/accountability') title = 'Accountability | Gaurangas Group';
        else if (path === '/chalo-tirthyatra') title = 'Chalo Tirthyatra | Gaurangas Group';
        else if (path === '/gauranga-vidhyapitha') title = 'Gauranga Vidhyapitha | Gaurangas Group';
        else if (path === '/login') title = 'Login | Gaurangas Group';
        else if (path.startsWith('/admin/dashboard')) title = 'Admin Dashboard | Gaurangas Group';
        else if (path.startsWith('/counselor/dashboard')) title = 'Counselor Dashboard | Gaurangas Group';
        else if (path.startsWith('/dashboard')) title = 'User Dashboard | Gaurangas Group';

        document.title = title;
    }, [location]);

    return (
        <div className="main-layout">
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout;
