import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaWhatsapp, FaTrain, FaMapMarkerAlt, FaCalendarAlt, FaUserFriends,
    FaPrayingHands, FaClock, FaUtensils, FaBed, FaExclamationCircle,
    FaCheckCircle, FaTimesCircle, FaInfoCircle, FaRoute, FaUserPlus, FaTimes, FaEnvelope
} from 'react-icons/fa';
import tem2 from '../assets/image/temp2.jpg';
import api from '../lib/api';
// import MultiStepRegistrationForm from '../components/MultiStepRegistrationForm';
import ContactModal from '../components/ContactModal';

const ChaloTirthyatra = () => {
    const [yatras, setYatras] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchYatras = async () => {
            try {
                const response = await api.get('/tirthyatra');
                setYatras(response.data);
            } catch (error) {
                console.error('Error fetching yatras:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchYatras();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900 pb-20">
            {/* Hero Section */}
            <div className="relative bg-teal-900 text-white py-20 px-4 text-center overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative z-10 max-w-4xl mx-auto"
                >
                    <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">Chalo Tirthyatra</h1>
                    <p className="text-lg md:text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
                        Embark on sacred journeys to rediscover your soul in the holy lands of Bharat.
                        Join us for an unforgettable spiritual experience.
                    </p>
                </motion.div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                {loading ? (
                    <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
                        <div className="animate-spin w-12 h-12 border-4 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading Yatra Details...</p>
                    </div>
                ) : (
                    <div className="space-y-12">
                        {yatras.length > 0 ? (
                            yatras.map((yatra, index) => (
                                <YatraCard key={yatra._id} yatra={yatra} index={index} />
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-xl">
                                <p className="text-xl text-gray-500">No upcoming yatras scheduled at the moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const YatraCard = ({ yatra, index }) => {
    const [activeTab, setActiveTab] = useState('overview');
    // const [showRegisterModal, setShowRegisterModal] = useState(false);
    const [showContactModal, setShowContactModal] = useState(false);
    const googleFormLink = "https://docs.google.com/forms/d/e/1FAIpQLSez9_u8mH0Y4vwKzP8mQi1BNzJ5UAjkdMAAuib1bhh2qy_9Rw/viewform";

    // Auto-open modal if there's saved registration data
    /* 
    useEffect(() => {
        const savedData = localStorage.getItem(`yatra_registration_${yatra._id}`);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Only auto-open if there's actual user data (not just initial state)
                if (parsed.primaryContact?.email || parsed.primaryContact?.phone ||
                    (parsed.members?.[0]?.name && parsed.members[0].name !== '')) {
                    setShowRegisterModal(true);
                }
            } catch (e) {
                console.error('Error checking saved data:', e);
            }
        }
    }, [yatra._id]);
    */

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <FaInfoCircle /> },
        { id: 'itinerary', label: 'Itinerary', icon: <FaRoute /> },
        { id: 'travel_stay', label: 'Travel & Stay', icon: <FaTrain /> },
        { id: 'guidelines', label: 'Guidelines', icon: <FaExclamationCircle /> },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100"
        >
            {/* Yatra Header Image With Overlay */}
            <div className="relative w-full group overflow-hidden bg-gray-900 shadow-xl">
                <img
                    src={yatra.image || tem2}
                    alt={yatra.title}
                    className="w-full h-auto object-contain hover:scale-105 transition-transform duration-1000"
                    onError={(e) => { e.target.src = tem2; }}
                />
                {/* Register Button on Image */}
                <motion.a
                    href={googleFormLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="absolute top-4 right-4 md:top-6 md:right-6 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-bold shadow-xl flex items-center gap-2 text-sm md:text-base z-10 cursor-pointer no-underline"
                >
                    <FaUserPlus /> Register Now
                </motion.a>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-4 md:p-10 text-white">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="bg-orange-500 text-white px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold shadow-lg flex items-center gap-2">
                                {yatra.icon} {yatra.travelMode}
                            </span>
                            <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-semibold flex items-center gap-2">
                                <FaCalendarAlt /> {yatra.date}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-5xl font-bold mb-2 text-shadow-lg leading-tight">{yatra.title}</h2>
                        <div className="flex items-start gap-2 text-gray-200 text-xs md:text-base">
                            <FaMapMarkerAlt className="text-orange-400 mt-1" />
                            <span className="line-clamp-2">{yatra.locations}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Multi-Step Registration Modal */}
            {/* 
            <AnimatePresence>
                {showRegisterModal && (
                    <MultiStepRegistrationForm
                        yatra={yatra}
                        onClose={() => setShowRegisterModal(false)}
                    />
                )}
            </AnimatePresence>
            */}

            {/* Contact Modal */}
            <ContactModal
                isOpen={showContactModal}
                onClose={() => setShowContactModal(false)}
            />

            {/* Navigation Tabs */}
            <div className="flex overflow-x-auto border-b border-gray-100 bg-gray-50 px-4 md:px-8 pt-2 scrollbar-hide">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-3 md:px-6 md:py-4 font-semibold text-sm md:text-base transition-all border-b-4 focus:outline-none whitespace-nowrap flex-shrink-0 ${activeTab === tab.id
                            ? 'border-orange-500 text-orange-600 bg-white rounded-t-xl'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                            }`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="p-4 md:p-10 bg-white min-h-[300px] md:min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        {activeTab === 'overview' && <OverviewSection yatra={yatra} />}
                        {activeTab === 'itinerary' && <ItinerarySection itinerary={yatra.itinerary} />}
                        {activeTab === 'travel_stay' && <TravelStaySection yatra={yatra} />}
                        {activeTab === 'guidelines' && <GuidelinesSection instructions={yatra.instructions} />}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Footer / CTA */}
            <div className="bg-gray-50 p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-gray-100">
                <div className="w-full md:w-auto text-center md:text-left">
                    {yatra.ticketPrice && (
                        <div className="text-gray-700">
                            <span className="text-xs md:text-sm uppercase font-bold text-gray-400">Starts From</span>
                            <div className="text-xl md:text-2xl font-bold text-teal-700">{yatra.ticketPrice}</div>
                        </div>
                    )}
                </div>
                <div className="w-full md:w-auto flex flex-col md:flex-row gap-4 justify-center">
                    <a
                        href={googleFormLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 no-underline cursor-pointer"
                    >
                        <FaUserPlus size={20} /> Register Now
                    </a>
                    <WhatsAppButton link={yatra.whatsappLink} />
                    <button
                        onClick={() => setShowContactModal(true)}
                        className="inline-flex items-center justify-center gap-2 bg-white text-teal-700 border-2 border-teal-700 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-teal-50 transition-all transform hover:-translate-y-1"
                    >
                        <FaEnvelope size={20} /> Contact Us
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

/* --- Sub-Components --- */

const getCleanList = (rawList) => {
    if (!rawList || !Array.isArray(rawList)) return [];

    // First, flatten any nested stringified arrays
    const flatList = rawList.flatMap(item => {
        if (typeof item !== 'string') return [item];

        const trimmed = item.trim();
        // Check if it looks like a stringified array ["value", "value2"]
        if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
            try {
                // Attempt clean parse
                const parsed = JSON.parse(trimmed);
                if (Array.isArray(parsed)) return parsed;
            } catch (e) {
                // Attempt loose parse (single quotes -> double quotes)
                try {
                    const loose = JSON.parse(trimmed.replace(/'/g, '"'));
                    if (Array.isArray(loose)) return loose;
                } catch (e2) {
                    // If parse fails, return original item
                }
            }
        }
        return [item];
    });

    // Clean up quotes from the resulting strings and filter empty ones
    return flatList
        .map(str => {
            if (typeof str !== 'string') return '';
            // Remove surrounding quotes if they exist
            return str.replace(/^"|"$/g, '').replace(/^'|'$/g, '').trim();
        })
        .filter(str => str.length > 0);
};

const OverviewSection = ({ yatra }) => {
    const includesList = getCleanList(yatra.includes);
    const excludesList = getCleanList(yatra.excludes);

    return (
        <div className="space-y-6 md:space-y-8">
            {yatra.description && (
                <div className="w-full text-gray-700 leading-relaxed text-sm md:text-base">
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3 flex items-center gap-2">
                        <FaPrayingHands className="text-orange-500" /> About the Yatra
                    </h3>
                    <p className="whitespace-pre-wrap">{yatra.description}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Includes */}
                <div className="bg-green-50 p-4 md:p-6 rounded-2xl border border-green-100">
                    <h4 className="text-base md:text-lg font-bold text-green-800 mb-3 md:mb-4 flex items-center gap-2">
                        <FaCheckCircle /> What's Included
                    </h4>
                    <ul className="space-y-2 md:space-y-3">
                        {includesList.length > 0 ? (
                            includesList.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 md:gap-3 text-gray-700 text-xs md:text-sm">
                                    <span className="mt-0.5 md:mt-1 text-green-500 text-lg">•</span>
                                    {item}
                                </li>
                            ))
                        ) : <span className="text-gray-400 text-sm">No details available.</span>}
                    </ul>
                </div>

                {/* Excludes */}
                <div className="bg-red-50 p-4 md:p-6 rounded-2xl border border-red-100">
                    <h4 className="text-base md:text-lg font-bold text-red-800 mb-3 md:mb-4 flex items-center gap-2">
                        <FaTimesCircle /> What's Excluded
                    </h4>
                    <ul className="space-y-2 md:space-y-3">
                        {excludesList.length > 0 ? (
                            excludesList.map((item, i) => (
                                <li key={i} className="flex items-start gap-2 md:gap-3 text-gray-700 text-xs md:text-sm">
                                    <span className="mt-0.5 md:mt-1 text-red-500 text-lg">•</span>
                                    {item}
                                </li>
                            ))
                        ) : <span className="text-gray-400 text-sm">No details available.</span>}
                    </ul>
                </div>
            </div>
        </div>
    );
};

const ItinerarySection = ({ itinerary }) => (
    <div className="space-y-8">
        {itinerary?.length > 0 ? (
            <div className="relative border-l-2 md:border-l-4 border-teal-100 ml-3 md:ml-6 space-y-8 md:space-y-12">
                {itinerary.map((day, idx) => (
                    <div key={idx} className="relative pl-6 md:pl-12">
                        {/* Day Marker */}
                        <div className="absolute -left-3 md:-left-3.5 top-0 w-6 h-6 md:w-7 md:h-7 bg-teal-600 rounded-full text-white text-xs md:text-sm font-bold flex items-center justify-center shadow-lg border-2 md:border-4 border-white">
                            {day.day}
                        </div>

                        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                            <h4 className="text-lg md:text-xl font-bold text-teal-800 mb-2 flex flex-wrap items-baseline gap-2">
                                Day {day.day} <span className="text-xs md:text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{day.date}</span>
                            </h4>

                            {/* Schedule */}
                            <div className="grid gap-3 mb-4 md:mb-6">
                                {day.schedule?.map((act, i) => (
                                    <div key={i} className="flex flex-col md:flex-row gap-1 md:gap-4 text-sm md:text-base">
                                        <span className="font-bold text-orange-600 min-w-[80px] whitespace-nowrap">{act.time}</span>
                                        <div>
                                            <p className="font-semibold text-gray-800">{act.activity}</p>
                                            {act.description && <p className="text-gray-500 text-xs md:text-sm mt-0.5 whitespace-pre-wrap">{act.description}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Meals */}
                            {(day.meals?.breakfast || day.meals?.lunch || day.meals?.dinner) && (
                                <div className="bg-gray-50 rounded-xl p-3 md:p-4 flex flex-col md:flex-row flex-wrap gap-2 md:gap-8 text-xs md:text-sm border border-gray-100">
                                    {day.meals.breakfast && (
                                        <div className="flex items-center gap-2">
                                            <FaUtensils className="text-orange-400" />
                                            <span className="font-semibold text-gray-700">Breakfast:</span>
                                            <span className="text-gray-600">{day.meals.breakfast}</span>
                                        </div>
                                    )}
                                    {day.meals.lunch && (
                                        <div className="flex items-center gap-2">
                                            <FaUtensils className="text-orange-400" />
                                            <span className="font-semibold text-gray-700">Lunch:</span>
                                            <span className="text-gray-600">{day.meals.lunch}</span>
                                        </div>
                                    )}
                                    {day.meals.dinner && (
                                        <div className="flex items-center gap-2">
                                            <FaUtensils className="text-orange-400" />
                                            <span className="font-semibold text-gray-700">Dinner:</span>
                                            <span className="text-gray-600">{day.meals.dinner}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center text-gray-500 py-10">Itinerary details coming soon.</div>
        )}
    </div>
);

const TravelStaySection = ({ yatra }) => (
    <div className="space-y-8 md:space-y-10">
        {/* Train Info */}
        <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <FaTrain className="text-blue-600" /> Train Information
            </h3>
            {yatra.trainInfo?.length > 0 ? (
                <div className="grid gap-4">
                    {yatra.trainInfo.map((train, i) => (
                        <div key={i} className="flex flex-col md:flex-row md:items-center justify-between bg-blue-50/50 p-4 md:p-5 rounded-xl border border-blue-100 gap-3 md:gap-4">
                            <div>
                                <h4 className="font-bold text-blue-900 text-sm md:text-base">{train.trainName}</h4>
                                <p className="text-xs md:text-sm text-blue-700 font-mono">#{train.trainNumber}</p>
                            </div>
                            {/* <div className="flex flex-wrap gap-2 text-xs md:text-sm">
                                {train.classes?.map((cls, j) => (
                                    <span key={j} className="bg-white border border-blue-200 px-2 py-1 md:px-3 md:py-1.5 rounded-lg text-blue-800 shadow-sm">
                                        <span className="font-bold">{cls.category}</span>
                                        <span className="mx-2 text-gray-300">|</span>
                                        <span className="font-medium">₹{cls.price}</span>
                                    </span>
                                ))}
                            </div> */}
                        </div>
                    ))}
                </div>
            ) : <p className="text-gray-500 italic">No specific train details provided.</p>}
        </div>

        {/* Accommodation Packages */}
        <div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
                <FaBed className="text-indigo-600" /> Accommodation Packages
            </h3>
            {yatra.packages?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {yatra.packages.map((pkg, i) => (
                        <div key={i} className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 hover:border-indigo-300 transition-colors shadow-sm">
                            <h4 className="text-base md:text-lg font-bold text-gray-800 mb-2">{pkg.name}</h4>
                            <p className="text-xs md:text-sm text-gray-500 mb-4 whitespace-pre-wrap">{pkg.description}</p>
                            <div className="space-y-2">
                                {pkg.pricing?.map((price, j) => (
                                    <div key={j} className="flex justify-between items-center text-xs md:text-sm p-2 bg-gray-50 rounded-lg">
                                        <span className="font-medium text-gray-700">{price.type}</span>
                                        <div className="text-right">
                                            <div className="font-bold text-indigo-600">₹{price.perPerson} <span className="text-[10px] md:text-xs font-normal text-gray-500">/ person</span></div>
                                            {price.cost > 0 && <div className="text-[10px] md:text-xs text-gray-400">Total: ₹{price.cost}</div>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            ) : <p className="text-gray-500 italic">Accommodation details coming soon.</p>}
        </div>
    </div>
);

const GuidelinesSection = ({ instructions }) => (
    <div className="bg-orange-50 p-8 rounded-3xl border border-orange-100">
        <h3 className="text-xl font-bold text-orange-800 mb-6 flex items-center gap-2">
            <FaExclamationCircle /> Important Guidelines
        </h3>
        {instructions?.length > 0 ? (
            <ul className="grid gap-4">
                {instructions.map((inst, i) => (
                    <li key={i} className="flex gap-3 text-orange-900/80 leading-relaxed text-sm md:text-base">
                        <span className="font-bold text-orange-500 text-lg">•</span>
                        {inst}
                    </li>
                ))}
            </ul>
        ) : <p className="text-gray-500 italic">No specific guidelines provided.</p>}
    </div>
);

const WhatsAppButton = ({ link }) => (
    <a
        href={link || "https://api.whatsapp.com/send/?phone=919924958709&text&type=phone_number&app_absent=0"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-[#25D366] text-white px-8 py-3 rounded-full font-bold shadow-lg hover:shadow-xl hover:bg-[#20bd5a] transition-all transform hover:-translate-y-1"
    >
        <FaWhatsapp size={22} />
        Join Yatra Now
    </a>
);

export default ChaloTirthyatra;
