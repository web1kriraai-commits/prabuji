import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTimes, FaCheckCircle, FaChevronLeft, FaChevronRight, FaChevronDown,
    FaUser, FaUsers, FaIdCard, FaBed, FaTrain, FaCreditCard,
    FaComment, FaUpload, FaTrash, FaPlus, FaLongArrowAltRight
} from 'react-icons/fa';
import api from '../lib/api';

const STEPS = [
    { id: 1, title: 'Yatra Info', icon: <FaUser /> },
    { id: 2, title: 'Members', icon: <FaUsers /> },
    { id: 3, title: 'Documents', icon: <FaIdCard /> },
    { id: 4, title: 'Accommodation', icon: <FaBed /> },
    { id: 5, title: 'Train', icon: <FaTrain /> },
    { id: 6, title: 'Packages', icon: <FaBed /> },
    { id: 7, title: 'Payment', icon: <FaCreditCard /> },
    { id: 8, title: 'Complete', icon: <FaComment /> }
];

const MultiStepRegistrationForm = ({ yatra, onClose }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [submitting, setSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const isInitialLoad = useRef(true);

    // Handle closing the form (clears saved data)
    const handleClose = () => {
        // Clear localStorage when user manually closes the form
        localStorage.removeItem(`yatra_registration_${yatra._id}`);
        onClose();
    };

    // Form Data
    const [primaryContact, setPrimaryContact] = useState({
        email: '',
        phone: ''
    });

    const [members, setMembers] = useState([{
        name: '',
        age: '',
        gender: 'Male',
        mobileNumber: '',
        city: '',
        aadhaarFile: null
    }]);

    const [accommodation, setAccommodation] = useState({
        sameRoom: true,
        wantTrain: true,
        notes: ''
    });

    const [selectedTrain, setSelectedTrain] = useState(null); // { ...train, selectedClass: { category, price } }
    const [selectedPackage, setSelectedPackage] = useState(null); // { ...pkg, selectedPricing: { type, perPerson, cost } }
    const [selectedCustomPackages, setSelectedCustomPackages] = useState([]); // [{ name, price }]
    const [paymentScreenshot, setPaymentScreenshot] = useState(null);
    const [openDropdown, setOpenDropdown] = useState(null); // 'boarding' or 'alighting'

    const [suggestions, setSuggestions] = useState('');
    const [validationError, setValidationError] = useState('');

    // Validation Helpers
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPhone = (phone) => {
        return /^\d{10}$/.test(phone);
    };

    const isValidAge = (age) => {
        const num = parseInt(age);
        return !isNaN(num) && num > 0 && num <= 120;
    };
    useEffect(() => {
        const storageKey = `yatra_registration_${yatra._id}`;
        const savedData = localStorage.getItem(storageKey);

        console.log('Loading from localStorage:', storageKey);
        console.log('Saved data:', savedData);

        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                console.log('Parsed data:', parsed);

                // Mark initial load as complete BEFORE updating state
                // This prevents the save effect from running during restoration
                isInitialLoad.current = false;

                // Restore all fields - check for undefined instead of truthiness to allow falsy values
                if (parsed.currentStep !== undefined) {
                    console.log('Restoring currentStep:', parsed.currentStep);
                    setCurrentStep(parsed.currentStep);
                }
                if (parsed.primaryContact !== undefined) {
                    console.log('Restoring primaryContact:', parsed.primaryContact);
                    setPrimaryContact(parsed.primaryContact);
                }
                if (parsed.members !== undefined && Array.isArray(parsed.members)) {
                    console.log('Restoring members:', parsed.members);
                    // Members need special handling because aadhaarFile is not serializable
                    const restoredMembers = parsed.members.map(m => ({
                        ...m,
                        aadhaarFile: null // Files cannot be restored
                    }));
                    setMembers(restoredMembers);
                }
                if (parsed.accommodation !== undefined) {
                    console.log('Restoring accommodation:', parsed.accommodation);
                    setAccommodation(parsed.accommodation);
                }
                if (parsed.selectedTrain !== undefined) {
                    console.log('Restoring selectedTrain:', parsed.selectedTrain);
                    setSelectedTrain(parsed.selectedTrain);
                }
                if (parsed.selectedPackage !== undefined) {
                    console.log('Restoring selectedPackage:', parsed.selectedPackage);
                    setSelectedPackage(parsed.selectedPackage);
                }
                if (parsed.selectedCustomPackages !== undefined) {
                    console.log('Restoring selectedCustomPackages:', parsed.selectedCustomPackages);
                    setSelectedCustomPackages(parsed.selectedCustomPackages);
                }
                if (parsed.suggestions !== undefined) {
                    console.log('Restoring suggestions:', parsed.suggestions);
                    setSuggestions(parsed.suggestions);
                }

                console.log('Data restoration complete');
            } catch (e) {
                console.error("Failed to load saved registration data", e);
                isInitialLoad.current = false;
            }
        } else {
            console.log('No saved data found');
            isInitialLoad.current = false;
        }
    }, [yatra._id]);

    // Save to localStorage on change (but not during initial load)
    useEffect(() => {
        // Skip saving during the initial load to prevent overwriting restored data
        if (isInitialLoad.current) {
            return;
        }

        // Don't save if data is in initial/empty state (prevents overwriting during React Strict Mode double-mount)
        const isEmptyState = (
            currentStep === 1 &&
            primaryContact.email === '' &&
            primaryContact.phone === '' &&
            members.length === 1 &&
            members[0].name === '' &&
            members[0].age === '' &&
            members[0].mobileNumber === '' &&
            members[0].city === ''
        );

        // Only save if we have actual data to preserve
        if (isEmptyState) {
            console.log('Skipping save - data is in initial empty state');
            return;
        }

        const dataToSave = {
            currentStep,
            primaryContact,
            members: members.map(m => ({ ...m, aadhaarFile: null })), // Don't try to save files
            accommodation,
            selectedTrain,
            selectedPackage,
            selectedCustomPackages,
            suggestions
        };
        console.log('Saving to localStorage:', dataToSave);
        localStorage.setItem(`yatra_registration_${yatra._id}`, JSON.stringify(dataToSave));
    }, [currentStep, primaryContact, members, accommodation, selectedTrain, selectedPackage, suggestions, yatra._id]);

    // Parse train info from yatra
    const trainInfo = (() => {
        try {
            const parsed = typeof yatra.trainInfo === 'string'
                ? JSON.parse(yatra.trainInfo)
                : yatra.trainInfo || [];
            // Ensure parsed is an array
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    })();

    const packages = yatra.packages || [];

    // Calculate total amount
    const calculateTotal = () => {
        let total = 0;
        const memberCount = members.length;

        // Add Package Cost
        if (selectedPackage && selectedPackage.selectedPricing) {
            // Check if perPerson price exists, otherwise fallback
            const price = parseFloat(selectedPackage.selectedPricing.perPerson || selectedPackage.selectedPricing.cost || 0);
            total += price * memberCount;
        } else if (selectedPackage && selectedPackage.pricePerPerson) {
            // Fallback for simple structure
            total += parseFloat(selectedPackage.pricePerPerson) * memberCount;
        }

        // Add Train Cost
        if (selectedTrain && selectedTrain.selectedClass) {
            const price = parseFloat(selectedTrain.selectedClass.price || 0);
            total += price * memberCount;
        }

        // Add Custom Packages Cost
        if (selectedCustomPackages && selectedCustomPackages.length > 0) {
            selectedCustomPackages.forEach(pkg => {
                total += (parseFloat(pkg.price) || 0) * memberCount;
            });
        }

        return total;
    };

    // Add/Remove Members
    const addMember = () => {
        setMembers([...members, {
            name: '',
            age: '',
            gender: 'Male',
            mobileNumber: '',
            city: '',
            aadhaarFile: null
        }]);
    };

    const removeMember = (index) => {
        if (members.length > 1) {
            setMembers(members.filter((_, i) => i !== index));
        }
    };

    const updateMember = (index, field, value) => {
        const updated = [...members];
        updated[index][field] = value;
        setMembers(updated);
    };

    const handleAadhaarUpload = (index, file) => {
        updateMember(index, 'aadhaarFile', file);
    };

    // Validation
    const validateStep = () => {
        setValidationError(''); // Clear previous errors

        switch (currentStep) {
            case 1:
                return true; // Info step - just display
            case 2:
                // Validate Primary Contact
                if (!isValidEmail(primaryContact.email)) {
                    setValidationError('Please enter a valid email address.');
                    return false;
                }
                if (!isValidPhone(primaryContact.phone)) {
                    setValidationError('Please enter a valid 10-digit phone number.');
                    return false;
                }

                // Validate Members
                for (let i = 0; i < members.length; i++) {
                    const m = members[i];
                    if (!m.name.trim()) {
                        setValidationError(`Please enter a name for Member ${i + 1}.`);
                        return false;
                    }
                    if (!isValidAge(m.age)) {
                        setValidationError(`Please enter a valid age (1-120) for Member ${i + 1}.`);
                        return false;
                    }
                    if (!m.gender) {
                        setValidationError(`Please select a gender for Member ${i + 1}.`);
                        return false;
                    }
                    // Optional mobile validation for members
                    if (m.mobileNumber && !isValidPhone(m.mobileNumber)) {
                        setValidationError(`Please enter a valid 10-digit mobile number for Member ${i + 1}.`);
                        return false;
                    }
                }
                return true;

            case 3:
                // Documents (Aadhaar) - MANDATORY for all
                for (let i = 0; i < members.length; i++) {
                    if (!members[i].aadhaarFile) {
                        setValidationError(`Please upload Aadhaar card for ${members[i].name || `Member ${i + 1}`}.`);
                        return false;
                    }
                }
                return true;

            case 4:
                return true; // Accommodation has default
            case 5:
                return true; // Train optional
            case 6:
                return true; // Packages optional
            case 7:
                // Payment - MANDATORY screenshot
                if (!paymentScreenshot) {
                    setValidationError('Please upload the payment screenshot to proceed.');
                    return false;
                }
                return true;
            case 8:
                return true;
            default:
                return true;
        }
    };

    const nextStep = () => {
        if (validateStep() && currentStep < STEPS.length) {
            // Logic to skip Train step if user doesn't want train
            if (currentStep === 4 && !accommodation.wantTrain) {
                setCurrentStep(6); // Skip step 5 (Train) and go to 6 (Packages)
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            // Logic to skip Train step when going back from Packages
            if (currentStep === 6 && !accommodation.wantTrain) {
                setCurrentStep(4); // Skip step 5 (Train) and go back to 4 (Accommodation)
            } else {
                setCurrentStep(currentStep - 1);
            }
        }
    };

    // Submit form
    const handleSubmit = async () => {
        setSubmitting(true);
        setSubmitError('');

        try {
            const formData = new FormData();
            formData.append('yatraId', yatra._id);
            formData.append('yatraTitle', yatra.title);
            formData.append('primaryEmail', primaryContact.email);
            formData.append('primaryPhone', primaryContact.phone);
            formData.append('members', JSON.stringify(members.map(m => ({
                name: m.name,
                age: parseInt(m.age) || 0,
                gender: m.gender,
                mobileNumber: m.mobileNumber,
                city: m.city
            }))));
            formData.append('sameRoomPreference', accommodation.sameRoom);
            formData.append('accommodationNotes', accommodation.notes);

            if (selectedTrain) {
                // Flatten structure for saving
                const trainToSave = {
                    trainName: selectedTrain.trainName,
                    trainNumber: selectedTrain.trainNumber,
                    classCategory: selectedTrain.selectedClass?.category,
                    price: selectedTrain.selectedClass?.price,
                    boardingStation: selectedTrain.boardingStation || '',
                    alightingStation: selectedTrain.alightingStation || ''
                };
                formData.append('selectedTrain', JSON.stringify(trainToSave));
            }

            if (selectedPackage) {
                // Flatten structure for saving
                const pkgToSave = {
                    packageName: selectedPackage.packageName,
                    description: selectedPackage.description,
                    pricingType: selectedPackage.selectedPricing?.type,
                    pricePerPerson: selectedPackage.selectedPricing?.perPerson || selectedPackage.selectedPricing?.cost,
                    totalCost: calculateTotal() // Or just package component
                };
                formData.append('selectedPackage', JSON.stringify(pkgToSave));
            }

            if (selectedCustomPackages && selectedCustomPackages.length > 0) {
                formData.append('selectedCustomPackages', JSON.stringify(selectedCustomPackages));
            }

            formData.append('totalAmount', calculateTotal());
            // Add advance payment info if applicable
            const percentage = parseFloat(yatra.advancePaymentPercentage);
            if (!isNaN(percentage) && percentage > 0 && percentage < 100) {
                const total = calculateTotal();
                const advanceAmount = Math.round((total * percentage) / 100);
                formData.append('advancedPaymentAmount', advanceAmount);
                formData.append('isAdvancePayment', 'true');
            } else {
                formData.append('isAdvancePayment', 'false');
            }

            formData.append('suggestions', suggestions);

            // Upload files
            if (paymentScreenshot) {
                formData.append('paymentScreenshot', paymentScreenshot);
            }

            // Append Aadhaar files individually with same field name to create array on server
            members.forEach((member) => {
                if (member.aadhaarFile) {
                    formData.append('aadhaarCards', member.aadhaarFile);
                }
            });

            await api.post('/yatra-registration', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setSubmitSuccess(true);
            localStorage.removeItem(`yatra_registration_${yatra._id}`);
        } catch (error) {
            console.error('Registration error:', error);
            setSubmitError(error.response?.data?.msg || 'Failed to submit registration. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    // QR Code image (you can replace this with the actual QR from yatra data)
    const qrCodeImage = '/api/placeholder/300/300'; // Placeholder - replace with actual QR

    // Render step content
    const renderStepContent = () => {
        switch (currentStep) {
            case 1: // Yatra Info
                return (
                    <div className="space-y-6">
                        <div className="relative h-64 rounded-2xl overflow-hidden">
                            <img
                                src={yatra.image}
                                alt={yatra.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                                <div className="text-white">
                                    <h3 className="text-xl font-bold">{yatra.title}</h3>
                                    <p className="text-sm opacity-90">{yatra.date}</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-teal-50 rounded-xl p-4">
                            <h4 className="font-semibold text-teal-800 mb-2">Journey Details</h4>
                            <p className="text-sm text-gray-600 mb-1"><strong>Locations:</strong> {yatra.locations}</p>
                            <p className="text-sm text-gray-600 mb-1"><strong>Duration:</strong> {yatra.duration}</p>
                            {yatra.ticketPrice && (
                                <p className="text-sm text-gray-600"><strong>Starting From:</strong> {yatra.ticketPrice}</p>
                            )}
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                            <p className="text-sm text-orange-800">
                                <strong>Note:</strong> Please provide accurate details for all members traveling. This information will be used for ticket booking and accommodation.
                            </p>
                        </div>
                    </div>
                );

            case 2: // Members Information
                return (
                    <div className="space-y-6">
                        {/* Primary Contact */}
                        <div className="bg-gray-50 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-800 mb-3">Primary Contact Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={primaryContact.email}
                                        onChange={(e) => setPrimaryContact({ ...primaryContact, email: e.target.value })}
                                        placeholder="your@email.com"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                                    <input
                                        type="tel"
                                        value={primaryContact.phone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val.length <= 10) {
                                                setPrimaryContact({ ...primaryContact, phone: val });
                                            }
                                        }}
                                        maxLength={10}
                                        placeholder="9876543210"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Members */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="font-semibold text-gray-800">Members ({members.length})</h4>
                                <button
                                    type="button"
                                    onClick={addMember}
                                    className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700 font-medium"
                                >
                                    <FaPlus size={12} /> Add Member
                                </button>
                            </div>

                            <div className="space-y-4">
                                {members.map((member, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-white border border-gray-200 rounded-xl p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <span className="text-sm font-semibold text-gray-600">
                                                Member {index + 1}
                                            </span>
                                            {members.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeMember(index)}
                                                    className="text-red-500 hover:text-red-600"
                                                >
                                                    <FaTrash size={14} />
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2">
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                                <input
                                                    type="text"
                                                    value={member.name}
                                                    onChange={(e) => updateMember(index, 'name', e.target.value)}
                                                    placeholder="Enter full name"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                                                <input
                                                    type="number"
                                                    value={member.age}
                                                    onChange={(e) => updateMember(index, 'age', e.target.value)}
                                                    placeholder="Age"
                                                    min="1"
                                                    max="120"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                                                <select
                                                    value={member.gender}
                                                    onChange={(e) => updateMember(index, 'gender', e.target.value)}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                                >
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                                                <input
                                                    type="tel"
                                                    value={member.mobileNumber}
                                                    onChange={(e) => {
                                                        const val = e.target.value;
                                                        if (val.length <= 10) {
                                                            updateMember(index, 'mobileNumber', val);
                                                        }
                                                    }}
                                                    maxLength={10}
                                                    placeholder="9876543210"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                                                <input
                                                    type="text"
                                                    value={member.city}
                                                    onChange={(e) => updateMember(index, 'city', e.target.value)}
                                                    placeholder="Your city"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 3: // Documents (Aadhaar)
                return (
                    <div className="space-y-6">
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                            <h4 className="font-semibold text-amber-800 mb-2">Aadhaar Card Upload</h4>
                            <p className="text-sm text-amber-700">
                                Please upload Aadhaar card for all members traveling. This is required for booking.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {members.map((member, index) => (
                                <div key={index} className="bg-white border border-gray-200 rounded-xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-medium text-gray-800">
                                            {member.name || `Member ${index + 1}`}
                                        </span>
                                        {member.aadhaarFile && (
                                            <span className="text-xs text-green-600 flex items-center gap-1">
                                                <FaCheckCircle /> Uploaded
                                            </span>
                                        )}
                                    </div>

                                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all">
                                        <div className="flex flex-col items-center justify-center">
                                            <FaUpload className="text-gray-400 mb-1" />
                                            <span className="text-sm text-gray-500">
                                                {member.aadhaarFile ? member.aadhaarFile.name : 'Click to upload Aadhaar'}
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*,.pdf"
                                            onChange={(e) => handleAadhaarUpload(index, e.target.files[0])}
                                        />
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 4: // Accommodation
                return (
                    <div className="space-y-6">
                        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                            <h4 className="font-semibold text-purple-800 mb-2">Accommodation Preferences</h4>
                            <p className="text-sm text-purple-700">
                                Let us know your room preferences for the journey.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div className="bg-white border border-gray-200 rounded-xl p-4">
                                <label className="font-medium text-gray-800 block mb-3">
                                    Would you like your family to be in the same room?
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="sameRoom"
                                            checked={accommodation.sameRoom === true}
                                            onChange={() => setAccommodation({ ...accommodation, sameRoom: true })}
                                            className="w-4 h-4 text-teal-600"
                                        />
                                        <div>
                                            <span className="font-medium text-gray-800">Yes</span>
                                            <p className="text-xs text-gray-500">
                                                (If not possible, there will be additional charges to make it possible)
                                            </p>
                                        </div>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                                        <input
                                            type="radio"
                                            name="sameRoom"
                                            checked={accommodation.sameRoom === false}
                                            onChange={() => setAccommodation({ ...accommodation, sameRoom: false })}
                                            className="w-4 h-4 text-teal-600"
                                        />
                                        <span className="font-medium text-gray-800">No (it's OK)</span>
                                    </label>
                                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                                        <label className="font-medium text-gray-800 block mb-3">
                                            Would you like us to book train tickets for you?
                                        </label>
                                        <div className="space-y-2">
                                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="wantTrain"
                                                    checked={accommodation.wantTrain === true}
                                                    onChange={() => {
                                                        setAccommodation({ ...accommodation, wantTrain: true });
                                                        // Reset selected train if they switch back and forth? Maybe not needed, just hide it.
                                                    }}
                                                    className="w-4 h-4 text-teal-600"
                                                />
                                                <span className="font-medium text-gray-800">Yes, please</span>
                                            </label>
                                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
                                                <input
                                                    type="radio"
                                                    name="wantTrain"
                                                    checked={accommodation.wantTrain === false}
                                                    onChange={() => {
                                                        setAccommodation({ ...accommodation, wantTrain: false });
                                                        setSelectedTrain(null); // Clear selection if they say no
                                                    }}
                                                    className="w-4 h-4 text-teal-600"
                                                />
                                                <span className="font-medium text-gray-800">No, I'll book my own</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Additional Notes (Optional)
                                </label>
                                <textarea
                                    value={accommodation.notes}
                                    onChange={(e) => setAccommodation({ ...accommodation, notes: e.target.value })}
                                    placeholder="Any special accommodation requests..."
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none resize-none"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 5: // Train Selection
                const getPriceDisplay = (train, category) => {
                    // 1. If Boarding & Alighting are selected, show specific route price
                    if (selectedTrain?.trainName === train.trainName && selectedTrain?.boardingStation && selectedTrain?.alightingStation && selectedTrain?.routes) {
                        const route = selectedTrain.routes.find(r =>
                            r.from === selectedTrain.boardingStation &&
                            r.to === selectedTrain.alightingStation
                        );
                        if (route) {
                            const routeClass = route.classes.find(c => c.category === category);
                            if (routeClass) {
                                return `₹${routeClass.price}`;
                            }
                        }
                    }

                    // 2. If routes exist, show range or "Starts from"
                    if (train.routes && train.routes.length > 0) {
                        const prices = [];
                        train.routes.forEach(route => {
                            const routeClass = route.classes.find(c => c.category === category);
                            if (routeClass) prices.push(routeClass.price);
                        });

                        if (prices.length > 0) {
                            const minPrice = Math.min(...prices);
                            const maxPrice = Math.max(...prices);
                            if (minPrice !== maxPrice) {
                                return `₹${minPrice} - ₹${maxPrice}`;
                            }
                            return `₹${minPrice}`;
                        }
                    }

                    // 3. Fallback to base price
                    return 'N/A';
                };

                return (
                    <div className="space-y-6">
                        {/* Train Selection - Only shown if Step 5 is active (implied by case 5) */}
                        <div>
                            <h4 className="font-semibold text-gray-800 text-lg mb-4">Train Selection</h4>
                            {trainInfo && trainInfo.length > 0 ? (
                                <div className="space-y-6">
                                    {trainInfo.map((train, tIndex) => (
                                        <div key={tIndex} className="border-2 border-gray-100 rounded-xl p-4 bg-white shadow-sm">
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <h5 className="font-bold text-gray-900 text-xl">{train.trainName || `Train ${tIndex + 1}`}</h5>
                                                    {train.trainNumber && (
                                                        <p className="text-sm text-gray-500">Train #{train.trainNumber}</p>
                                                    )}
                                                </div>
                                            </div>

                                            {(train.from || train.to) && (
                                                <div className="inline-flex items-center gap-2 text-sm text-gray-600 mb-3 bg-gray-50 p-2 rounded-lg">
                                                    <span className="font-medium text-gray-800">{train.from || 'Origin'}</span>
                                                    <FaLongArrowAltRight className="text-gray-400" />
                                                    <span className="font-medium text-gray-800">{train.to || 'Destination'}</span>
                                                </div>
                                            )}

                                            {/* Select Train Button */}
                                            <label className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${selectedTrain?.trainName === train.trainName ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                <input
                                                    type="radio"
                                                    name="train-selection"
                                                    checked={selectedTrain?.trainName === train.trainName}
                                                    onChange={() => {
                                                        setSelectedTrain({
                                                            ...train,
                                                            selectedClass: null,
                                                            boardingStation: '',
                                                            alightingStation: ''
                                                        });
                                                    }}
                                                    className="w-5 h-5 text-teal-600 mr-3"
                                                />
                                                <span className="font-semibold text-gray-800">Select this Train</span>
                                            </label>

                                            {/* Route & Class Selection - Show only if this train is selected */}
                                            {selectedTrain?.trainName === train.trainName && (
                                                <div className="mt-4 pt-4 border-t border-gray-100 space-y-4">

                                                    {/* Station Selection */}
                                                    <div>
                                                        <h5 className="font-semibold text-gray-800 mb-2 text-sm flex items-center gap-2">
                                                            <FaTrain className="text-teal-600" /> Select Route
                                                        </h5>
                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">From</label>
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() => setOpenDropdown(openDropdown === 'boarding' ? null : 'boarding')}
                                                                        className="w-full pl-4 pr-10 py-3 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-teal-500 bg-gray-50/50 hover:bg-white transition-all text-left flex items-center justify-between"
                                                                    >
                                                                        <span className={!selectedTrain.boardingStation ? 'text-gray-800' : 'text-gray-900'}>
                                                                            {selectedTrain.boardingStation || 'Select Boarding Station'}
                                                                        </span>
                                                                        <FaChevronDown size={14} className={`text-teal-600 transition-transform ${openDropdown === 'boarding' ? 'rotate-180' : ''}`} />
                                                                    </button>

                                                                    <AnimatePresence>
                                                                        {openDropdown === 'boarding' && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: -10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                exit={{ opacity: 0, y: -10 }}
                                                                                className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                                                                            >
                                                                                {[...new Set((train.routes || []).map(r => r.from))].map((station, idx) => (
                                                                                    <div
                                                                                        key={idx}
                                                                                        onClick={() => {
                                                                                            setSelectedTrain({
                                                                                                ...selectedTrain,
                                                                                                boardingStation: station,
                                                                                                alightingStation: '',
                                                                                                selectedClass: null
                                                                                            });
                                                                                            setOpenDropdown(null);
                                                                                        }}
                                                                                        className="px-4 py-3 hover:bg-teal-50 text-sm text-gray-900 font-medium cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                                                                    >
                                                                                        {station}
                                                                                    </div>
                                                                                ))}
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-medium text-gray-500 mb-1">To</label>
                                                                <div className="relative">
                                                                    <button
                                                                        onClick={() => !(!selectedTrain.boardingStation) && setOpenDropdown(openDropdown === 'alighting' ? null : 'alighting')}
                                                                        disabled={!selectedTrain.boardingStation}
                                                                        className={`w-full pl-4 pr-10 py-3 border-2 border-gray-100 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:border-teal-500 bg-gray-50/50 hover:bg-white transition-all text-left flex items-center justify-between ${!selectedTrain.boardingStation ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}
                                                                    >
                                                                        <span className={!selectedTrain.alightingStation ? 'text-gray-800' : 'text-gray-900'}>
                                                                            {selectedTrain.alightingStation || 'Select Alighting Station'}
                                                                        </span>
                                                                        <FaChevronDown size={14} className={`text-teal-600 transition-transform ${openDropdown === 'alighting' ? 'rotate-180' : ''}`} />
                                                                    </button>

                                                                    <AnimatePresence>
                                                                        {openDropdown === 'alighting' && (
                                                                            <motion.div
                                                                                initial={{ opacity: 0, y: -10 }}
                                                                                animate={{ opacity: 1, y: 0 }}
                                                                                exit={{ opacity: 0, y: -10 }}
                                                                                className="absolute z-10 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-xl max-h-60 overflow-y-auto"
                                                                            >
                                                                                {(train.routes || [])
                                                                                    .filter(r => r.from === selectedTrain.boardingStation)
                                                                                    .map((r, idx) => (
                                                                                        <div
                                                                                            key={idx}
                                                                                            onClick={() => {
                                                                                                setSelectedTrain({
                                                                                                    ...selectedTrain,
                                                                                                    alightingStation: r.to,
                                                                                                    selectedClass: null
                                                                                                });
                                                                                                setOpenDropdown(null);
                                                                                            }}
                                                                                            className="px-4 py-3 hover:bg-teal-50 text-sm text-gray-900 font-medium cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                                                                                        >
                                                                                            {r.to}
                                                                                        </div>
                                                                                    ))}
                                                                            </motion.div>
                                                                        )}
                                                                    </AnimatePresence>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Class Selection - Show only after route is valid */}
                                                    {selectedTrain.boardingStation && selectedTrain.alightingStation && (() => {
                                                        const route = (train.routes || []).find(r =>
                                                            r.from === selectedTrain.boardingStation &&
                                                            r.to === selectedTrain.alightingStation
                                                        );

                                                        if (!route) return <p className="text-sm text-red-500">Route not available.</p>;

                                                        return (
                                                            <div>
                                                                <h5 className="font-semibold text-gray-800 mb-2 text-sm">Select Class</h5>
                                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                    {route.classes.map((cls, idx) => (
                                                                        <label
                                                                            key={idx}
                                                                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedTrain.selectedClass?.category === cls.category
                                                                                ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500'
                                                                                : 'border-gray-200 hover:bg-gray-50'
                                                                                }`}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <input
                                                                                    type="radio"
                                                                                    name="train-class-route"
                                                                                    checked={selectedTrain.selectedClass?.category === cls.category}
                                                                                    onChange={() => setSelectedTrain({
                                                                                        ...selectedTrain,
                                                                                        selectedClass: cls
                                                                                    })}
                                                                                    className="w-4 h-4 text-teal-600"
                                                                                />
                                                                                <span className="font-medium text-gray-700">{cls.category}</span>
                                                                            </div>
                                                                            <span className="font-bold text-teal-700">₹{cls.price}</span>
                                                                        </label>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    })()}

                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl">
                                    <FaTrain className="mx-auto text-3xl mb-2 opacity-50" />
                                    <p>Train details will be shared separately.</p>
                                </div>
                            )}

                        </div>
                    </div>
                );

            case 6: // Packages Selection
                return (
                    <div className="space-y-6">
                        {packages.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="font-semibold text-gray-800 text-lg">Select Package</h4>
                                <div className="space-y-4">
                                    {packages.map((pkg, index) => (
                                        <div key={index} className="border-2 border-gray-100 rounded-xl p-4">
                                            <h5 className="font-bold text-gray-800 mb-1">{pkg.name}</h5>
                                            <p className="text-xs text-gray-500 mb-3">{pkg.description}</p>

                                            {/* Render Pricing Options */}
                                            {pkg.pricing && pkg.pricing.length > 0 ? (
                                                <div className="space-y-2">
                                                    {pkg.pricing.map((price, idx) => (
                                                        <label
                                                            key={idx}
                                                            className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${selectedPackage?.packageName === pkg.name && selectedPackage?.selectedPricing?.type === price.type
                                                                ? 'border-teal-500 bg-teal-50 ring-1 ring-teal-500'
                                                                : 'border-gray-200 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="radio"
                                                                    name="package-price"
                                                                    checked={selectedPackage?.packageName === pkg.name && selectedPackage?.selectedPricing?.type === price.type}
                                                                    onChange={() => setSelectedPackage({
                                                                        packageName: pkg.name,
                                                                        description: pkg.description,
                                                                        selectedPricing: price
                                                                    })}
                                                                    className="w-4 h-4 text-teal-600"
                                                                />
                                                                <span className="font-medium text-gray-700">{price.type}</span>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="font-bold text-teal-700 block">₹{price.perPerson}</span>
                                                                <span className="text-xs text-gray-500">per person</span>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500 italic">No pricing details available.</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Packages (Add-ons) Selection */}
                        {yatra.customPackages && yatra.customPackages.length > 0 && (
                            <div className="space-y-4 pt-6 md:pt-8 border-t border-gray-100">
                                <h4 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
                                    Optional Add-ons
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {yatra.customPackages.map((pkg, idx) => {
                                        const isSelected = selectedCustomPackages.some(p => p.name === pkg.name);
                                        return (
                                            <label
                                                key={idx}
                                                className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${isSelected
                                                    ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                                                    : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex-shrink-0 mt-1">
                                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-orange-500 border-orange-500' : 'border-gray-300 bg-white'
                                                        }`}>
                                                        {isSelected && <FaCheckCircle className="text-white text-xs" />}
                                                    </div>
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => {
                                                            if (isSelected) {
                                                                setSelectedCustomPackages(selectedCustomPackages.filter(p => p.name !== pkg.name));
                                                            } else {
                                                                setSelectedCustomPackages([...selectedCustomPackages, pkg]);
                                                            }
                                                        }}
                                                        className="hidden"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-bold text-gray-800 block">{pkg.name}</span>
                                                    {pkg.description && (
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{pkg.description}</p>
                                                    )}
                                                    <div className="mt-2 text-sm font-semibold text-orange-700">
                                                        ₹{pkg.price} <span className="text-xs font-normal text-gray-500">/ person</span>
                                                    </div>
                                                </div>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 7: // Payment
                return (
                    <div className="space-y-6">
                        {/* Summary Card */}
                        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
                            <h4 className="font-bold text-gray-800 border-b pb-2 flex items-center justify-between">
                                <span>Booking Summary</span>
                                <span className="text-sm font-normal text-gray-500">{members.length} Traveler(s)</span>
                            </h4>

                            {/* Train Summary */}
                            {selectedTrain && selectedTrain.selectedClass && (
                                <div className="flex justify-between items-start text-sm">
                                    <div>
                                        <p className="font-semibold text-gray-700">Train: {selectedTrain.trainName}</p>
                                        <p className="text-gray-500">{selectedTrain.selectedClass.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">₹{selectedTrain.selectedClass.price} × {members.length}</p>
                                        <p className="font-bold text-gray-800">₹{(parseFloat(selectedTrain.selectedClass.price) * members.length).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            {/* Package Summary */}
                            {selectedPackage && selectedPackage.selectedPricing && (
                                <div className="flex justify-between items-start text-sm border-t border-dashed pt-2">
                                    <div>
                                        <p className="font-semibold text-gray-700">Package: {selectedPackage.packageName}</p>
                                        <p className="text-gray-500">{selectedPackage.selectedPricing.type}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium">₹{selectedPackage.selectedPricing.perPerson} × {members.length}</p>
                                        <p className="font-bold text-gray-800">₹{(parseFloat(selectedPackage.selectedPricing.perPerson) * members.length).toLocaleString()}</p>
                                    </div>
                                </div>
                            )}

                            {/* Custom Packages Summary */}
                            {selectedCustomPackages && selectedCustomPackages.length > 0 && (
                                <div className="space-y-2 border-t border-dashed pt-2 mt-2">
                                    {selectedCustomPackages.map((pkg, idx) => (
                                        <div key={idx} className="flex justify-between items-start text-sm">
                                            <div>
                                                <p className="font-semibold text-gray-700">Add-on: {pkg.name}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium">₹{pkg.price} × {members.length}</p>
                                                <p className="font-bold text-gray-800">₹{(parseFloat(pkg.price) * members.length).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Total */}
                            <div className="border-t-2 border-dashed border-gray-200 pt-3 mt-4">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-bold text-gray-800">Total Yatra Cost</span>
                                    <span className="font-bold text-teal-700">₹{calculateTotal().toLocaleString()}</span>
                                </div>
                                {(!isNaN(parseFloat(yatra.advancePaymentPercentage)) && parseFloat(yatra.advancePaymentPercentage) > 0 && parseFloat(yatra.advancePaymentPercentage) < 100) && (
                                    <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                                        <div className="flex justify-between items-center text-base mb-1">
                                            <span className="font-semibold text-orange-800">Advance Payment Required ({yatra.advancePaymentPercentage}%)</span>
                                            <span className="font-bold text-orange-700">
                                                ₹{Math.round((calculateTotal() * yatra.advancePaymentPercentage) / 100).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-orange-600">
                                            * Pay {yatra.advancePaymentPercentage}% of total amount (₹{calculateTotal().toLocaleString()}) to confirm booking
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Payment Instructions */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <h4 className="font-semibold text-blue-800 mb-2">Payment Instructions</h4>
                            <p className="text-sm text-blue-700 mb-2">
                                Please pay <span className="font-bold">
                                    {(!isNaN(parseFloat(yatra.advancePaymentPercentage)) && parseFloat(yatra.advancePaymentPercentage) > 0 && parseFloat(yatra.advancePaymentPercentage) < 100)
                                        ? `₹${Math.round((calculateTotal() * yatra.advancePaymentPercentage) / 100).toLocaleString()} (Advance Amount)`
                                        : `₹${calculateTotal().toLocaleString()} (Total Amount)`
                                    }
                                </span> using the QR code below or bank details.
                            </p>
                            <p className="text-xs text-blue-600">
                                Upload the screenshot of your payment to proceed.
                            </p>
                        </div>

                        {/* QR Code */}
                        <label className="block text-sm font-medium text-gray-700 mb-2 mt-4 text-center w-full">
                            Upload Payment Screenshot
                        </label>
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all relative">
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    accept="image/*"
                                    onChange={(e) => setPaymentScreenshot(e.target.files[0])}
                                />
                                <div className="flex flex-col items-center justify-center pointer-events-none">
                                    {paymentScreenshot ? (
                                        <>
                                            <FaCheckCircle className="text-green-500 text-2xl mb-1" />
                                            <span className="text-sm text-gray-700 font-medium">
                                                {paymentScreenshot.name}
                                            </span>
                                            <span className="text-xs text-gray-500">Click to change</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaUpload className="text-gray-400 text-2xl mb-1" />
                                            <span className="text-sm text-gray-500">
                                                Click to upload payment screenshot
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 8: // Suggestions & Complete
                return (
                    <div className="space-y-6">
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                            <h4 className="font-semibold text-green-800 mb-2">Almost Done!</h4>
                            <p className="text-sm text-green-700">
                                Review your details and submit your registration.
                            </p>
                        </div>

                        {/* Summary */}
                        <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">
                            <h4 className="font-semibold text-gray-800 border-b pb-2">Registration Summary</h4>
                            <div className="text-sm">
                                <p><strong>Yatra:</strong> {yatra.title}</p>
                                <p><strong>Contact:</strong> {primaryContact.email} | {primaryContact.phone}</p>
                                <p><strong>Members:</strong> {members.length} person(s)</p>
                                {selectedPackage && (
                                    <p><strong>Package:</strong> {selectedPackage.packageName}</p>
                                )}
                                {selectedTrain && (
                                    <p><strong>Train:</strong> {selectedTrain.trainName}</p>
                                )}
                                <p><strong>Same Room:</strong> {accommodation.sameRoom ? 'Yes' : 'No'}</p>
                                <p className="text-lg font-bold text-teal-700 mt-2">
                                    Total: ₹{calculateTotal().toLocaleString()}
                                </p>
                            </div>
                        </div>

                        {/* Suggestions */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Suggestions / Special Requests
                            </label>
                            <textarea
                                value={suggestions}
                                onChange={(e) => setSuggestions(e.target.value)}
                                placeholder="Any suggestions or special requests for the yatra..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 outline-none resize-none"
                            />
                        </div>

                        {submitError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                                {submitError}
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (submitSuccess) {
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 text-center"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaCheckCircle className="text-green-500 text-4xl" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">Registration Successful!</h3>
                    <p className="text-gray-600 mb-6">
                        Thank you for registering for {yatra.title}. We will contact you soon with more details.
                    </p>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors"
                    >
                        Close
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-teal-600 to-teal-800 p-5 text-white flex-shrink-0">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold">Register for Yatra</h3>
                            <p className="text-teal-100 text-sm">{yatra.title}</p>
                        </div>
                        <button onClick={handleClose} className="text-white/80 hover:text-white">
                            <FaTimes size={24} />
                        </button>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-between mt-4 px-2">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep >= step.id
                                    ? 'bg-white text-teal-700'
                                    : 'bg-teal-500/50 text-white/70'
                                    }`}>
                                    {step.id}
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={`w-6 md:w-12 h-1 mx-1 ${currentStep > step.id ? 'bg-white' : 'bg-teal-500/50'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="text-center mt-2 text-sm font-medium">
                        {STEPS[currentStep - 1].title}
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-1">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderStepContent()}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Navigation */}
                <div className="p-4 border-t border-gray-200 flex flex-col gap-3 flex-shrink-0">
                    {/* Validation Error Message */}
                    {validationError && (
                        <div className="w-full p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center justify-center gap-2 animate-pulse text-sm font-medium">
                            <FaTimes />
                            {validationError}
                        </div>
                    )}

                    <div className="flex justify-between items-center w-full">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-colors ${currentStep === 1
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-gray-700 hover:bg-gray-100'
                                }`}
                        >
                            <FaChevronLeft /> Previous
                        </button>

                        {currentStep === STEPS.length ? (
                            <button
                                onClick={handleSubmit}
                                disabled={submitting}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all disabled:opacity-50"
                            >
                                {submitting ? 'Submitting...' : 'Submit Registration'}
                            </button>
                        ) : (
                            <button
                                onClick={nextStep}
                                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all bg-teal-600 text-white hover:bg-teal-700"
                            >
                                Next <FaChevronRight />
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default MultiStepRegistrationForm;
