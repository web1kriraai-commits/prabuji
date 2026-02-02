import { motion } from 'framer-motion';
import footerRotatingImg from '../assets/image/photo-1606041008023-472dfb5e530f__1_-removebg-preview.png';

import { 
  FaFacebookF, 
  FaInstagram, 
  FaTwitter, 
  FaYoutube,
  FaHome,
  FaInfoCircle,
  FaConciergeBell,
  FaCalendarAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaArrowRight,
  FaHeart
} from 'react-icons/fa';

const Footer = () => {
  const socialLinks = [
    { icon: <FaFacebookF />, label: 'Facebook' },
    { icon: <FaInstagram />, label: 'Instagram' },
    { icon: <FaTwitter />, label: 'Twitter' },
    { icon: <FaYoutube />, label: 'YouTube' }
  ];

  const quickLinks = [
    { icon: <FaHome />, text: 'Home' },
    { icon: <FaInfoCircle />, text: 'About Us' },
    { icon: <FaConciergeBell />, text: 'Services' },
    { icon: <FaCalendarAlt />, text: 'Events' },
    { icon: <FaPhoneAlt />, text: 'Contact' }
  ];

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={{
        hidden: { y: 100, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: {
            type: "spring",
            stiffness: 50,
            damping: 20,
            staggerChildren: 0.1,
            delayChildren: 0.2
          }
        }
      }}
      style={{
        background: 'linear-gradient(135deg, #1f7a8c 0%, #2c5f6f 50%, #1a5f6f 100%)',
        color: 'var(--color-white)',
        position: 'relative',
        overflow: 'hidden',
        padding: '6rem 2rem 2rem'
      }}
    >
      {/* Animated Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.05,
        backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        zIndex: 0
      }} />

      {/* Rotating Image */}
      <motion.div
        animate={{
          rotate: 360
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          position: 'absolute',
          top: '5%',
          right: '5%',
          width: '150px',
          height: '150px',
          zIndex: 1
        }}
      >
        <img
          src={footerRotatingImg}
          alt="Decorative"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
          }}
        />
      </motion.div>

      <div className="container" style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Footer Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* About Section */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h3 style={{
              fontSize: '1.5rem',
              fontFamily: 'var(--font-accent)',
              marginBottom: '1.5rem',
              color: '#bfdbf7',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem'
            }}>
              {/* Optional: Add a small logo/icon here */}
              <span style={{ fontSize: '1.8rem' }}>🕉️</span>
              Gaurangas Group
            </h3>
            <p style={{
              fontSize: '0.95rem',
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '1.5rem'
            }}>
              Bringing the essence of Krishna Consciousness into your daily life through inspiring yatras, blissful kirtans, and transformative spiritual courses.
            </p>
            
            {/* Social Media Links */}
            <div style={{
              display: 'flex',
              gap: '1rem'
            }}>
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href="#"
                  aria-label={social.label}
                  whileHover={{
                    scale: 1.2,
                    y: -5,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    width: '45px',
                    height: '45px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.1rem',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                    color: 'white'
                  }}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h3 style={{
              fontSize: '1.3rem',
              fontFamily: 'var(--font-accent)',
              marginBottom: '1.5rem',
              color: '#bfdbf7',
              fontWeight: 700
            }}>
              Quick Links
            </h3>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0
            }}>
              {quickLinks.map((link, index) => (
                <motion.li
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                  style={{ marginBottom: '0.8rem' }}
                >
                  <a href="#" style={{
                    color: 'rgba(255, 255, 255, 0.85)',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    transition: 'color 0.3s ease',
                    padding: '0.25rem 0'
                  }}
                    onMouseOver={(e) => e.target.style.color = '#bfdbf7'}
                    onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.85)'}
                  >
                    <span style={{ 
                      fontSize: '0.9rem',
                      color: '#bfdbf7',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {link.icon}
                    </span>
                    {link.text}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h3 style={{
              fontSize: '1.3rem',
              fontFamily: 'var(--font-accent)',
              marginBottom: '1.5rem',
              color: '#bfdbf7',
              fontWeight: 700
            }}>
              Contact Info
            </h3>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <span style={{ 
                  fontSize: '1rem',
                  color: '#bfdbf7',
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: '20px'
                }}>
                  <FaMapMarkerAlt />
                </span>
                <p style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.6
                }}>
                  Vrindavan, UP, India
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <span style={{ 
                  fontSize: '1rem',
                  color: '#bfdbf7',
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: '20px'
                }}>
                  <FaPhoneAlt />
                </span>
                <p style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.6
                }}>
                  +91 7990200618
                </p>
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem'
              }}>
                <span style={{ 
                  fontSize: '1rem',
                  color: '#bfdbf7',
                  display: 'flex',
                  alignItems: 'center',
                  minWidth: '20px'
                }}>
                  <FaEnvelope />
                </span>
                <p style={{
                  margin: 0,
                  fontSize: '0.95rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  lineHeight: 1.6,
                  wordBreak: 'break-word'
                }}>
                  gaurangasgroup@gmail.com
                </p>
              </div>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 }
            }}
          >
            <h3 style={{
              fontSize: '1.3rem',
              fontFamily: 'var(--font-accent)',
              marginBottom: '1.5rem',
              color: '#bfdbf7',
              fontWeight: 700
            }}>
              Newsletter
            </h3>
            <p style={{
              fontSize: '0.95rem',
              color: 'rgba(255, 255, 255, 0.85)',
              marginBottom: '1rem',
              lineHeight: 1.6
            }}>
              Subscribe for upcoming events and daily inspiration.
            </p>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  placeholder="Your email address"
                  style={{
                    padding: '0.9rem 1.2rem 0.9rem 3rem',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: 'var(--color-white)',
                    fontSize: '0.95rem',
                    outline: 'none',
                    transition: 'all 0.3s ease',
                    width: '100%',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                    e.target.style.borderColor = '#bfdbf7';
                  }}
                  onBlur={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                />
                <FaEnvelope style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: '0.9rem'
                }} />
              </div>
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                  transition: { duration: 0.2 }
                }}
                whileTap={{ scale: 0.98 }}
                style={{
                  padding: '0.9rem 1.5rem',
                  borderRadius: '10px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #bfdbf7 0%, #e1e5f2 100%)',
                  color: '#1f7a8c',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <FaArrowRight /> Subscribe
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Divider */}
        <motion.div
          variants={{
            hidden: { scaleX: 0, opacity: 0 },
            visible: { scaleX: 1, opacity: 1 }
          }}
          style={{
            height: '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            marginBottom: '2rem'
          }}
        />

        {/* Copyright Section */}
        <motion.div
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1 }
          }}
          style={{
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <p style={{ margin: 0 }}>
            Copyright © {new Date().getFullYear()} Gaurangas Group. All rights reserved.
          </p>
          <p style={{ 
            margin: 0,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            Made with 
            <FaHeart style={{ 
              color: '#ff6b6b',
              fontSize: '0.8rem'
            }} /> 
            for Krishna Consciousness
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
};

export default Footer;