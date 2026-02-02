import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import dayjs from 'dayjs';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

// import required modules
import { EffectCards, Autoplay } from 'swiper/modules';

// Import images
import sadhanaReport from '../assets/image/sadhana-report.jpg';
import prabhupada from '../assets/image/prabhpada.jpg';
import bagavatgita from '../assets/image/bagavatgita.png';
import temple from '../assets/image/temple.jpg';
import preaching from '../assets/image/preaching.jpg';
import kartikMonth from '../assets/image/kartik-month-vrindavan-pic.jpg';
import childrenClass from '../assets/image/children-class.jpeg';
import uddhavas from '../assets/image/Uddhava-das.jpg';
import gaurangaVidhyapith from '../assets/image/gauranga-vidhyapith.jpg';

import './Accountability.css';

const Accountability = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        date: null,
        wakeupTime: null,
        chantingRounds: 0,
        bookReading: 0,
        deityPrayer: '',
        lectureBy: [],
        hearingMinutes: 0,
        bedTime: null,
        individualVows: ''
    });

    const [showEmoji, setShowEmoji] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                lectureBy: checked
                    ? [...prev.lectureBy, value]
                    : prev.lectureBy.filter(item => item !== value)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'range' ? parseInt(value) : value
            }));
        }

        // Show emoji animation when hearing minutes change
        if (name === 'hearingMinutes') {
            setShowEmoji(true);
            setTimeout(() => setShowEmoji(false), 2000);
        }
    };

    const handleDateChange = (newValue) => {
        setFormData(prev => ({ ...prev, date: newValue }));
    };

    const handleWakeupTimeChange = (newValue) => {
        setFormData(prev => ({ ...prev, wakeupTime: newValue }));
    };

    const handleBedTimeChange = (newValue) => {
        setFormData(prev => ({ ...prev, bedTime: newValue }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check if user is logged in
        if (!user) {
            setSubmitError('Please log in to submit your accountability report');
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            // Format the data for API
            const payload = {
                date: formData.date ? formData.date.toISOString() : new Date().toISOString(),
                wakeupTime: formData.wakeupTime ? formData.wakeupTime.format('HH:mm') : '',
                chantingRounds: formData.chantingRounds,
                bookReading: formData.bookReading,
                deityPrayer: formData.deityPrayer,
                lectureBy: formData.lectureBy,
                hearingMinutes: formData.hearingMinutes,
                bedTime: formData.bedTime ? formData.bedTime.format('HH:mm') : '',
                individualVows: formData.individualVows
            };

            await api.post('/accountability', payload);

            setSubmitSuccess(true);

            // Reset form
            setFormData({
                date: null,
                wakeupTime: null,
                chantingRounds: 0,
                bookReading: 0,
                deityPrayer: '',
                lectureBy: [],
                hearingMinutes: 0,
                bedTime: null,
                individualVows: ''
            });

            // Hide success message after 5 seconds
            setTimeout(() => {
                setSubmitSuccess(false);
            }, 5000);

        } catch (error) {
            console.error('Error submitting accountability:', error);
            setSubmitError(error.response?.data?.msg || 'Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getEmojiForHearing = (minutes) => {
        if (minutes >= 10 && minutes < 30) {
            return { emoji: '😞', label: 'Need More!', color: 'rgba(255, 107, 107, 0.3)' };
        } else if (minutes >= 30 && minutes < 60) {
            return { emoji: '😐', label: 'Good Progress', color: 'rgba(255, 217, 61, 0.3)' };
        } else if (minutes >= 60) {
            return { emoji: '😊', label: 'Excellent!', color: 'rgba(107, 207, 127, 0.3)' };
        }
        return { emoji: '🎯', label: 'Start Listening', color: 'rgba(168, 218, 220, 0.3)' };
    };

    const emojiData = getEmojiForHearing(formData.hearingMinutes);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="accountability-page">
                <div className="accountability-container">
                    <div className="accountability-layout">
                        {/* Left Section - Swiper */}
                        <div className="accountability-swiper-section">
                            <Swiper
                                effect={'cards'}
                                grabCursor={true}
                                modules={[EffectCards, Autoplay]}
                                autoplay={{
                                    delay: 3000,
                                    disableOnInteraction: false,
                                }}
                                className="mySwiper"
                            >
                                <SwiperSlide>
                                    <img src={sadhanaReport} alt="Sadhana Report" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={prabhupada} alt="Srila Prabhupada" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={bagavatgita} alt="Bhagavad Gita" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={temple} alt="Temple" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={preaching} alt="Preaching" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={kartikMonth} alt="Kartik Month Vrindavan" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={childrenClass} alt="Children Class" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={uddhavas} alt="Uddhava Das" />
                                </SwiperSlide>
                                <SwiperSlide>
                                    <img src={gaurangaVidhyapith} alt="Gauranga Vidhyapith" />
                                </SwiperSlide>
                            </Swiper>
                        </div>

                        {/* Right Section - Form */}
                        <div className="accountability-form-section">
                            {/* Header Section */}
                            <motion.div
                                className="accountability-header"
                                initial={{ opacity: 0, y: -30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                <h1>Sadhna Report</h1>
                                <p>Track your spiritual journey with accountability</p>
                            </motion.div>

                            <motion.form
                                className="accountability-form"
                                onSubmit={handleSubmit}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                            >
                                {/* Date Input */}
                                <div className="form-group">
                                    <label htmlFor="date">Date <span className="required">*</span></label>
                                    <DatePicker
                                        value={formData.date}
                                        onChange={handleDateChange}
                                        format="DD-MM-YYYY"
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                            }
                                        }}
                                    />
                                </div>

                                {/* Wakeup Time */}
                                <div className="form-group">
                                    <label htmlFor="wakeupTime">Wakeup Time <span className="required">*</span></label>
                                    <TimePicker
                                        value={formData.wakeupTime}
                                        onChange={handleWakeupTimeChange}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                            }
                                        }}
                                    />
                                </div>

                                {/* Chanting Rounds Slider */}
                                <div className="form-group slider-group">
                                    <label htmlFor="chantingRounds">Chanting Rounds</label>
                                    <input
                                        type="range"
                                        id="chantingRounds"
                                        name="chantingRounds"
                                        min="0"
                                        max="100"
                                        value={formData.chantingRounds}
                                        onChange={handleInputChange}
                                        className="slider"
                                    />
                                    <span className="slider-value">Selected Value: {formData.chantingRounds}</span>
                                </div>

                                {/* Book Reading Slider */}
                                <div className="form-group slider-group">
                                    <label htmlFor="bookReading">Book Reading (in Minutes)</label>
                                    <input
                                        type="range"
                                        id="bookReading"
                                        name="bookReading"
                                        min="0"
                                        max="180"
                                        value={formData.bookReading}
                                        onChange={handleInputChange}
                                        className="slider"
                                    />
                                    <span className="slider-value">Selected Value: {formData.bookReading}</span>
                                </div>

                                {/* Deity Prayer Radio */}
                                <div className="form-group">
                                    <label>Deity Prayer</label>
                                    <div className="radio-group">
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="deityPrayer"
                                                value="Yes"
                                                checked={formData.deityPrayer === 'Yes'}
                                                onChange={handleInputChange}
                                            />
                                            <span className='ml-4'>Yes</span>
                                        </label>
                                        <label className="radio-label">
                                            <input
                                                type="radio"
                                                name="deityPrayer"
                                                value="No"
                                                checked={formData.deityPrayer === 'No'}
                                                onChange={handleInputChange}
                                            />
                                            <span className='ml-4'>No</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Lecture Checkboxes */}
                                <div className="form-group">
                                    <label>Whose Lecture You Hear ? <span className="required">*</span></label>
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="lectureBy"
                                                value="Srila Prabhupada"
                                                checked={formData.lectureBy.includes('Srila Prabhupada')}
                                                onChange={handleInputChange}
                                            />
                                            <span className='ml-4'>Srila Prabhupada</span>
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="lectureBy"
                                                value="Guru Maharaj"
                                                checked={formData.lectureBy.includes('Guru Maharaj')}
                                                onChange={handleInputChange}
                                            />
                                            <span className='ml-4'>Guru Maharaj</span>
                                        </label>
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                name="lectureBy"
                                                value="Others"
                                                checked={formData.lectureBy.includes('Others')}
                                                onChange={handleInputChange}
                                            />
                                            <span className='ml-4'>Others</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Hearing Minutes with Emoji Feedback */}
                                <div className="form-group slider-group hearing-section">
                                    <label htmlFor="hearingMinutes">Hearing (Minutes)</label>
                                    <div className="hearing-slider-container">
                                        <input
                                            type="range"
                                            id="hearingMinutes"
                                            name="hearingMinutes"
                                            min="0"
                                            max="120"
                                            value={formData.hearingMinutes}
                                            onChange={handleInputChange}
                                            className="slider hearing-slider"
                                            style={{
                                                background: `linear-gradient(to right, ${emojiData.color} 0%, ${emojiData.color} ${(formData.hearingMinutes / 120) * 100}%, #E1E5F2 ${(formData.hearingMinutes / 120) * 100}%, #E1E5F2 100%)`
                                            }}
                                        />
                                        <span className="slider-value">Selected Value: {formData.hearingMinutes}</span>
                                    </div>

                                    {/* Animated Emoji Display */}
                                    <AnimatePresence mode="wait">
                                        {formData.hearingMinutes > 0 && (
                                            <motion.div
                                                className="emoji-feedback"
                                                key={emojiData.emoji}
                                                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                                                animate={{
                                                    scale: showEmoji ? [1, 1.3, 1] : 1,
                                                    rotate: 0,
                                                    opacity: 1
                                                }}
                                                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                                                transition={{
                                                    duration: 0.5,
                                                    type: "spring",
                                                    stiffness: 260,
                                                    damping: 20
                                                }}
                                                style={{ borderColor: emojiData.color }}
                                            >
                                                <motion.div
                                                    className="emoji-icon"
                                                    animate={showEmoji ? {
                                                        rotate: [0, -10, 10, -10, 0],
                                                        y: [0, -10, 0]
                                                    } : {}}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    {emojiData.emoji}
                                                </motion.div>
                                                <motion.p
                                                    className="emoji-label"
                                                    style={{ color: emojiData.color.replace('0.3', '1') }}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2 }}
                                                >
                                                    {emojiData.label}
                                                </motion.p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Bed Time */}
                                <div className="form-group">
                                    <label htmlFor="bedTime">Bed Time <span className="required">*</span></label>
                                    <TimePicker
                                        value={formData.bedTime}
                                        onChange={handleBedTimeChange}
                                        slotProps={{
                                            textField: {
                                                fullWidth: true,
                                                required: true,
                                            }
                                        }}
                                    />
                                </div>

                                {/* Individual Vows Textarea */}
                                <div className="form-group">
                                    <label htmlFor="individualVows">Your Individual Vows (Additional)</label>
                                    <textarea
                                        id="individualVows"
                                        name="individualVows"
                                        rows="5"
                                        value={formData.individualVows}
                                        onChange={handleInputChange}
                                        placeholder="Share your personal spiritual commitments..."
                                    />
                                </div>

                                {/* Submit Messages */}
                                {submitError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl"
                                    >
                                        {submitError}
                                    </motion.div>
                                )}

                                {submitSuccess && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl"
                                    >
                                        ✅ Sadhana report submitted successfully! Hare Krishna!
                                    </motion.div>
                                )}

                                {/* Submit Button */}
                                <motion.button
                                    type="submit"
                                    disabled={isSubmitting || !user}
                                    className={`submit-btn ${isSubmitting || !user ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    whileHover={!isSubmitting && user ? { scale: 1.02, boxShadow: "0 8px 24px rgba(31, 122, 140, 0.3)" } : {}}
                                    whileTap={!isSubmitting && user ? { scale: 0.98 } : {}}
                                    transition={{ duration: 0.2 }}
                                >
                                    {isSubmitting ? 'Submitting...' : !user ? 'Please Login to Submit' : 'Submit'}
                                </motion.button>
                            </motion.form>
                        </div>
                    </div>
                </div>
            </div>
        </LocalizationProvider>
    );
};

export default Accountability;

