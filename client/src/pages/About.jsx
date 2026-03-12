/**
 * About Page Component
 * Spiritual about page with structure in code and content in dashboard.
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import uddhavaDasImage from '../assets/image/temple.jpg';
import useSeoConfig from '../hooks/useSeoConfig';

const About = () => {
    const { seoData, loading } = useSeoConfig();
    const [imageError, setImageError] = useState(false);

    // Reset error state when the dashboard URL changes so we can try the new one
    React.useEffect(() => {
        setImageError(false);
    }, [seoData?.images?.[0]?.url]);
    
    // 1. HARDCODED FALLBACK CONTENT (If admin doesn't set anything)
    const hardcodedData = {
        h1: '',
        h2: 'Hare Krishna',
        content: `
            <p>I am an ordinary devotee of Lord Shri Krishna and I am practicing devotion within ISKCON. I have a deep interest in reading, listening, and speaking about Krishna bhakti, and that's why I strive to share what I learn from other senior devotees on this website.</p>
            <p>This website is not officially endorsed by ISKCON. All the articles and videos published here are based on my personal understanding and realizations. I take full responsibility for any inaccuracies or misunderstandings that may arise.</p>
            <p>My only intention is to humbly serve the devotees by sharing Krishna-katha and bhakti knowledge through this platform.</p>
        `,
        signature: 'Uddhav Das',
        signatureMotto: 'In service to Lord Krishna,'
    };

    // Helper to get dynamic or hardcoded value
    const getVal = (dynamic, hardcoded) => (dynamic && dynamic.trim() !== '' ? dynamic : hardcoded);

    return (
        <div className="about-page" style={{
            minHeight: '100vh',
            background: '#FFFFFF',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative Background Pattern */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0.03,
                pointerEvents: 'none',
                backgroundImage: `radial-gradient(circle at 20% 30%, #1F7A8C 1px, transparent 1px),
                                 radial-gradient(circle at 80% 70%, #BFDBF7 1px, transparent 1px)`,
                backgroundSize: '50px 50px'
            }} />

            {/* Main Section */}
            <section className="about-section responsive-section" style={{
                position: 'relative',
                background: '#FFFFFF'
            }}>
                <div className="container" style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    <div className="responsive-grid" style={{
                        display: 'grid',
                        gap: '4rem',
                        alignItems: 'start'
                    }}>
                        {/* LEFT SIDE: Visual Design (Hero/Image) */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'flex-start',
                                position: 'sticky',
                                top: '100px'
                            }}
                        >
                            <div style={{ position: 'relative', maxWidth: '500px', width: '100%' }}>
                                <motion.div
                                    whileHover={{ y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    style={{
                                        position: 'relative',
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, #E1E5F2 0%, #BFDBF7 100%)',
                                        borderRadius: '30px',
                                        boxShadow: '0 20px 60px rgba(31, 122, 140, 0.2)',
                                        minHeight: '550px'
                                    }}
                                >
                                    <img
                                        // Dynamic Image with Hardcoded Fallback + Error Handling
                                        src={(!imageError && seoData?.images?.[0]?.url) ? seoData.images[0].url : uddhavaDasImage}
                                        alt={seoData?.images?.[0]?.altText || "About Gaurnaga Temple"}
                                        onError={() => setImageError(true)}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            minHeight: '530px',
                                            objectFit: 'cover',
                                            borderRadius: '20px',
                                            display: 'block',
                                            border: '3px solid #FFFFFF'
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* RIGHT SIDE: Dynamic Content from Dashboard */}
                        <motion.div
                            className="center-text-mobile"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* 1. Dynamic Headings */}
                            <div className="seo-headings" style={{ marginBottom: '2.5rem' }}>
                                {seoData?.headings?.h1 && (
                                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontFamily: 'var(--font-accent)', color: '#022B3A', marginBottom: '1rem', fontWeight: 800 }}>
                                        {seoData.headings.h1}
                                    </h1>
                                )}
                                
                                {/* Only show H2 if it's set in dashboard, OR if NO headings exist at all (fallback case) */}
                                {(seoData?.headings?.h2 || (!seoData?.headings?.h1 && !loading)) && (
                                    <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.8rem)', fontFamily: 'var(--font-accent)', color: '#1F7A8C', marginBottom: '1.5rem', fontWeight: 700 }}>
                                        {getVal(seoData?.headings?.h2, hardcodedData.h2)}
                                    </h2>
                                )}
                            </div>

                            {/* 2. Main Text Content (from Dashboard or Hardcoded) */}
                            <div className="content-from-dashboard" style={{
                                fontSize: '1.15rem',
                                lineHeight: 1.9,
                                color: '#022B3A',
                            }}>
                                <div 
                                    className="prose-content"
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1.5rem'
                                    }}
                                    // Use Dashboard HTML or Hardcoded Fallback
                                    dangerouslySetInnerHTML={{ __html: getVal(seoData?.htmlContent, hardcodedData.content) }} 
                                />
                                
                                <style dangerouslySetInnerHTML={{ __html: `
                                    .prose-content p {
                                        background: #E1E5F2;
                                        padding: 1.8rem;
                                        border-radius: 15px;
                                        border-left: 5px solid #1F7A8C;
                                        box-shadow: 0 5px 15px rgba(31, 122, 140, 0.1);
                                        margin: 0;
                                    }
                                    .prose-content p:nth-child(even) {
                                        background: #BFDBF7;
                                    }
                                    .prose-content ul, .prose-content ol {
                                        padding-left: 2rem;
                                        background: #F8FAFC;
                                        padding: 2rem;
                                        border-radius: 15px;
                                        border: 1px solid #E1E5F2;
                                    }
                                    .prose-content li {
                                        margin-bottom: 0.5rem;
                                    }
                                    .prose-content img {
                                        max-width: 100%;
                                        height: auto;
                                        border-radius: 15px;
                                        margin: 1rem 0;
                                        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                                    }
                                `}} />

                                {/* Internal Links (SEO Management) */}
                                {seoData?.internalLinks?.length > 0 && (
                                    <div style={{ marginTop: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                                        <span style={{ fontWeight: 700, color: '#1F7A8C' }}>Related Items:</span>
                                        {seoData.internalLinks.map((link, idx) => (
                                            <a 
                                                key={idx} 
                                                href={link.targetUrl}
                                                style={{
                                                    color: '#1F7A8C',
                                                    textDecoration: 'none',
                                                    borderBottom: '1px dashed #1F7A8C',
                                                    fontSize: '1rem'
                                                }}
                                            >
                                                {link.anchorText}
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* 3. Signature (Hardcoded in design, but text could be dynamic) */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.6 }}
                                style={{
                                    marginTop: '2rem',
                                    padding: '2.5rem',
                                    background: 'linear-gradient(135deg, #1F7A8C 0%, #022B3A 100%)',
                                    borderRadius: '20px',
                                    textAlign: 'center',
                                    boxShadow: '0 15px 40px rgba(31, 122, 140, 0.3)',
                                    border: '3px solid #BFDBF7'
                                }}
                            >
                                <p style={{ fontSize: '1.3rem', fontStyle: 'italic', color: '#E1E5F2', margin: 0, fontWeight: 600 }}>
                                    {hardcodedData.signatureMotto}
                                </p>
                                <p style={{ fontSize: '2rem', fontFamily: 'var(--font-accent)', color: '#FFFFFF', margin: '1rem 0 0', fontWeight: 700 }}>
                                    {hardcodedData.signature}
                                </p>
                            </motion.div>

                            {/* 4. Dynamic FAQs */}
                            {seoData?.faqs?.length > 0 && (
                                <div style={{ marginTop: '4rem', textAlign: 'left' }}>
                                    <h3 style={{ fontSize: '2rem', fontFamily: 'var(--font-accent)', color: '#1F7A8C', marginBottom: '2rem', textAlign: 'center' }}>
                                        Frequently Asked Questions
                                    </h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {seoData.faqs.map((faq, idx) => (
                                            <div key={idx} style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '15px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid #F1F5F9' }}>
                                                <h4 style={{ color: '#1F7A8C', fontWeight: 700, marginBottom: '0.8rem' }}>{faq.question}</h4>
                                                <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0 }}>{faq.answer}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
