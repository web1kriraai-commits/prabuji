/**
 * Home Page Component
 * Landing page with Dashboard Integration & Hardcoded Fallbacks
 */

import React, { useState, useEffect } from 'react';
import cartikImage from '../assets/image/kartik-month-vrindavan-pic.jpg';
import preachingImage from '../assets/image/preaching.jpg';
import heroBg from '../assets/image/image1.jpg';
import uddhavaDasImage from '../assets/image/Uddhava-das.jpg';
import { TypingAnimation } from '../components/magicui/TypingAnimation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

import gaurangaVidhyapithImg from '../assets/image/gauranga-vidhyapith.jpg';
import japaBeadsImg from '../assets/image/prabhpada.jpg';
import sadhanaReportImg from '../assets/image/sadhana-report.jpg';
import divine1 from '../assets/image/IMG-20241030-WA0091.jpg';
import divine2 from '../assets/image/IMG-20241030-WA0055.jpg';
import divine3 from '../assets/image/IMG-20241030-WA0052.jpg';
import divine4 from '../assets/image/IMG_20241025_130912.jpg';
import upcomingEventBg from '../assets/image/upcoming-event-bg.png';
import supportMissionImg from '../assets/image/kartik-month-vrindavan-pic.jpg';
import useSeoConfig from '../hooks/useSeoConfig';

const ContactCard = ({ icon, label, value, delay, color, href }) => {
    const Component = href ? motion.a : motion.div;
    const props = href ? { href, target: href.startsWith('mailto') || href.startsWith('tel') ? undefined : "_blank", rel: "noopener noreferrer" } : {};

    return (
        <Component
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay, type: "spring", stiffness: 100 }}
            {...props}
            whileHover={{ scale: 1.02, backgroundColor: '#F0F9FF', borderColor: '#BAE6FD' }}
            whileTap={{ scale: 0.98 }}
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#ffffff',
                border: '1px solid #E1E5F2',
                borderRadius: '16px',
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
            }}
        >
            <div style={{
                width: '45px',
                height: '45px',
                background: `${color}15`,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0,
                color: color,
            }}>
                {icon}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    color: '#64748B',
                    letterSpacing: '0.05em',
                    marginBottom: '0.2rem',
                    textTransform: 'uppercase'
                }}>
                    {label}
                </span>
                <span style={{
                    fontSize: '1rem',
                    fontWeight: 600,
                    color: '#022B3A'
                }}>
                    {value}
                </span>
            </div>
        </Component>
    );
};

const Home = () => {
    const { seoData, loading } = useSeoConfig();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);
    const [imageError, setImageError] = useState(false);

    // Hardcoded Fallbacks
    const hardcoded = {
        heroH1: "Experience Krishna Consciousness at Your Own Place",
        heroP: "Your search for spirituality ends here. Gaurangas Group brings you a complete package of devotion, knowledge, and spiritual wellness.",
        aboutH2: "About Gaurangas Group",
        content: `<p>Led by Uddhava Das, Gaurangas Group offers a unique blend of devotional experiences and lifestyle enrichment.</p>\n<p>Through inspiring yatras, blissful kirtans, and transformative spiritual courses, we guide seekers to a conscious lifestyle rooted in bhakti, comfort, and well-being.</p>`
    };

    // Helper to get dynamic or fallback
    const getVal = (dynamic, fb) => (dynamic && dynamic.trim() !== '' ? dynamic : fb);

    const [galleryItems, setGalleryItems] = useState([
        { id: 1, src: divine4 },
        { id: 2, src: divine2 },
        { id: 3, src: divine3 },
        { id: 4, src: divine1 },
        { id: 5, src: divine2 }
    ]);

    useEffect(() => {
        if (seoData?.images && seoData.images.length >= 12) {
            setGalleryItems((prevItems) => prevItems.map((item) => {
                const idxOffset = item.id - 1;
                const fbSrc = [divine4, divine2, divine3, divine1, divine2][idxOffset];
                return {
                    ...item,
                    src: getVal(seoData.images[7 + idxOffset]?.url, fbSrc)
                };
            }));
        }
    }, [seoData?.images]);

    const THUMBNAIL_HEIGHT = 220;
    const GRID_GAP = 24;
    const rightSideImages = galleryItems.slice(1);
    const rowCount = Math.ceil(rightSideImages.length / 2);
    const galleryHeight = (rowCount * THUMBNAIL_HEIGHT) + ((rowCount - 1) * GRID_GAP);

    const handleImageClick = (clickedId) => {
        const index = galleryItems.findIndex(item => item.id === clickedId);
        if (index === 0) return;
        const newItems = [...galleryItems];
        [newItems[0], newItems[index]] = [newItems[index], newItems[0]];
        setGalleryItems(newItems);
    };

    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="home-page">
            <motion.section
                className="hero-section responsive-section"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                variants={fadeIn}
                style={{
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'var(--color-white)',
                    color: 'var(--color-jet-black)',
                    overflow: 'hidden'
                }}>
                <div className="container" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '2rem',
                    marginBottom: '3rem',
                    textAlign: 'center'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '4rem',
                        flexWrap: 'wrap-reverse',
                        flexDirection: 'row',
                        width: '100%',
                        textAlign: 'left'
                    }}>
                        <div className="center-text-mobile" style={{ flex: '1 1 500px', paddingRight: '0' }}>
                            <motion.h1
                                variants={fadeIn}
                                style={{
                                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                                    fontFamily: 'var(--font-accent)',
                                    color: '#1f7a8c',
                                    marginBottom: '1rem',
                                    fontWeight: 700,
                                    lineHeight: 1.2
                                }}>
                                {getVal(seoData?.headings?.h1, hardcoded.heroH1)}
                            </motion.h1>
                            <motion.p
                                variants={fadeIn}
                                transition={{ delay: 0.2 }}
                                style={{
                                    fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
                                    color: 'var(--color-text-light)',
                                    maxWidth: '600px',
                                    lineHeight: 1.6
                                }}>
                                {getVal(seoData?.metaDescription, hardcoded.heroP)}
                            </motion.p>
                        </div>
                        <div style={{ flex: '1 1 400px' }}>
                            <motion.img
                                src={(!imageError && seoData?.images?.[0]?.url) ? seoData.images[0].url : heroBg}
                                alt="Krishna Consciousness"
                                onError={() => setImageError(true)}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    boxShadow: '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
                                    objectFit: 'cover',
                                    maxHeight: '400px',
                                }}
                                animate={{
                                    borderRadius: [
                                        "60% 40% 30% 70% / 60% 30% 70% 40%",
                                        "30% 60% 70% 40% / 50% 60% 30% 60%",
                                        "60% 40% 30% 70% / 60% 30% 70% 40%"
                                    ]
                                }}
                                transition={{
                                    duration: 0.8,
                                    borderRadius: {
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <div className="container responsive-grid" style={{
                    width: '100%',
                    maxWidth: '1200px'
                }}>
                    <motion.div
                        className="hero-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            background: '#e1e5f2',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ height: '300px', overflow: 'hidden' }}>
                            <img
                                src={getVal(seoData?.images?.[1]?.url, cartikImage)}
                                alt={getVal(seoData?.images?.[1]?.altText, "Kartik Month in Vrindavan")}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        </div>
                        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-jet-black)', marginBottom: '1rem', fontFamily: 'var(--font-primary)' }}>
                                {getVal(seoData?.headings?.h3, "Embark on a Sacred Journey")}
                            </h3>
                            <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                                {getVal(seoData?.images?.[1]?.caption, "Experience the divine land of Vrindavan in the holiest month of Kartik")}
                            </p>
                            <button style={{
                                marginTop: 'auto',
                                padding: '1rem 2.5rem',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: 'var(--color-jet-black)',
                                background: 'linear-gradient(to right, var(--color-jet-black) 50%, transparent 50%)',
                                backgroundSize: '200% 100%',
                                backgroundPosition: '100% 0',
                                border: '2px solid var(--color-jet-black)',
                                borderRadius: 'var(--radius-full)',
                                cursor: 'pointer',
                                transition: 'background-position 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), color 0.4s ease-in-out'
                            }}
                                onClick={() => {
                                    const link = getVal(seoData?.internalLinks?.[0]?.targetUrl, "");
                                    if (link) window.open(link, '_blank');
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundPosition = '0 0';
                                    e.target.style.color = 'var(--color-white)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundPosition = '100% 0';
                                    e.target.style.color = 'var(--color-jet-black)';
                                }}
                            >
                                {getVal(seoData?.internalLinks?.[0]?.anchorText, "Join Our Yatra")}
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="hero-card"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            background: '#e1e5f2',
                            borderRadius: 'var(--radius-xl)',
                            overflow: 'hidden',
                            boxShadow: 'var(--shadow-lg)',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ height: '300px', overflow: 'hidden' }}>
                            <img
                                src={getVal(seoData?.images?.[2]?.url, preachingImage)}
                                alt={getVal(seoData?.images?.[2]?.altText, "Preaching")}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease'
                                }}
                                onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                            />
                        </div>
                        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: 'transparent' }}>
                            <h3 style={{ fontSize: '1.75rem', color: 'var(--color-jet-black)', marginBottom: '1rem', fontFamily: 'var(--font-primary)' }}>
                                {getVal(seoData?.headings?.h4, "Support Our Spiritual Mission")}
                            </h3>
                            <p style={{ color: 'var(--color-text-light)', marginBottom: '2rem', fontSize: '1.1rem' }}>
                                {getVal(seoData?.images?.[2]?.caption, "Help us spread Krishna's teachings and arrange transformative devotional events")}
                            </p>
                            <button style={{
                                marginTop: 'auto',
                                padding: '1rem 2.5rem',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                color: 'var(--color-jet-black)',
                                background: 'linear-gradient(to right, var(--color-jet-black) 50%, transparent 50%)',
                                backgroundSize: '200% 100%',
                                backgroundPosition: '100% 0',
                                border: '2px solid var(--color-jet-black)',
                                borderRadius: 'var(--radius-full)',
                                cursor: 'pointer',
                                transition: 'background-position 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), color 0.4s ease-in-out'
                            }}
                                onClick={() => {
                                    const link = getVal(seoData?.internalLinks?.[1]?.targetUrl, "");
                                    if (link) window.open(link, '_blank');
                                }}
                                onMouseOver={(e) => {
                                    e.target.style.backgroundPosition = '0 0';
                                    e.target.style.color = 'var(--color-white)';
                                }}
                                onMouseOut={(e) => {
                                    e.target.style.backgroundPosition = '100% 0';
                                    e.target.style.color = 'var(--color-jet-black)';
                                }}
                            >
                                {getVal(seoData?.internalLinks?.[1]?.anchorText, "Donate Now")}
                            </button>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            <motion.section
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="responsive-section"
                style={{
                    background: 'var(--color-white)',
                    overflow: 'hidden'
                }}>
                <div className="container" style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5rem',
                    flexWrap: 'wrap'
                }}>
                    <div style={{ flex: '1 1 400px', display: 'flex', justifyContent: 'center', maxWidth: '500px' }}>
                        <div style={{ position: 'relative', padding: '1rem', border: '1px solid var(--color-lavender)', borderRadius: '200px 200px 20px 20px' }}>
                            <img
                                src={getVal(seoData?.images?.[3]?.url, uddhavaDasImage)}
                                alt={getVal(seoData?.images?.[3]?.altText, "Uddhava Das")}
                                style={{ width: '100%', height: 'auto', borderRadius: '190px 190px 10px 10px', boxShadow: 'var(--shadow-lg)', display: 'block' }}
                            />
                        </div>
                    </div>

                    <div className="center-text-mobile" style={{ flex: '1 1 500px', maxWidth: '600px' }}>
                        <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: 'var(--font-accent)', color: '#1f7a8c', marginBottom: '2rem', fontWeight: 700, lineHeight: 1.1 }}>
                            {getVal(seoData?.headings?.h2, hardcoded.aboutH2)}
                        </h2>

                        <div className="home-dashboard-content" style={{ fontSize: '1.1rem', color: 'var(--color-text-light)', lineHeight: 1.8, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <div
                                className="prose-styled-content"
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '1.5rem'
                                }}
                                dangerouslySetInnerHTML={{ __html: getVal(seoData?.htmlContent, hardcoded.content) }}
                            />

                            <style dangerouslySetInnerHTML={{
                                __html: `
                                .prose-styled-content p {
                                    background: #E1E5F2;
                                    padding: 1.5rem;
                                    border-radius: 15px;
                                    border-left: 5px solid #1F7A8C;
                                    box-shadow: 0 5px 15px rgba(31, 122, 140, 0.05);
                                    margin: 0;
                                    color: #022B3A;
                                }
                                .prose-styled-content p:nth-child(even) {
                                    background: #BFDBF7;
                                }
                                .prose-styled-content ul, .prose-styled-content ol {
                                    padding-left: 2rem;
                                    background: #F8FAFC;
                                    padding: 1.5rem;
                                    border-radius: 15px;
                                    border: 1px solid #E1E5F2;
                                }
                                .prose-styled-content li {
                                    margin-bottom: 0.5rem;
                                    color: #022B3A;
                                }
                                .prose-styled-content img {
                                    max-width: 100%;
                                    height: auto;
                                    border-radius: 12px;
                                    margin: 1rem 0;
                                }
                            `}} />

                            <p style={{ borderLeft: '4px solid var(--color-teal)', paddingLeft: '1.5rem', color: 'var(--color-jet-black)', fontStyle: 'italic', minHeight: '3rem' }}>
                                <TypingAnimation duration={30} startOnView={true}>
                                    We are committed to bringing the essence of Krishna Consciousness into your daily life — wherever you are.
                                </TypingAnimation>
                            </p>
                        </div>
                    </div>
                </div>
            </motion.section>

            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
                }}
                style={{
                    padding: '0rem 2rem 2rem',
                    background: 'var(--color-white)',
                }}
            >
                <div className="container">
                    <motion.h2 variants={fadeIn} className="center-text-mobile" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: 'var(--font-accent)', color: '#1f7a8c', marginBottom: '4rem', fontWeight: 700, lineHeight: 1.1, textAlign: 'center' }}>
                        {getVal(seoData?.headings?.h5, "Our Offerings")}
                    </motion.h2>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
                        {[
                            {
                                title: getVal(seoData?.images?.[4]?.altText, 'Gauranga Vidhyapith'),
                                image: getVal(seoData?.images?.[4]?.url, gaurangaVidhyapithImg),
                                desc: getVal(seoData?.images?.[4]?.caption, 'Our aim is to nourish your soul daily and keep you engaged in Krishna consciousness.'),
                                button: getVal(seoData?.internalLinks?.[2]?.anchorText, 'Join Our Channel'),
                                link: getVal(seoData?.internalLinks?.[2]?.targetUrl, '')
                            },
                            {
                                title: getVal(seoData?.images?.[5]?.altText, 'Japa beads'),
                                image: getVal(seoData?.images?.[5]?.url, japaBeadsImg),
                                desc: getVal(seoData?.images?.[5]?.caption, 'Guided chanting 5:30AM – 7:30AM to align your mind and soul with the holy names.'),
                                button: getVal(seoData?.internalLinks?.[3]?.anchorText, 'Join Online - Zoom'),
                                link: getVal(seoData?.internalLinks?.[3]?.targetUrl, '')
                            },
                            {
                                title: getVal(seoData?.images?.[6]?.altText, 'Accountability'),
                                image: getVal(seoData?.images?.[6]?.url, sadhanaReportImg),
                                desc: getVal(seoData?.images?.[6]?.caption, 'Join our Accountability WhatsApp Group & track your daily Sadhana with under guidance senior devotees.'),
                                button: getVal(seoData?.internalLinks?.[4]?.anchorText, 'Join Now'),
                                link: getVal(seoData?.internalLinks?.[4]?.targetUrl, 'https://api.whatsapp.com/send/?phone=917600156255&text&type=phone_number&app_absent=0')
                            }
                        ].map((offering, index) => (
                            <motion.div key={index} variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }} whileHover={{ y: -5 }} style={{ background: '#bfdbf7', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingBottom: '2rem', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', height: '100%' }}>
                                <div style={{ width: '100%', height: '250px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                                    <img src={offering.image} alt={offering.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <div style={{ padding: '0 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, width: '100%' }}>
                                    <h3 style={{ fontSize: '1.5rem', color: 'var(--color-jet-black)', marginBottom: '1rem', fontFamily: 'var(--font-primary)', fontWeight: 700 }}>{offering.title}</h3>
                                    <p style={{ color: '#555', marginBottom: '2rem', lineHeight: 1.6, fontSize: '1rem', flex: 1 }}>{offering.desc}</p>
                                    <button onClick={() => offering.link && window.open(offering.link, '_blank')} style={{ background: 'linear-gradient(to right, var(--color-jet-black) 50%, transparent 50%)', backgroundSize: '200% 100%', backgroundPosition: '100% 0', border: '2px solid var(--color-jet-black)', padding: '0.8rem 2rem', borderRadius: '50px', color: 'var(--color-jet-black)', cursor: 'pointer', fontWeight: 600, transition: 'background-position 0.4s ease', minWidth: '150px' }}>{offering.button}</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* Divine Glimpses Gallery */}
            <section className="responsive-section" style={{ background: 'var(--color-white)' }}>
                <div className="container">
                    <h2 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: 'var(--font-accent)', color: '#1f7a8c', textAlign: 'center', marginBottom: '3rem', fontWeight: 700, lineHeight: 1.1, textTransform: 'uppercase' }}>
                        {getVal(seoData?.headings?.h6, "Divine Glimpses")}
                    </h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', alignItems: 'start' }}>
                        <div style={{ height: `${galleryHeight}px`, width: '100%', borderRadius: '15px', position: 'relative', background: '#f0f0f0' }}>
                            <motion.div layout transition={{ type: "spring", stiffness: 300, damping: 30 }} style={{ width: '100%', height: '100%', borderRadius: '15px', overflow: 'hidden' }}>
                                <img src={galleryItems[0].src} alt="Divine Glimpse" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </motion.div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: `${GRID_GAP}px` }}>
                            {rightSideImages.map((item) => (
                                <motion.div key={item.id} layout onClick={() => handleImageClick(item.id)} whileHover={{ scale: 1.05 }} style={{ height: `${THUMBNAIL_HEIGHT}px`, borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}>
                                    <img src={item.src} alt="Thumbnail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Upcoming Events Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                variants={fadeIn}
                className="responsive-section"
                style={{ background: 'var(--color-white)', position: 'relative', overflow: 'hidden' }}
            >
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div style={{ position: 'relative', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', minHeight: '500px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundImage: `url(${getVal(seoData?.images?.[12]?.url, upcomingEventBg)})`, backgroundSize: 'cover', backgroundPosition: 'center', zIndex: 0 }} />
                        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0, 0, 0, 0.25)', zIndex: 1 }} />
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                            style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '4rem 2rem', color: 'var(--color-white)', maxWidth: '800px' }}
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'rgba(255, 255, 255, 0.2)', backdropFilter: 'blur(10px)', padding: '0.5rem 1.5rem', borderRadius: '50px', marginBottom: '2rem', border: '1px solid rgba(255, 255, 255, 0.3)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase' }}
                            >
                                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffffff', animation: 'blink 0.5s ease-in-out infinite', display: 'inline-block' }} />
                                Upcoming Event
                            </motion.div>
                            <motion.h2
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontFamily: 'var(--font-accent)', color: 'var(--color-white)', marginBottom: '1.5rem', fontWeight: 700, lineHeight: 1.2, textShadow: '2px 2px 10px rgba(0,0,0,0.3)' }}
                            >
                                {getVal(seoData?.images?.[12]?.altText, 'Divine Kirtan & Spiritual Gathering')}
                            </motion.h2>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                                style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', lineHeight: 1.8, marginBottom: '3rem', color: 'rgba(255, 255, 255, 0.95)', textShadow: '1px 1px 5px rgba(0,0,0,0.3)' }}
                            >
                                {getVal(seoData?.images?.[12]?.caption, 'Join us for an enchanting evening of devotional chanting, spiritual discourse, and divine prasadam. Experience the bliss of Krishna consciousness in the company of like-minded souls seeking spiritual elevation.')}
                            </motion.p>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.05, boxShadow: '0 15px 40px rgba(255, 255, 255, 0.5)', background: 'rgba(255, 255, 255, 0.95)', transition: { duration: 0.1 } }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                onClick={() => { const link = getVal(seoData?.internalLinks?.[5]?.targetUrl, ''); if (link) window.open(link, '_blank'); }}
                                style={{ padding: '1.2rem 3rem', fontSize: '1.2rem', fontWeight: 700, color: '#1f7a8c', background: 'rgba(255, 255, 255, 0.85)', border: '2px solid rgba(255, 255, 255, 0.6)', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 25px rgba(0,0,0,0.2)', transition: 'all 0.3s ease', textTransform: 'uppercase', letterSpacing: '1px', backdropFilter: 'blur(10px)' }}
                            >
                                {getVal(seoData?.internalLinks?.[5]?.anchorText, 'Reserve Your Spot')}
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Support Our Mission Section */}
            <motion.section
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                variants={fadeIn}
                className="responsive-section"
                style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)', position: 'relative', overflow: 'hidden' }}
            >
                <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} style={{ position: 'absolute', top: '-10%', right: '-5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(31, 122, 140, 0.2) 0%, transparent 70%)', zIndex: 0 }} />
                <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 }} style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(191, 219, 247, 0.3) 0%, transparent 70%)', zIndex: 0 }} />
                <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="center-text-mobile mobile-center-items" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: 'var(--font-accent)', color: '#1f7a8c', marginBottom: '0', fontWeight: 700, lineHeight: 1.2 }}>
                                {getVal(seoData?.images?.[13]?.altText, 'Support Our Mission')}
                            </motion.h2>
                            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', color: '#2c3e50', lineHeight: 1.8, marginBottom: '0' }}>
                                {getVal(seoData?.images?.[13]?.caption, 'Your support helps us make a real difference in the community. We work tirelessly on projects that uplift and empower those in need. Every contribution, no matter the size, has a positive impact. Join us in our mission to bring hope and change.')}
                            </motion.p>
                            <motion.button
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                whileHover={{ scale: 1.08, boxShadow: '0 20px 40px rgba(31, 122, 140, 0.4)', transition: { duration: 0.3, ease: 'easeOut' } }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
                                onClick={() => { const link = getVal(seoData?.internalLinks?.[6]?.targetUrl, ''); if (link) window.open(link, '_blank'); }}
                                style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-white)', background: 'linear-gradient(135deg, #2563eb 0%, #1f7a8c 100%)', border: 'none', borderRadius: '50px', cursor: 'pointer', boxShadow: '0 10px 30px rgba(37, 99, 235, 0.3)', textTransform: 'uppercase', letterSpacing: '1px', alignSelf: 'flex-start', position: 'relative', overflow: 'hidden' }}
                            >
                                <motion.span style={{ position: 'relative', zIndex: 1 }}>{getVal(seoData?.internalLinks?.[6]?.anchorText, 'Donate Now')}</motion.span>
                            </motion.button>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }} whileHover={{ y: -10, transition: { duration: 0.3 } }} style={{ position: 'relative', borderRadius: '25px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.15)', background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.5)', minHeight: '400px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <motion.img src={getVal(seoData?.images?.[13]?.url, supportMissionImg)} alt={getVal(seoData?.images?.[13]?.altText, 'Support Our Mission')} whileHover={{ scale: 1.05 }} transition={{ duration: 0.5, ease: 'easeOut' }} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Dynamic FAQs from SEO Management */}
            {seoData?.faqs?.length > 0 && (
                <section className="responsive-section" style={{ background: '#f8fafc', padding: '4rem 2rem' }}>
                    <div className="container">
                        <h2 style={{ fontSize: '2.5rem', fontFamily: 'var(--font-accent)', color: '#1F7A8C', marginBottom: '3rem', textAlign: 'center' }}>
                            Frequently Asked Questions
                        </h2>
                        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {seoData.faqs.map((faq, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    style={{ padding: '1.8rem', background: '#FFFFFF', borderRadius: '18px', boxShadow: '0 4px 15px rgba(0,0,0,0.04)', border: '1px solid #e2e8f0' }}
                                >
                                    <h4 style={{ color: '#1F7A8C', fontWeight: 700, marginBottom: '0.8rem', fontSize: '1.2rem' }}>{faq.question}</h4>
                                    <p style={{ color: '#475569', fontSize: '1.05rem', margin: 0, lineHeight: 1.6 }}>{faq.answer}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Floating Contact Button */}
            <div
                style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000, display: 'flex', alignItems: 'center', gap: '1rem' }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
            >
                <AnimatePresence>
                    {isButtonHovered && (
                        <motion.div
                            initial={{ opacity: 0, x: 20, scale: 0.8 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                            style={{ background: 'linear-gradient(135deg, #1f7a8c 0%, #2563eb 100%)', color: 'white', padding: '0.8rem 1.5rem', borderRadius: '12px', fontSize: '1rem', fontWeight: 600, boxShadow: '0 8px 20px rgba(31, 122, 140, 0.4)', whiteSpace: 'nowrap', position: 'relative' }}
                        >
                            Get In Touch
                            <div style={{ position: 'absolute', right: '-8px', top: '50%', transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '8px solid #2563eb' }} />
                        </motion.div>
                    )}
                </AnimatePresence>
                <motion.button
                    onClick={() => setIsModalOpen(true)}
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0, scale: isButtonHovered ? 1.15 : [1, 1.05, 1] }}
                    transition={{ opacity: { duration: 0.5, delay: 0.5 }, y: { type: 'spring', stiffness: 100, damping: 10, delay: 0.5 }, scale: isButtonHovered ? { duration: 0.3 } : { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}
                    whileTap={{ scale: 0.9 }}
                    style={{ background: 'linear-gradient(135deg, #1f7a8c 0%, #2563eb 100%)', color: 'white', borderRadius: '50%', width: '65px', height: '65px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', border: 'none', cursor: 'pointer', boxShadow: isButtonHovered ? '0 15px 30px rgba(31, 122, 140, 0.5)' : '0 10px 25px rgba(31, 122, 140, 0.4)', transition: 'box-shadow 0.3s ease' }}
                >
                    ✉️
                </motion.button>
            </div>

            {/* Contact Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.65)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, backdropFilter: 'blur(8px)' }}
                        onClick={() => setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0, scale: 0.95 }}
                            animate={{ y: 0, opacity: 1, scale: 1 }}
                            exit={{ y: 50, opacity: 0, scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            style={{ backgroundColor: '#FFFFFF', borderRadius: '30px', width: '100%', maxWidth: '480px', maxHeight: '95vh', overflowY: 'auto', boxShadow: '0 50px 100px -20px rgba(50,50,93,0.25), 0 30px 60px -30px rgba(0,0,0,0.3)', position: 'relative', zIndex: 1002, display: 'flex', flexDirection: 'column' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ background: 'linear-gradient(135deg, #1F7A8C 0%, #022B3A 100%)', padding: '3rem 2rem 2.5rem', color: 'white', textAlign: 'center', position: 'relative', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', overflow: 'hidden' }}>
                                <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '50%', width: '32px', height: '32px', color: 'white', fontSize: '1.2rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                                <div style={{ width: '80px', height: '80px', background: 'rgba(255,255,255,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', border: '2px solid rgba(255,255,255,0.3)' }}>
                                    <FaEnvelope size={40} />
                                </div>
                                <h2 style={{ margin: '0 0 1rem', fontWeight: 800, fontSize: '2rem', fontFamily: 'var(--font-primary)' }}>Get In Touch</h2>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: '0.95rem', lineHeight: 1.5, maxWidth: '350px', marginLeft: 'auto', marginRight: 'auto' }}>
                                    We'd love to hear from you. Whether it's for seva, enrollment, donations, or yatras — reach out anytime.
                                </p>
                            </div>
                            <div style={{ padding: '2rem' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <ContactCard icon={<FaMapMarkerAlt />} label="ADDRESS" value="Vrindavan, UP, India" delay={0.3} color="#1F7A8C" />
                                    <ContactCard icon={<FaPhoneAlt />} label="PHONE" value="+91 9924958709" delay={0.4} color="#1F7A8C" href="tel:+919924958709" />
                                    <ContactCard icon={<FaEnvelope />} label="EMAIL" value="gaurangasgroup@gmail.com" delay={0.5} color="#1F7A8C" href="mailto:gaurangasgroup@gmail.com" />
                                </div>
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} style={{ marginTop: '2.5rem', padding: '2rem', background: 'linear-gradient(180deg, #E6F7FF 0%, #F0FBFF 100%)', borderRadius: '24px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '100px', height: '100px', background: '#D1EFFF', borderRadius: '50%', zIndex: 0 }}></div>
                                    <div style={{ position: 'relative', zIndex: 1 }}>
                                        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#25D366' }}><FaWhatsapp /></div>
                                        <h4 style={{ margin: '0 0 0.5rem', color: '#022B3A', fontSize: '1.25rem', fontWeight: 800 }}>Join Our WhatsApp Group</h4>
                                        <p style={{ margin: '0 0 1.5rem', color: '#555', fontSize: '0.9rem', lineHeight: 1.5 }}>Connect with our community for daily updates and spiritual discussions</p>
                                        <a href="https://api.whatsapp.com/send/?phone=917600156255&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.8rem', backgroundColor: '#25D366', color: 'white', padding: '1rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '1rem', border: 'none', boxShadow: '0 8px 16px rgba(37,211,102,0.25)', width: '100%', cursor: 'pointer' }}>
                                            <FaWhatsapp size={20} /> Join WhatsApp Group
                                        </a>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Home;
