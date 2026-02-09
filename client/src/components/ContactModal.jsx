import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaWhatsapp, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import api from '../lib/api';

const ContactModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        setLoading(true);

        try {
            await api.post('/contact', formData);
            setSuccess(true);
            setFormData({ name: '', email: '', message: '' });

            // Auto close after 2 seconds
            setTimeout(() => {
                setSuccess(false);
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to send message. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                    style={{ zIndex: 100000, paddingTop: '90px' }}
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3 }}
                        className="relative w-full max-w-3xl mx-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            className="absolute top-6 right-6 z-50 text-gray-400 hover:text-gray-600 bg-white rounded-full p-2 shadow-md transition-colors"
                        >
                            <FaTimes size={20} />
                        </button>

                        {/* Modal Content */}
                        <div
                            style={{
                                background: '#ffffff',
                                borderRadius: '30px',
                                padding: '3.5rem',
                                boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                                border: '1px solid #E1E5F2',
                                position: 'relative',
                                overflow: 'auto',
                                maxHeight: 'calc(100vh - 4rem)'
                            }}
                            className="scrollbar-hide"
                        >
                            {/* Decorative Background Blob */}
                            <div style={{
                                position: 'absolute',
                                top: '-50px',
                                right: '-50px',
                                width: '150px',
                                height: '150px',
                                background: 'radial-gradient(circle, #BFDBF7 0%, transparent 70%)',
                                opacity: 0.5,
                                zIndex: 0
                            }} />

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                                {success && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        fontWeight: '600'
                                    }}>
                                        ✓ Message sent successfully!
                                    </div>
                                )}
                                {error && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                                        color: 'white',
                                        borderRadius: '12px',
                                        textAlign: 'center',
                                        fontWeight: '600'
                                    }}>
                                        {error}
                                    </div>
                                )}
                                <div>
                                    <label style={labelStyle}>Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your full name"
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email address"
                                        style={inputStyle}
                                        required
                                    />
                                </div>
                                <div>
                                    <label style={labelStyle}>Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        placeholder="How can we help you?"
                                        rows="5"
                                        style={{ ...inputStyle, resize: 'vertical' }}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        marginTop: '1rem',
                                        padding: '1.2rem 2.5rem',
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        color: '#FFFFFF',
                                        background: loading ? '#94a3b8' : 'linear-gradient(135deg, #1F7A8C 0%, #022B3A 100%)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        width: '100%',
                                        boxShadow: '0 10px 20px rgba(31, 122, 140, 0.2)',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}
                                    onMouseOver={(e) => {
                                        if (!loading) {
                                            e.currentTarget.style.transform = 'translateY(-3px)';
                                            e.currentTarget.style.boxShadow = '0 15px 30px rgba(31, 122, 140, 0.3)';
                                        }
                                    }}
                                    onMouseOut={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '0 10px 20px rgba(31, 122, 140, 0.2)';
                                    }}
                                >
                                    {loading ? 'SENDING...' : 'SEND MESSAGE'}
                                </button>
                            </form>

                            {/* Contact Info List with Icons */}
                            <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '2px dashed #E1E5F2' }}>
                                <h3 style={{ fontSize: '1.5rem', color: '#022B3A', marginBottom: '1.5rem', fontWeight: 700 }}>Or reach us directly</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                    <ContactRow
                                        icon={<FaEnvelope />}
                                        title="Email Us"
                                        value="gaurangasgroup@gmail.com"
                                        href="mailto:gaurangasgroup@gmail.com"
                                        color="#1F7A8C"
                                    />
                                    <ContactRow
                                        icon={<FaPhoneAlt />}
                                        title="Call Us"
                                        value="+91 7600156255"
                                        href="tel:+917600156255"
                                        color="#1F7A8C"
                                    />
                                    <ContactRow
                                        icon={<FaMapMarkerAlt />}
                                        title="Visit Us"
                                        value="Vrindavan, Uttar Pradesh, India"
                                        color="#1F7A8C"
                                    />
                                </div>
                            </div>

                            <div style={{ marginTop: '2rem' }}>
                                <motion.a
                                    href="https://api.whatsapp.com/send/?phone=917600156255&text&type=phone_number&app_absent=0"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.8rem',
                                        background: '#E6FFFA',
                                        color: '#25D366',
                                        border: '2px solid #25D366',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        textDecoration: 'none',
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <FaWhatsapp size={24} />
                                    Chat with us on WhatsApp
                                </motion.a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const labelStyle = {
    display: 'block',
    marginBottom: '0.5rem',
    fontWeight: 700,
    color: '#022B3A',
    fontSize: '0.95rem',
    marginLeft: '0.2rem'
};

const inputStyle = {
    width: '100%',
    padding: '1.2rem',
    borderRadius: '12px',
    border: '2px solid #E1E5F2',
    fontSize: '1rem',
    outline: 'none',
    color: '#022B3A',
    background: '#F8FAFC',
    transition: 'all 0.3s ease',
};

const ContactRow = ({ icon, title, value, href, color }) => {
    const content = (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.8rem', borderRadius: '12px', transition: 'background 0.2s' }} className="contact-row">
            <div style={{
                width: '45px',
                height: '45px',
                background: `${color}15`,
                color: color,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                flexShrink: 0
            }}>
                {icon}
            </div>
            <div>
                <h4 style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.2rem' }}>{title}</h4>
                <p style={{ margin: 0, fontSize: '1.05rem', color: '#022B3A', fontWeight: 600 }}>{value}</p>
            </div>
        </div>
    );

    if (href) {
        return (
            <a href={href} style={{ textDecoration: 'none', color: 'inherit' }}>
                {content}
            </a>
        );
    }
    return content;
};

export default ContactModal;
