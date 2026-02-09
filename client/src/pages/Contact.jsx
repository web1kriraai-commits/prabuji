import React from 'react';
import { motion } from 'framer-motion';

import ContactForm from '../components/ContactForm'; // Import the new component

const Contact = () => {
    return (
        <div className="contact-page" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #F0F4F8 0%, #FFFFFF 100%)',
            fontFamily: 'var(--font-primary, sans-serif)',
            color: '#022B3A',
            paddingBottom: '4rem'
        }}>
            {/* Header */}
            <div style={{
                textAlign: 'center',
                padding: '4rem 2rem 3rem',
            }}>
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                        fontWeight: 800,
                        color: '#022B3A',
                        marginBottom: '1rem',
                        fontFamily: 'var(--font-accent, serif)'
                    }}
                >
                    Contact Us
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    style={{
                        maxWidth: '600px',
                        margin: '0 auto',
                        fontSize: '1.1rem',
                        color: '#1F7A8C',
                        lineHeight: 1.6
                    }}
                >
                    Have questions? We'd love to hear from you. Reach out to us for any inquiries about our courses, yatras, or seva opportunities.
                </motion.p>
            </div>

            <div className="container" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 2rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                gap: '3rem',
                alignItems: 'start'
            }}>
                {/* Contact Form Section */}
                <ContactForm />

                {/* Map Section */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                        height: '100%',
                        minHeight: '600px',
                        background: '#FFFFFF',
                        borderRadius: '30px',
                        overflow: 'hidden',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                        padding: '1rem',
                        border: '1px solid #E1E5F2'
                    }}
                >
                    <div style={{ borderRadius: '25px', overflow: 'hidden', height: '100%', position: 'relative' }}>
                        <iframe
                            width="100%"
                            height="100%"
                            style={{ border: 0, minHeight: '600px', filter: 'grayscale(0.2) contrast(1.1)' }} // Slight styling to map
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Gaurangas Group Location"
                            src="https://maps.google.com/maps?q=Gaurangas%20Group,%20B9,%20Second%20Floor,%20Bhaktivedanta%20Complex,%20Sri%20Premanand%20Rd,%20near%20ISKCON%20Police%20Choki,%20near%20Agrasen%20Ashram,%20Raman%20Reiti,%20Vrindavan,%20Uttar%20Pradesh%20281121&t=&z=16&ie=UTF8&iwloc=&output=embed"
                        ></iframe>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
