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
        let title = 'Iskcon Juhu'; // Default title

        if (path === '/') title = 'Home | Iskcon Juhu';
        else if (path === '/about') title = 'About Us | Iskcon Juhu';
        else if (path === '/contact') title = 'Contact Us | Iskcon Juhu';
        else if (path === '/blog') title = 'Blog | Iskcon Juhu';
        else if (path === '/accountability') title = 'Accountability | Iskcon Juhu';
        else if (path === '/chalo-tirthyatra') title = 'Chalo Tirthyatra | Iskcon Juhu';
        else if (path === '/gauranga-vidhyapitha') title = 'Gauranga Vidhyapitha | Iskcon Juhu';
        else if (path === '/login') title = 'Login | Iskcon Juhu';
        else if (path.startsWith('/admin/dashboard')) title = 'Admin Dashboard | Iskcon Juhu';
        else if (path.startsWith('/counselor/dashboard')) title = 'Counselor Dashboard | Iskcon Juhu';
        else if (path.startsWith('/dashboard')) title = 'User Dashboard | Iskcon Juhu';

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
