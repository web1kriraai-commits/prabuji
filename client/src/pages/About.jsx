/**
 * About Page Component
 * Spiritual about page with Krishna-themed design
 */

import React from 'react';
import { motion } from 'framer-motion';
import uddhavaDasImage from '../assets/image/temple.jpg';

const About = () => {
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

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
            {/* Main Content Section */}
            <section className="responsive-section" style={{
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
                        {/* Image Section */}
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
                            <div style={{
                                position: 'relative',
                                maxWidth: '500px',
                                width: '100%'
                            }}>
                                {/* Image Container */}
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
                                        src={uddhavaDasImage}
                                        alt="Uddhav Das"
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

                                    {/* Decorative Elements */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        width: '80px',
                                        height: '80px',
                                        background: '#1F7A8C',
                                        borderRadius: '50%',
                                        opacity: 0.2,
                                        zIndex: -1
                                    }} />
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '-15px',
                                        left: '-15px',
                                        width: '100px',
                                        height: '100px',
                                        background: '#BFDBF7',
                                        borderRadius: '50%',
                                        opacity: 0.3,
                                        zIndex: -1
                                    }} />
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Content Section */}
                        <motion.div
                            className="center-text-mobile"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                style={{
                                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                                    fontFamily: 'var(--font-accent)',
                                    color: '#1F7A8C',
                                    marginBottom: '2rem',
                                    fontWeight: 700,
                                    lineHeight: 1.2
                                }}
                            >
                                Hare Krishna
                            </motion.h2>

                            <div style={{
                                fontSize: '1.15rem',
                                lineHeight: 1.9,
                                color: '#022B3A',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem'
                            }}>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.3 }}
                                    style={{
                                        background: '#E1E5F2',
                                        padding: '1.8rem',
                                        borderRadius: '15px',
                                        borderLeft: '5px solid #1F7A8C',
                                        boxShadow: '0 5px 15px rgba(31, 122, 140, 0.1)'
                                    }}
                                >
                                    I am an ordinary devotee of Lord Shri Krishna and I am practicing devotion within ISKCON. I have a deep interest in reading, listening, and speaking about Krishna bhakti, and that's why I strive to share what I learn from other senior devotees on this website.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.4 }}
                                    style={{
                                        background: '#BFDBF7',
                                        padding: '1.8rem',
                                        borderRadius: '15px',
                                        borderLeft: '5px solid #1F7A8C',
                                        boxShadow: '0 5px 15px rgba(31, 122, 140, 0.1)'
                                    }}
                                >
                                    This website is not officially endorsed by ISKCON. All the articles and videos published here are based on my personal understanding and realizations. I take full responsibility for any inaccuracies or misunderstandings that may arise.
                                </motion.p>

                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.5 }}
                                    style={{
                                        background: '#E1E5F2',
                                        padding: '1.8rem',
                                        borderRadius: '15px',
                                        borderLeft: '5px solid #1F7A8C',
                                        boxShadow: '0 5px 15px rgba(31, 122, 140, 0.1)'
                                    }}
                                >
                                    My only intention is to humbly serve the devotees by sharing Krishna-katha and bhakti knowledge through this platform.
                                </motion.p>

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
                                    <p style={{
                                        fontSize: '1.3rem',
                                        fontStyle: 'italic',
                                        color: '#E1E5F2',
                                        margin: 0,
                                        fontWeight: 600,
                                        letterSpacing: '1px'
                                    }}>
                                        In service to Lord Krishna,
                                    </p>
                                    <p style={{
                                        fontSize: '2rem',
                                        fontFamily: 'var(--font-accent)',
                                        color: '#FFFFFF',
                                        margin: '1rem 0 0',
                                        fontWeight: 700
                                    }}>
                                        Uddhav Das
                                    </p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
