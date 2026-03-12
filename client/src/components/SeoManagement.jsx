import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import {
    Search, Globe, FileText, Heading, Type, HelpCircle,
    Link2, Image, Code, Bot, Map, Save, Trash2, Plus,
    X, ChevronDown, Check, AlertCircle, RefreshCw,
    Settings, Layout, Layers
} from 'lucide-react';

const PAGES = [
    { slug: 'home', name: 'Home' },
    { slug: 'about', name: 'About' },
    { slug: 'contact', name: 'Contact' },
    { slug: 'blog', name: 'Blog' },
    { slug: 'chalo-tirthyatra', name: 'Chalo Tirthyatra' },
    { slug: 'gauranga-vidhyapitha', name: 'Gauranga Vidhyapitha' },
    { slug: 'accountability', name: 'Accountability' },
    { slug: 'login', name: 'Login' },
];

const SUB_TABS = [
    { id: 'meta', label: 'Page SEO', icon: Globe },
    { id: 'headings', label: 'Headings', icon: Heading },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'faqs', label: 'FAQs', icon: HelpCircle },
    { id: 'links', label: 'Internal Links', icon: Link2 },
    { id: 'images', label: 'Images', icon: Image },
    { id: 'schema', label: 'Schema', icon: Code },
    { id: 'injection', label: 'Code Injection', icon: Settings },
    { id: 'sitemap', label: 'Sitemap & Robots', icon: Map },
];

const CHANGE_FREQ_OPTIONS = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

const SeoManagement = () => {
    const [selectedPage, setSelectedPage] = useState('home');
    const [activeSubTab, setActiveSubTab] = useState('meta');
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);
    const [robotsTxt, setRobotsTxt] = useState('');
    const [allConfigs, setAllConfigs] = useState([]);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const getDefaultConfig = (slug) => ({
        pageSlug: slug,
        pageName: PAGES.find(p => p.slug === slug)?.name || slug,
        title: '',
        metaDescription: '',
        keywords: [],
        canonicalUrl: '',
        ogTitle: '',
        ogDescription: '',
        ogImage: '',
        ogType: 'website',
        headings: { h1: '', h2: '', h3: '', h4: '', h5: '', h6: '' },
        htmlContent: '',
        faqs: [],
        internalLinks: [],
        images: [],
        schemaMarkup: { article: false, organization: false, faq: false, breadcrumb: false, customJson: '' },
        codeInjection: { headerScripts: '', footerScripts: '' },
        sitemapEnabled: true,
        sitemapPriority: 0.5,
        sitemapChangeFreq: 'weekly'
    });

    const FALLBACK_DATA = {
        home: {
            headings: {
                h1: "Experience Krishna Consciousness at Your Own Place",
                h2: "About Gaurangas Group",
                h3: "Embark on a Sacred Journey",
                h4: "Support Our Spiritual Mission",
                h5: "Our Offerings",
                h6: "Divine Glimpses"
            },
            metaDescription: "Your search for spirituality ends here. Gaurangas Group brings you a complete package of devotion, knowledge, and spiritual wellness.",
            htmlContent: `<p>Led by Uddhava Das, Gaurangas Group offers a unique blend of devotional experiences and lifestyle enrichment.</p>\n<p>Through inspiring yatras, blissful kirtans, and transformative spiritual courses, we guide seekers to a conscious lifestyle rooted in bhakti, comfort, and well-being.</p>`,
            images: [
                { url: '', altText: 'Hero Background', caption: '' }, // 0
                { url: '', altText: 'Sacred Journey', caption: 'Experience the divine land of Vrindavan in the holiest month of Kartik' }, // 1
                { url: '', altText: 'Spiritual Mission', caption: "Help us spread Krishna's teachings and arrange transformative devotional events" }, // 2
                { url: '', altText: 'Uddhava Das', caption: '' }, // 3
                { url: '', altText: 'Gauranga Vidhyapith', caption: 'Our aim is to nourish your soul daily and keep you engaged in Krishna consciousness.' }, // 4
                { url: '', altText: 'Japa beads', caption: 'Guided chanting 5:30AM – 7:30AM to align your mind and soul with the holy names.' }, // 5
                { url: '', altText: 'Accountability', caption: 'Join our Accountability WhatsApp Group & track your daily Sadhana with under guidance senior devotees.' }, // 6
                { url: '', altText: 'Divine Glimpse 1', caption: '' }, // 7
                { url: '', altText: 'Divine Glimpse 2', caption: '' }, // 8
                { url: '', altText: 'Divine Glimpse 3', caption: '' }, // 9
                { url: '', altText: 'Divine Glimpse 4', caption: '' }, // 10
                { url: '', altText: 'Divine Glimpse 5', caption: '' }  // 11
            ],
            internalLinks: [
                { anchorText: 'Join Our Yatra', targetUrl: '' }, // 0
                { anchorText: 'Donate Now', targetUrl: '' }, // 1
                { anchorText: 'Join Our Channel', targetUrl: '' }, // 2
                { anchorText: 'Join Online - Zoom', targetUrl: '' }, // 3
                { anchorText: 'Join Now', targetUrl: 'https://api.whatsapp.com/send/?phone=917600156255&text&type=phone_number&app_absent=0' } // 4
            ]
        },
        about: {
            headings: {
                h1: "Spiritual Mission",
                h2: "Hare Krishna"
            },
            htmlContent: `<p>For more than a decade, I have been traveling the world, seeking spiritual wisdom and sharing it with seekers everywhere.</p>\n<p>As a devoted follower of Lord Shri Krishna, I have dedicated my life to exploring the depths of devotional practices.</p>\n<p>Through inspiring yatras, blissful kirtans, and transformative spiritual courses, we guide seekers toward a conscious lifestyle rooted in bhakti, inner peace, and physical well-being.</p>`,
            images: [
                { url: '', altText: 'Uddhava Das', caption: '' } // 0: About side-image
            ]
        },
        'gauranga-vidhyapitha': {
            headings: {
                h1: "Gauranga Vidhyapitha",
                h2: "Weekly Bhagwadgeeta Class", // Course 1 Title
                h3: "Children Courses", // Course 2 Title
                h4: "Youth Training" // Course 3 Title
            },
            htmlContent: `<p>Gauranga Vidyapitha is the educational initiative of Gaurangas Group dedicated to teaching Krishna consciousness to children, youth, and families in an engaging and systematic way.</p><p>Inspired by the timeless teachings of Bhagavad Gita, Srimad Bhagavatam, and Srila Prabhupada, this platform serves as a divine school to nurture character, values, and spiritual knowledge.</p>`,
            images: [
                { url: '', altText: 'Weekly Bhagwadgeeta Class', caption: 'Every Sunday 5 pm we organize weekly live Bhagavad Gita Class.' }, // 0: Course 1
                { url: '', altText: 'Children Courses', caption: 'Fun-filled Krishna conscious learning through stories, art, drama, and bhajans for ages 5–15.' }, // 1: Course 2
                { url: '', altText: 'Youth Training', caption: 'Practical application of Gita, self-discipline, seva spirit, and balanced lifestyle guidance.' } // 2: Course 3
            ],
            internalLinks: [
                { anchorText: 'Book Your Seat', targetUrl: '' }, // 0: Course 1 Button
                { anchorText: 'Register Courses', targetUrl: '' }, // 1: Course 2 Button
                { anchorText: 'Register Now', targetUrl: '' } // 2: Course 3 Button
            ]
        },
        contact: {
            headings: {
                h1: "Contact Us",
                h2: "Get In Touch"
            },
            htmlContent: `<p>Have questions about our yatras, courses, or events? We'd love to hear from you.</p>\n<p>Fill out the form below or reach out to us directly through our contact details.</p>`
        }
    };

    const fetchConfig = useCallback(async (slug) => {
        setLoading(true);
        try {
            const res = await api.get(`/seo/${slug}`);
            let data = res.data;
            const fallback = FALLBACK_DATA[slug];
            
            // If data exists but fields are empty, prefill them with hardcoded fallbacks
            if (fallback) {
                if (!data.htmlContent || data.htmlContent.trim() === '') data.htmlContent = fallback.htmlContent || '';
                if (!data.metaDescription || data.metaDescription.trim() === '') data.metaDescription = fallback.metaDescription || '';
                if (!data.headings) data.headings = { h1: '', h2: '', h3: '', h4: '', h5: '', h6: '' };
                if (!data.headings.h1 || data.headings.h1.trim() === '') data.headings.h1 = fallback.headings?.h1 || '';
                if (!data.headings.h2 || data.headings.h2.trim() === '') data.headings.h2 = fallback.headings?.h2 || '';
                if (!data.headings.h3 || data.headings.h3.trim() === '') data.headings.h3 = fallback.headings?.h3 || '';
                if (!data.headings.h4 || data.headings.h4.trim() === '') data.headings.h4 = fallback.headings?.h4 || '';
                if (!data.headings.h5 || data.headings.h5.trim() === '') data.headings.h5 = fallback.headings?.h5 || '';
                if (!data.headings.h6 || data.headings.h6.trim() === '') data.headings.h6 = fallback.headings?.h6 || '';
                
                if (!data.images) data.images = [];
                if (fallback.images) {
                    fallback.images.forEach((imgFallback, idx) => {
                        if (!data.images[idx]) data.images[idx] = imgFallback;
                    });
                }

                if (!data.internalLinks) data.internalLinks = [];
                if (fallback.internalLinks) {
                    fallback.internalLinks.forEach((linkFallback, idx) => {
                        if (!data.internalLinks[idx]) data.internalLinks[idx] = linkFallback;
                    });
                }
            }
            setConfig(data);
        } catch (err) {
            if (err.response?.status === 404) {
                let defaultCfg = getDefaultConfig(slug);
                const fallback = FALLBACK_DATA[slug];
                if (fallback) {
                    defaultCfg.htmlContent = fallback.htmlContent || '';
                    if (fallback.metaDescription) defaultCfg.metaDescription = fallback.metaDescription;
                    if (fallback.headings?.h1) defaultCfg.headings.h1 = fallback.headings.h1;
                    if (fallback.headings?.h2) defaultCfg.headings.h2 = fallback.headings.h2;
                    if (fallback.headings?.h3) defaultCfg.headings.h3 = fallback.headings.h3;
                    if (fallback.headings?.h4) defaultCfg.headings.h4 = fallback.headings.h4;
                    if (fallback.headings?.h5) defaultCfg.headings.h5 = fallback.headings.h5;
                    if (fallback.headings?.h6) defaultCfg.headings.h6 = fallback.headings.h6;
                    defaultCfg.images = fallback.images || [];
                    defaultCfg.internalLinks = fallback.internalLinks || [];
                }
                setConfig(defaultCfg);
            } else {
                showToast('Error loading SEO config', 'error');
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchRobotsTxt = async () => {
        try {
            const res = await api.get('/seo/config/robots', { responseType: 'text' });
            setRobotsTxt(typeof res.data === 'string' ? res.data : res.data.robotsTxt || '');
        } catch {
            setRobotsTxt('User-agent: *\nAllow: /\n');
        }
    };

    useEffect(() => {
        fetchConfig(selectedPage);
        fetchRobotsTxt();
    }, [selectedPage, fetchConfig]);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/seo/${selectedPage}`, config);
            showToast('SEO config saved successfully!');
            fetchConfig(selectedPage);
        } catch (err) {
            showToast(err.response?.data?.msg || 'Error saving config', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveRobots = async () => {
        setSaving(true);
        try {
            await api.put('/seo/config/robots', { robotsTxt });
            showToast('Robots.txt saved successfully!');
        } catch {
            showToast('Error saving robots.txt', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field, value) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const updateNested = (parent, field, value) => {
        setConfig(prev => ({ ...prev, [parent]: { ...prev[parent], [field]: value } }));
    };

    // FAQ helpers
    const addFaq = () => {
        setConfig(prev => ({ ...prev, faqs: [...(prev.faqs || []), { question: '', answer: '' }] }));
    };
    const updateFaq = (idx, field, value) => {
        setConfig(prev => {
            const faqs = [...prev.faqs];
            faqs[idx] = { ...faqs[idx], [field]: value };
            return { ...prev, faqs };
        });
    };
    const removeFaq = (idx) => {
        setConfig(prev => ({ ...prev, faqs: prev.faqs.filter((_, i) => i !== idx) }));
    };

    // Internal link helpers
    const addLink = () => {
        setConfig(prev => ({ ...prev, internalLinks: [...(prev.internalLinks || []), { anchorText: '', targetUrl: '' }] }));
    };
    const updateLink = (idx, field, value) => {
        setConfig(prev => {
            const links = [...prev.internalLinks];
            links[idx] = { ...links[idx], [field]: value };
            return { ...prev, internalLinks: links };
        });
    };
    const removeLink = (idx) => {
        setConfig(prev => ({ ...prev, internalLinks: prev.internalLinks.filter((_, i) => i !== idx) }));
    };

    // Image helpers
    const addImage = () => {
        setConfig(prev => ({ ...prev, images: [...(prev.images || []), { url: '', altText: '', caption: '' }] }));
    };
    const updateImage = (idx, field, value) => {
        setConfig(prev => {
            const imgs = [...prev.images];
            imgs[idx] = { ...imgs[idx], [field]: value };
            return { ...prev, images: imgs };
        });
    };
    const removeImage = (idx) => {
        setConfig(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== idx) }));
    };

    // Keywords helpers
    const [keywordInput, setKeywordInput] = useState('');
    const addKeyword = () => {
        if (keywordInput.trim()) {
            updateField('keywords', [...(config.keywords || []), keywordInput.trim()]);
            setKeywordInput('');
        }
    };
    const removeKeyword = (idx) => {
        updateField('keywords', config.keywords.filter((_, i) => i !== idx));
    };

    if (!config) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
            </div>
        );
    }

    const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all outline-none text-gray-800";
    const labelClass = "block text-sm font-semibold text-gray-700 mb-2";
    const cardClass = "bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {/* Toast */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 text-white font-medium ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}
                    >
                        {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <Check className="w-5 h-5" />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className={cardClass}>
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                                <Search className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">SEO Management</h2>
                        </div>
                        <p className="text-gray-500 text-sm ml-12">Manage search engine optimization for every page</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Page Selector */}
                        <div className="relative">
                            <select
                                value={selectedPage}
                                onChange={(e) => setSelectedPage(e.target.value)}
                                className="appearance-none pl-4 pr-10 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-xl text-indigo-700 font-medium focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none cursor-pointer"
                            >
                                {PAGES.map(p => (
                                    <option key={p.slug} value={p.slug}>{p.name}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 pointer-events-none" />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-medium hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                        >
                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            {saving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Sub-tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {SUB_TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveSubTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${activeSubTab === tab.id
                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                                }`}
                        >
                            <Icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* Loading */}
            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
                </div>
            ) : (
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeSubTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {/* ===== META TAB ===== */}
                        {activeSubTab === 'meta' && (
                            <div className={cardClass}>
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Globe className="w-5 h-5 text-indigo-500" /> Page SEO Settings
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div>
                                        <label className={labelClass}>Page Title</label>
                                        <input type="text" value={config.title || ''} onChange={e => updateField('title', e.target.value)} className={inputClass} placeholder="Enter page title" />
                                        <p className="text-xs text-gray-400 mt-1">{(config.title || '').length}/60 characters</p>
                                    </div>
                                    <div>
                                        <label className={labelClass}>Canonical URL</label>
                                        <input type="text" value={config.canonicalUrl || ''} onChange={e => updateField('canonicalUrl', e.target.value)} className={inputClass} placeholder="https://example.com/page" />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <label className={labelClass}>Meta Description</label>
                                        <textarea value={config.metaDescription || ''} onChange={e => updateField('metaDescription', e.target.value)} className={`${inputClass} resize-none`} rows={3} placeholder="Enter meta description" />
                                        <p className="text-xs text-gray-400 mt-1">{(config.metaDescription || '').length}/160 characters</p>
                                    </div>
                                    <div className="lg:col-span-2">
                                        <label className={labelClass}>Keywords</label>
                                        <div className="flex gap-2 mb-2">
                                            <input
                                                type="text"
                                                value={keywordInput}
                                                onChange={e => setKeywordInput(e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                                                className={inputClass}
                                                placeholder="Type keyword and press Enter"
                                            />
                                            <button onClick={addKeyword} className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors">
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {(config.keywords || []).map((kw, i) => (
                                                <span key={i} className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium">
                                                    {kw}
                                                    <button onClick={() => removeKeyword(i)} className="text-indigo-400 hover:text-indigo-600"><X className="w-3 h-3" /></button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* OG tags */}
                                <div className="mt-8 pt-6 border-t border-gray-100">
                                    <h4 className="text-md font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <Layers className="w-4 h-4 text-purple-500" /> Open Graph Tags
                                    </h4>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelClass}>OG Title</label>
                                            <input type="text" value={config.ogTitle || ''} onChange={e => updateField('ogTitle', e.target.value)} className={inputClass} placeholder="OG Title" />
                                        </div>
                                        <div>
                                            <label className={labelClass}>OG Type</label>
                                            <select value={config.ogType || 'website'} onChange={e => updateField('ogType', e.target.value)} className={inputClass}>
                                                <option value="website">Website</option>
                                                <option value="article">Article</option>
                                                <option value="profile">Profile</option>
                                            </select>
                                        </div>
                                        <div className="lg:col-span-2">
                                            <label className={labelClass}>OG Description</label>
                                            <textarea value={config.ogDescription || ''} onChange={e => updateField('ogDescription', e.target.value)} className={`${inputClass} resize-none`} rows={2} placeholder="OG Description" />
                                        </div>
                                        <div className="lg:col-span-2">
                                            <label className={labelClass}>OG Image URL</label>
                                            <input type="text" value={config.ogImage || ''} onChange={e => updateField('ogImage', e.target.value)} className={inputClass} placeholder="https://example.com/og-image.jpg" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== HEADINGS TAB ===== */}
                        {activeSubTab === 'headings' && (
                            <div className={cardClass}>
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Heading className="w-5 h-5 text-indigo-500" /> Heading Optimization
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">Manage heading tags for SEO structure. H1 should be unique per page.</p>
                                <div className="space-y-5">
                                    {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(tag => (
                                        <div key={tag}>
                                            <label className={labelClass}>
                                                <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 text-indigo-700 font-bold text-xs mr-2">
                                                    {tag.toUpperCase()}
                                                </span>
                                                {tag === 'h1' ? 'Main Heading (H1)' : `Heading ${tag.toUpperCase()}`}
                                            </label>
                                            <input
                                                type="text"
                                                value={config.headings?.[tag] || ''}
                                                onChange={e => updateNested('headings', tag, e.target.value)}
                                                className={inputClass}
                                                placeholder={`Enter ${tag.toUpperCase()} heading`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ===== CONTENT TAB ===== */}
                        {activeSubTab === 'content' && (
                            <div className={cardClass}>
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-indigo-500" /> HTML Content Editor
                                </h3>
                                <p className="text-sm text-gray-500 mb-4">Write HTML that will be rendered dynamically on the page. Supports paragraphs, headings, lists, links, and images.</p>
                                <textarea
                                    value={config.htmlContent || ''}
                                    onChange={e => updateField('htmlContent', e.target.value)}
                                    className={`${inputClass} font-mono text-sm resize-y`}
                                    rows={16}
                                    placeholder="<h2>Your content here</h2>\n<p>Write rich HTML content...</p>"
                                />
                                {config.htmlContent && (
                                    <div className="mt-6">
                                        <h4 className="text-sm font-bold text-gray-700 mb-3">Preview</h4>
                                        <div
                                            className="p-6 bg-gray-50 rounded-xl border border-gray-200 prose max-w-none"
                                            dangerouslySetInnerHTML={{ __html: config.htmlContent }}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== FAQS TAB ===== */}
                        {activeSubTab === 'faqs' && (
                            <div className={cardClass}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-indigo-500" /> FAQ Management
                                    </h3>
                                    <button onClick={addFaq} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium">
                                        <Plus className="w-4 h-4" /> Add FAQ
                                    </button>
                                </div>
                                <p className="text-sm text-gray-500 mb-6">FAQs will appear on the page and generate FAQ Schema structured data for search engines.</p>

                                {(config.faqs || []).length === 0 ? (
                                    <div className="text-center py-12">
                                        <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No FAQs added yet. Click "Add FAQ" to get started.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {config.faqs.map((faq, idx) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative"
                                            >
                                                <button onClick={() => removeFaq(idx)} className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="pr-10 space-y-3">
                                                    <div>
                                                        <label className={labelClass}>Question {idx + 1}</label>
                                                        <input type="text" value={faq.question} onChange={e => updateFaq(idx, 'question', e.target.value)} className={inputClass} placeholder="Enter question" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Answer</label>
                                                        <textarea value={faq.answer} onChange={e => updateFaq(idx, 'answer', e.target.value)} className={`${inputClass} resize-none`} rows={3} placeholder="Enter answer" />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== INTERNAL LINKS TAB ===== */}
                        {activeSubTab === 'links' && (
                            <div className={cardClass}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Link2 className="w-5 h-5 text-indigo-500" /> Internal Link Manager
                                    </h3>
                                    <button onClick={addLink} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium">
                                        <Plus className="w-4 h-4" /> Add Link
                                    </button>
                                </div>

                                {(config.internalLinks || []).length === 0 ? (
                                    <div className="text-center py-12">
                                        <Link2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No internal links added yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {config.internalLinks.map((link, idx) => (
                                            <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                    <input type="text" value={link.anchorText} onChange={e => updateLink(idx, 'anchorText', e.target.value)} className={inputClass} placeholder="Anchor text" />
                                                    <input type="text" value={link.targetUrl} onChange={e => updateLink(idx, 'targetUrl', e.target.value)} className={inputClass} placeholder="/target-page or full URL" />
                                                </div>
                                                <button onClick={() => removeLink(idx)} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== IMAGES TAB ===== */}
                        {activeSubTab === 'images' && (
                            <div className={cardClass}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                        <Image className="w-5 h-5 text-indigo-500" /> Image Alt Text Optimization
                                    </h3>
                                    <button onClick={addImage} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium">
                                        <Plus className="w-4 h-4" /> Add Image
                                    </button>
                                </div>

                                {(config.images || []).length === 0 ? (
                                    <div className="text-center py-12">
                                        <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                        <p className="text-gray-500">No images added yet.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {config.images.map((img, idx) => (
                                            <motion.div key={idx} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-gray-50 rounded-xl p-5 border border-gray-200 relative">
                                                <button onClick={() => removeImage(idx)} className="absolute top-3 right-3 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pr-10">
                                                    <div className="lg:col-span-2">
                                                        <label className={labelClass}>Image URL</label>
                                                        <input type="text" value={img.url} onChange={e => updateImage(idx, 'url', e.target.value)} className={inputClass} placeholder="https://example.com/image.jpg" />
                                                    </div>
                                                    <div>
                                                        <label className={labelClass}>Alt Text</label>
                                                        <input type="text" value={img.altText} onChange={e => updateImage(idx, 'altText', e.target.value)} className={inputClass} placeholder="Descriptive alt text" />
                                                    </div>
                                                    <div className="lg:col-span-3">
                                                        <label className={labelClass}>Caption</label>
                                                        <input type="text" value={img.caption || ''} onChange={e => updateImage(idx, 'caption', e.target.value)} className={inputClass} placeholder="Image caption (optional)" />
                                                    </div>
                                                </div>
                                                {img.url && (
                                                    <div className="mt-3">
                                                        <img src={img.url} alt={img.altText || 'preview'} className="h-24 w-auto object-cover rounded-lg border border-gray-200" onError={e => e.target.style.display = 'none'} />
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== SCHEMA TAB ===== */}
                        {activeSubTab === 'schema' && (
                            <div className={cardClass}>
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Code className="w-5 h-5 text-indigo-500" /> Structured Data / Schema Markup
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">Enable schema types to generate JSON-LD structured data for search engines.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                                    {[
                                        { key: 'article', label: 'Article Schema', desc: 'For blog posts and articles' },
                                        { key: 'organization', label: 'Organization Schema', desc: 'For the Prabuji brand' },
                                        { key: 'faq', label: 'FAQ Schema', desc: 'For FAQ sections on this page' },
                                        { key: 'breadcrumb', label: 'Breadcrumb Schema', desc: 'For page navigation breadcrumbs' },
                                    ].map(item => (
                                        <label
                                            key={item.key}
                                            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all cursor-pointer ${config.schemaMarkup?.[item.key]
                                                ? 'border-indigo-500 bg-indigo-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={config.schemaMarkup?.[item.key] || false}
                                                onChange={e => updateNested('schemaMarkup', item.key, e.target.checked)}
                                                className="mt-1 w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                            />
                                            <div>
                                                <div className="font-semibold text-gray-800">{item.label}</div>
                                                <div className="text-xs text-gray-500">{item.desc}</div>
                                            </div>
                                        </label>
                                    ))}
                                </div>

                                <div>
                                    <label className={labelClass}>Custom JSON-LD</label>
                                    <p className="text-xs text-gray-500 mb-2">Paste any custom JSON-LD schema here. It will be injected as-is.</p>
                                    <textarea
                                        value={config.schemaMarkup?.customJson || ''}
                                        onChange={e => updateNested('schemaMarkup', 'customJson', e.target.value)}
                                        className={`${inputClass} font-mono text-sm resize-y`}
                                        rows={8}
                                        placeholder='{"@context":"https://schema.org","@type":"Organization",...}'
                                    />
                                </div>
                            </div>
                        )}

                        {/* ===== CODE INJECTION TAB ===== */}
                        {activeSubTab === 'injection' && (
                            <div className={cardClass}>
                                <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Settings className="w-5 h-5 text-indigo-500" /> Code Injection
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    Insert custom scripts for Google Analytics, Facebook Pixel, Search Console verification, etc.
                                </p>
                                <div className="space-y-6">
                                    <div>
                                        <label className={labelClass}>Header Scripts (injected in &lt;head&gt;)</label>
                                        <textarea
                                            value={config.codeInjection?.headerScripts || ''}
                                            onChange={e => updateNested('codeInjection', 'headerScripts', e.target.value)}
                                            className={`${inputClass} font-mono text-sm resize-y`}
                                            rows={8}
                                            placeholder="<!-- Google Analytics -->\n<script>...</script>"
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Footer Scripts (injected before &lt;/body&gt;)</label>
                                        <textarea
                                            value={config.codeInjection?.footerScripts || ''}
                                            onChange={e => updateNested('codeInjection', 'footerScripts', e.target.value)}
                                            className={`${inputClass} font-mono text-sm resize-y`}
                                            rows={8}
                                            placeholder="<!-- Facebook Pixel -->\n<script>...</script>"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* ===== SITEMAP & ROBOTS TAB ===== */}
                        {activeSubTab === 'sitemap' && (
                            <div className="space-y-6">
                                {/* Per-page sitemap settings */}
                                <div className={cardClass}>
                                    <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                                        <Map className="w-5 h-5 text-indigo-500" /> Sitemap Settings (This Page)
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                        <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <input
                                                type="checkbox"
                                                checked={config.sitemapEnabled ?? true}
                                                onChange={e => updateField('sitemapEnabled', e.target.checked)}
                                                className="w-5 h-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                            />
                                            <span className="font-medium text-gray-700">Include in Sitemap</span>
                                        </label>
                                        <div>
                                            <label className={labelClass}>Priority (0.0 – 1.0)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={config.sitemapPriority ?? 0.5}
                                                onChange={e => updateField('sitemapPriority', parseFloat(e.target.value))}
                                                className={inputClass}
                                            />
                                        </div>
                                        <div>
                                            <label className={labelClass}>Change Frequency</label>
                                            <select value={config.sitemapChangeFreq || 'weekly'} onChange={e => updateField('sitemapChangeFreq', e.target.value)} className={inputClass}>
                                                {CHANGE_FREQ_OPTIONS.map(f => <option key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <a
                                            href="/api/seo/generate/sitemap"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            <Globe className="w-4 h-4" /> View generated sitemap.xml →
                                        </a>
                                    </div>
                                </div>

                                {/* Robots.txt editor */}
                                <div className={cardClass}>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                            <Bot className="w-5 h-5 text-indigo-500" /> Robots.txt
                                        </h3>
                                        <button
                                            onClick={handleSaveRobots}
                                            disabled={saving}
                                            className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-colors text-sm font-medium disabled:opacity-50"
                                        >
                                            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            Save robots.txt
                                        </button>
                                    </div>
                                    <textarea
                                        value={robotsTxt}
                                        onChange={e => setRobotsTxt(e.target.value)}
                                        className={`${inputClass} font-mono text-sm resize-y`}
                                        rows={10}
                                        placeholder="User-agent: *\nAllow: /\nDisallow: /admin/"
                                    />
                                    <div className="mt-3">
                                        <a
                                            href="/api/seo/config/robots"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                                        >
                                            <Globe className="w-4 h-4" /> View current robots.txt →
                                        </a>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            )}
        </motion.div>
    );
};

export default SeoManagement;
