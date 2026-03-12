import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../lib/api';

const SLUG_MAP = {
    '/': 'home',
    '/about': 'about',
    '/contact': 'contact',
    '/blog': 'blog',
    '/chalo-tirthyatra': 'chalo-tirthyatra',
    '/gauranga-vidhyapitha': 'gauranga-vidhyapitha',
    '/accountability': 'accountability',
    '/login': 'login',
};

const useSeoConfig = () => {
    const location = useLocation();
    const [seoData, setSeoData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Skip SEO fetch for admin routes
        if (location.pathname.startsWith('/admin')) {
            setSeoData(null);
            setLoading(false);
            return;
        }

        const slug = SLUG_MAP[location.pathname] || 
                     location.pathname.replace(/^\//, '').replace(/\//g, '-') || 
                     'home';

        const fetchSeo = async () => {
            setLoading(true);
            try {
                const res = await api.get(`/seo/${slug}`);
                setSeoData(res.data);
            } catch (err) {
                console.error('Error fetching SEO config:', err);
                setSeoData(null);
            } finally {
                setLoading(false);
            }
        };

        fetchSeo();
    }, [location.pathname]);

    return { seoData, loading };
};

export default useSeoConfig;
