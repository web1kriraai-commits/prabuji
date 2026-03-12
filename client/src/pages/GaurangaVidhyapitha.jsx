import React from 'react';
import { motion } from 'framer-motion';
import childrenClassImg from '../assets/image/children-class.jpeg';
import bagavatgitaImg from '../assets/image/bagavatgita.png';
import childImg from '../assets/image/child.png';
import useSeoConfig from '../hooks/useSeoConfig';

const GaurangaVidhyapitha = () => {
    const { seoData, loading } = useSeoConfig();

    const getVal = (dynamic, defaultV) => (dynamic && dynamic.trim() !== '' ? dynamic : defaultV);

    const fallbacks = {
        h1: 'Gauranga Vidhyapitha',
        htmlContent: `<p>Gauranga Vidyapitha is the educational initiative of Gaurangas Group dedicated to teaching Krishna consciousness to children, youth, and families in an engaging and systematic way.</p><p>Inspired by the timeless teachings of Bhagavad Gita, Srimad Bhagavatam, and Srila Prabhupada, this platform serves as a divine school to nurture character, values, and spiritual knowledge.</p>`,
        courses: [
            { title: 'Weekly Bhagwadgeeta Class', description: 'Every Sunday 5 pm we organize weekly live Bhagavad Gita Class.', buttonText: 'Book Your Seat', img: bagavatgitaImg },
            { title: 'Children Courses', description: 'Fun-filled Krishna conscious learning through stories, art, drama, and bhajans for ages 5–15.', buttonText: 'Register Courses', img: childrenClassImg },
            { title: 'Youth Training', description: 'Practical application of Gita, self-discipline, seva spirit, and balanced lifestyle guidance.', buttonText: 'Register Now', img: childImg }
        ]
    };

    return (
        <div className="gauranga-vidhyapitha-page" style={{
            minHeight: '100vh',
            background: '#FFFFFF',
            fontFamily: 'var(--font-primary, sans-serif)',
            color: '#022B3A'
        }}>
            {/* Header / Hero Section */}
            <div style={{
                position: 'relative',
                padding: '4rem 2rem 2rem',
                textAlign: 'center'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                        fontWeight: 700,
                        color: '#022B3A',
                        marginBottom: '1rem'
                    }}>
                        {getVal(seoData?.headings?.h1, fallbacks.h1)}
                    </h1>

                    {/* Render split paragraphs via HTML Content */}
                    <div
                        style={{
                            fontSize: '1.2rem',
                            maxWidth: '800px',
                            margin: '0 auto 4rem',
                            color: '#022B3A',
                            opacity: 0.8,
                            lineHeight: 1.6
                        }}
                        dangerouslySetInnerHTML={{ __html: getVal(seoData?.htmlContent, fallbacks.htmlContent) }}
                    />
                </motion.div>
            </div>

            {/* Content Section */}
            <div className="container" style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 2rem 5rem'
            }}>
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4rem'
                }}>
                    {/* Weekly Bhagwadgeeta Class */}
                    <CourseCard
                        title={getVal(seoData?.headings?.h2, fallbacks.courses[0].title)}
                        image={getVal(seoData?.images?.[0]?.url, fallbacks.courses[0].img)}
                        delay={0.2}
                        description={getVal(seoData?.images?.[0]?.caption, fallbacks.courses[0].description)}
                        buttonText={getVal(seoData?.internalLinks?.[0]?.anchorText, fallbacks.courses[0].buttonText)}
                        targetUrl={getVal(seoData?.internalLinks?.[0]?.targetUrl, '')}
                    />

                    {/* Children Courses */}
                    <CourseCard
                        title={getVal(seoData?.headings?.h3, fallbacks.courses[1].title)}
                        image={getVal(seoData?.images?.[1]?.url, fallbacks.courses[1].img)}
                        delay={0.4}
                        inverse={true}
                        description={getVal(seoData?.images?.[1]?.caption, fallbacks.courses[1].description)}
                        buttonText={getVal(seoData?.internalLinks?.[1]?.anchorText, fallbacks.courses[1].buttonText)}
                        targetUrl={getVal(seoData?.internalLinks?.[1]?.targetUrl, '')}
                    />

                    {/* Youth Training */}
                    <CourseCard
                        title={getVal(seoData?.headings?.h4, fallbacks.courses[2].title)}
                        image={getVal(seoData?.images?.[2]?.url, fallbacks.courses[2].img)}
                        delay={0.6}
                        description={getVal(seoData?.images?.[2]?.caption, fallbacks.courses[2].description)}
                        buttonText={getVal(seoData?.internalLinks?.[2]?.anchorText, fallbacks.courses[2].buttonText)}
                        targetUrl={getVal(seoData?.internalLinks?.[2]?.targetUrl, '')}
                    />
                </div>
            </div>
        </div>
    );
};

const CourseCard = ({ title, image, description, delay, inverse, buttonText, targetUrl }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay }}
            style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fafafa',
                borderRadius: '20px',
                overflow: 'hidden',
            }}
        >
            {inverse ? (
                <>
                    <ContentSide title={title} description={description} buttonText={buttonText} targetUrl={targetUrl} />
                    <ImageSide image={image} title={title} />
                </>
            ) : (
                <>
                    <ImageSide image={image} title={title} />
                    <ContentSide title={title} description={description} buttonText={buttonText} targetUrl={targetUrl} />
                </>
            )}
        </motion.div>
    );
};

const ImageSide = ({ image, title }) => (
    <div style={{
        flex: '1 1 300px',
        minWidth: '250px',
        height: '400px',
        overflow: 'hidden',
    }}>
        <img
            src={image}
            alt={title}
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'fill', // Changed to fill to ensure full image is shown touching all corners
                display: 'block'
            }}
        />
    </div>
);

const ContentSide = ({ title, description, buttonText, targetUrl }) => {
    const whatsappLink = `https://wa.me/917600156255?text=${encodeURIComponent(`Hare Krishna, I would like to register for ${title}.`)}`;
    const finalUrl = targetUrl && targetUrl.trim() !== '' ? targetUrl : whatsappLink;

    return (
        <div style={{
            flex: '1 1 400px',
            padding: '3rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <h2 style={{
                fontSize: '1.8rem',
                color: '#022B3A',
                marginBottom: '1rem',
                fontWeight: 800
            }}>{title}</h2>
            <p style={{
                fontSize: '1.1rem',
                color: '#022B3A',
                opacity: 0.8,
                marginBottom: '2rem',
                lineHeight: 1.6,
                maxWidth: '400px'
            }}>{description}</p>
            <a
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    padding: '0.8rem 2rem',
                    background: 'transparent',
                    border: '1px solid #022B3A',
                    color: '#022B3A',
                    fontSize: '1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    display: 'inline-block'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#022B3A';
                    e.currentTarget.style.color = '#fff';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#022B3A';
                }}
            >
                {buttonText}
            </a>
        </div>
    );
};

export default GaurangaVidhyapitha;
