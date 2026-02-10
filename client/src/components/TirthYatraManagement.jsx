import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Plus,
    Edit,
    Trash2,
    X,
    Image as ImageIcon,
    Calendar,
    MapPin,
    Train,
    DollarSign,
    CheckCircle,
    XCircle,
    Upload,
    Link,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import api from '../lib/api';

const ICONS = ['🛕', '🏔️', '🕉️', '🕯️', '🚋', '🚌', '🧘', '👣', '🌸', '🌅'];

const TirthYatraManagement = () => {
    const [yatras, setYatras] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [notification, setNotification] = useState({ type: '', message: '' });


    const initialFormState = {
        title: '',
        icon: '🛕',
        image: '',
        date: '',
        startDate: '',
        endDate: '',
        duration: '',
        travelMode: 'Train',
        locations: '',
        eligibility: 'Open for all seekers',
        description: '',
        ticketPrice: '', // Base price or range description
        whatsappLink: '',
        trainInfo: [], // [{ trainName: '', trainNumber: '', classes: [{ category: 'AC', price: 0 }], routes: [] }]
        itinerary: [], // [{ day: 1, date: '', schedule: [], meals: {} }]
        packages: [], // [{ name: '', description: '', pricing: [] }]
        customPackages: [], // [{ name: '', description: '', price: '' }]
        instructions: [], // ['String']
        includes: [], // ['String']
        excludes: [] // ['String']
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchYatras();
    }, []);

    const fetchYatras = async () => {
        try {
            const response = await api.get('/tirthyatra');
            setYatras(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching yatras:', error);
            showNotification('error', 'Failed to load Tirth Yatras');
            setLoading(false);
        }
    };

    const showNotification = (type, message) => {
        setNotification({ type, message });
        setTimeout(() => setNotification({ type: '', message: '' }), 3000);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Auto-calculate Duration and Itinerary Days
    useEffect(() => {
        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

            if (!isNaN(diffDays) && diffDays > 0) {
                const durationText = `${diffDays} Days / ${diffDays - 1} Nights`;

                setFormData(prev => {
                    // Only update if changed to avoid loops, though useEffect deps help.
                    // Actually we want to update itinerary structure too if days changed.
                    const currentItinerary = prev.itinerary || [];
                    let newItinerary = [...currentItinerary];

                    // Resize itinerary array
                    if (newItinerary.length < diffDays) {
                        for (let i = newItinerary.length; i < diffDays; i++) {
                            newItinerary.push({
                                day: i + 1,
                                date: '', // Will calculate display date below
                                schedule: [],
                                meals: { breakfast: '', lunch: '', dinner: '' }
                            });
                        }
                    } else if (newItinerary.length > diffDays) {
                        // Optional: Truncate or keep? Let's truncate to match dates for now, 
                        // but maybe safer to ask? For this 'Automated' request, resizing is expected.
                        newItinerary = newItinerary.slice(0, diffDays);
                    }

                    // Update dates for each day
                    newItinerary = newItinerary.map((day, idx) => {
                        const d = new Date(start);
                        d.setDate(d.getDate() + idx);
                        const dayStr = d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
                        return { ...day, date: dayStr, day: idx + 1 };
                    });

                    return {
                        ...prev,
                        duration: durationText,
                        itinerary: newItinerary
                    };
                });
            }
        }
    }, [formData.startDate, formData.endDate]);



    // Train Details Management
    const addTrain = () => {
        setFormData(prev => ({
            ...prev,
            trainInfo: [...(prev.trainInfo || []), {
                trainName: '',
                trainNumber: '',
                from: '',
                to: '',
                classes: [{ category: 'AC', price: '' }],
                routes: [] // Array of { from: '', to: '', classes: [] }
            }]
        }));
    };

    const removeTrain = (index) => {
        const newTrains = [...formData.trainInfo];
        newTrains.splice(index, 1);
        setFormData({ ...formData, trainInfo: newTrains });
    };

    const updateTrain = (index, field, value) => {
        const newTrains = [...formData.trainInfo];
        newTrains[index][field] = value;
        setFormData({ ...formData, trainInfo: newTrains });
    };

    const addClass = (trainIndex) => {
        const newTrains = [...formData.trainInfo];
        newTrains[trainIndex].classes.push({ category: 'AC', price: '' });
        setFormData({ ...formData, trainInfo: newTrains });
    };

    const removeClass = (trainIndex, classIndex) => {
        const newTrains = [...formData.trainInfo];
        newTrains[trainIndex].classes.splice(classIndex, 1);
        setFormData({ ...formData, trainInfo: newTrains });
    };

    const updateClass = (trainIndex, classIndex, field, value) => {
        const newTrains = [...formData.trainInfo];
        newTrains[trainIndex].classes[classIndex][field] = value;
        setFormData({ ...formData, trainInfo: newTrains });
    };

    // Route Management
    const addRoute = (trainIndex) => {
        const newTrains = [...formData.trainInfo];
        // Initialize route with empty classes or copy from main/default classes? Let's start empty or with one default
        newTrains[trainIndex].routes = newTrains[trainIndex].routes || [];
        newTrains[trainIndex].routes.push({
            from: '',
            to: '',
            classes: [{ category: 'AC', price: '' }]
        });
        setFormData({ ...formData, trainInfo: newTrains });
    };

    const removeRoute = (trainIndex, routeIndex) => {
        const newTrains = [...formData.trainInfo];
        newTrains[trainIndex].routes.splice(routeIndex, 1);
        setFormData({ ...formData, trainInfo: newTrains });
    };

    const updateRoute = (trainIndex, routeIndex, field, value) => {
        const newTrains = [...formData.trainInfo];
        newTrains[trainIndex].routes[routeIndex][field] = value;
        setFormData({ ...formData, trainInfo: newTrains });
    };

    // Route Class Management
    const addRouteClass = (trainIndex, routeIndex) => {
        const newTrains = [...formData.trainInfo];
        newTrains[trainIndex].routes[routeIndex].classes.push({ category: 'AC', price: '' });
        setFormData({ ...formData, trainInfo: newTrains });
    };

    const removeRouteClass = (trainIndex, routeIndex, classIndex) => {
        const newTrains = [...formData.trainInfo];
        newTrains[trainIndex].routes[routeIndex].classes.splice(classIndex, 1);
        setFormData({ ...formData, trainInfo: newTrains });
    };

    const updateRouteClass = (trainIndex, routeIndex, classIndex, field, value) => {
        const newTrains = [...formData.trainInfo];
        newTrains[trainIndex].routes[routeIndex].classes[classIndex][field] = value;
        setFormData({ ...formData, trainInfo: newTrains });
    };

    // Itinerary Management
    const addDay = () => {
        setFormData(prev => ({
            ...prev,
            itinerary: [...(prev.itinerary || []), {
                day: (prev.itinerary?.length || 0) + 1,
                date: '',
                schedule: [],
                meals: { breakfast: '', lunch: '', dinner: '' }
            }]
        }));
    };

    const removeDay = (index) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary.splice(index, 1);
        // Re-index days
        newItinerary.forEach((day, i) => day.day = i + 1);
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const updateDay = (index, field, value) => {
        const newItinerary = [...(formData.itinerary || [])];
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            newItinerary[index][parent] = { ...newItinerary[index][parent], [child]: value };
        } else {
            newItinerary[index][field] = value;
        }
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const addActivity = (dayIndex) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary[dayIndex].schedule.push({ time: '', activity: '', description: '', icon: '🛕' });
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const removeActivity = (dayIndex, activityIndex) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary[dayIndex].schedule.splice(activityIndex, 1);
        setFormData({ ...formData, itinerary: newItinerary });
    };

    const updateActivity = (dayIndex, activityIndex, field, value) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary[dayIndex].schedule[activityIndex][field] = value;
        setFormData({ ...formData, itinerary: newItinerary });
    };

    // Package Management
    const addPackage = () => {
        setFormData(prev => ({
            ...prev,
            packages: [...(prev.packages || []), { name: '', description: '', pricing: [] }]
        }));
    };

    const removePackage = (index) => {
        const newPackages = [...(formData.packages || [])];
        newPackages.splice(index, 1);
        setFormData({ ...formData, packages: newPackages });
    };

    const updatePackage = (index, field, value) => {
        const newPackages = [...(formData.packages || [])];
        newPackages[index][field] = value;
        setFormData({ ...formData, packages: newPackages });
    };

    const addPackagePrice = (pkgIndex) => {
        const newPackages = [...(formData.packages || [])];
        newPackages[pkgIndex].pricing.push({ type: '', cost: '', perPerson: '' });
        setFormData({ ...formData, packages: newPackages });
    };

    const removePackagePrice = (pIndex, prIndex) => {
        setFormData(prev => {
            const newPackages = [...prev.packages];
            if (newPackages[pIndex] && newPackages[pIndex].pricing) {
                newPackages[pIndex].pricing = newPackages[pIndex].pricing.filter((_, i) => i !== prIndex);
            }
            return { ...prev, packages: newPackages };
        });
    };

    const updatePackagePrice = (pkgIndex, priceIndex, field, value) => {
        const newPackages = [...(formData.packages || [])];
        newPackages[pkgIndex].pricing[priceIndex][field] = value;
        setFormData({ ...formData, packages: newPackages });
    };

    // Custom Packages (Add-ons) Management
    const addCustomPackage = () => {
        setFormData(prev => ({
            ...prev,
            customPackages: [...(prev.customPackages || []), { name: '', description: '', price: '' }]
        }));
    };

    const removeCustomPackage = (index) => {
        setFormData(prev => ({
            ...prev,
            customPackages: prev.customPackages.filter((_, i) => i !== index)
        }));
    };

    const updateCustomPackage = (index, field, value) => {
        setFormData(prev => {
            const newCustomPackages = [...prev.customPackages];
            newCustomPackages[index] = { ...newCustomPackages[index], [field]: value };
            return { ...prev, customPackages: newCustomPackages };
        });
    };
    // Instructions Management
    const addInstruction = () => {
        setFormData(prev => ({
            ...prev,
            instructions: [...(prev.instructions || []), '']
        }));
    };

    const removeInstruction = (index) => {
        const newInstructions = [...(formData.instructions || [])];
        newInstructions.splice(index, 1);
        setFormData({ ...formData, instructions: newInstructions });
    };

    const updateInstruction = (index, value) => {
        const newInstructions = [...(formData.instructions || [])];
        newInstructions[index] = value;
        setFormData({ ...formData, instructions: newInstructions });
    };

    // Includes Management
    const addInclude = () => {
        setFormData(prev => ({
            ...prev,
            includes: [...(prev.includes || []), '']
        }));
    };

    const removeInclude = (index) => {
        const newIncludes = [...(formData.includes || [])];
        newIncludes.splice(index, 1);
        setFormData({ ...formData, includes: newIncludes });
    };

    const updateInclude = (index, value) => {
        const newIncludes = [...(formData.includes || [])];
        newIncludes[index] = value;
        setFormData({ ...formData, includes: newIncludes });
    };

    // Excludes Management
    const addExclude = () => {
        setFormData(prev => ({
            ...prev,
            excludes: [...(prev.excludes || []), '']
        }));
    };

    const removeExclude = (index) => {
        const newExcludes = [...(formData.excludes || [])];
        newExcludes.splice(index, 1);
        setFormData({ ...formData, excludes: newExcludes });
    };

    const updateExclude = (index, value) => {
        const newExcludes = [...(formData.excludes || [])];
        newExcludes[index] = value;
        setFormData({ ...formData, excludes: newExcludes });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        // 1. Append regular text fields first
        Object.keys(formData).forEach(key => {
            if (['image', 'trainInfo', 'itinerary', 'packages', 'customPackages', 'instructions', 'includes', 'excludes'].includes(key)) return;
            data.append(key, formData[key]);
        });

        // 2. Prepare and Append JSON fields (checking for numeric validity)
        const sanitizeNumber = (val) => (val === '' || val === null || val === undefined) ? 0 : Number(val);

        const sanitizedTrainInfo = (formData.trainInfo || []).map(train => ({
            ...train,
            classes: train.classes.map(cls => ({
                ...cls,
                price: sanitizeNumber(cls.price)
            })),
            routes: (train.routes || []).map(route => ({
                ...route,
                classes: route.classes.map(cls => ({
                    ...cls,
                    price: sanitizeNumber(cls.price)
                }))
            }))
        }));

        const sanitizedPackages = (formData.packages || []).map(pkg => ({
            ...pkg,
            pricing: pkg.pricing.map(pr => ({
                ...pr,
                cost: sanitizeNumber(pr.cost),
                perPerson: sanitizeNumber(pr.perPerson)
            }))
        }));

        data.append('trainInfo', JSON.stringify(sanitizedTrainInfo));
        data.append('itinerary', JSON.stringify(formData.itinerary || []));
        data.append('packages', JSON.stringify(sanitizedPackages));
        data.append('instructions', JSON.stringify(formData.instructions || []));
        data.append('includes', JSON.stringify(formData.includes || []));
        data.append('excludes', JSON.stringify(formData.excludes || []));
        data.append('customPackages', JSON.stringify(formData.customPackages || []));

        // 3. Append Image LAST to ensure Multer parses body fields first
        // 3. Append Image LAST to ensure Multer parses body fields first
        if (formData.image) {
            data.append('image', formData.image);
        } else {
            data.append('image', '');
        }

        try {
            const config = {};
            // actually we should NOT set this manually for FormData, let axios handle it
            // checking if leaving it empty works or if we should just omit headers completely.
            // Axios docs say: "When data is a FormData object, axios sets Content-Type to multipart/form-data automatically"
            // So we can just pass empty config or omit it. 
            // However, usually existing code might have authorization headers injected via interceptors.
            // The `api` instance (likely axios instance) already handles authn.
            // So I will just remove the Content-Type override.
            // The cleanest way is to remove the line defining config and pass empty object or just rely on defaults, 
            // BUT wait, `api` is imported from `../lib/api`. 
            // If I remove `const config = ...`, I need to update the api calls below.

            // Let's just remove the header property from the config object, but keep the object if needed (though here it only had that header).
            // Actually, simply removing the header line is best.


            if (editingId) {
                await api.put(`/tirthyatra/${editingId}`, data, config);
                showNotification('success', 'Tirth Yatra updated successfully');
            } else {
                await api.post('/tirthyatra', data, config);
                showNotification('success', 'New Tirth Yatra created successfully');
            }
            fetchYatras();
            handleCloseForm();
        } catch (error) {
            console.error('Error saving yatra:', error);
            showNotification('error', 'Failed to save Tirth Yatra');
        }
    };

    const [uploading, setUploading] = useState(false);

    const handleDirectUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        setUploading(true);
        try {
            // Explicitly unset 'Content-Type' to allow browser to set 'multipart/form-data' with boundary
            // This overrides any default 'application/json' set in the api instance
            const res = await api.post('/tirthyatra/upload', formData, {
                headers: {
                    'Content-Type': undefined
                }
            });

            setFormData(prev => ({ ...prev, image: res.data.imageUrl }));
            showNotification('success', 'Image uploaded successfully');
        } catch (error) {
            console.error('Upload failed detailed:', error);
            console.error('Response data:', error.response?.data);
            console.error('Response status:', error.response?.status);
            showNotification('error', `Failed to upload image: ${error.response?.data?.message || error.message}`);
        } finally {
            setUploading(false);
            // Reset file input
            e.target.value = '';
        }
    };

    const handleEdit = (yatra) => {
        // Helper to safely parse if double stringified
        const safeParse = (data) => {
            if (typeof data === 'string' && (data.startsWith('[') || data.startsWith('{'))) {
                try {
                    return JSON.parse(data);
                } catch (e) {
                    return data;
                }
            }
            return data;
        };

        // Helper for array of strings (includes/excludes) specifically
        const safeParseArray = (data) => {
            let parsed = safeParse(data);
            if (typeof parsed === 'string') {
                parsed = safeParse(parsed);
            }
            if (Array.isArray(parsed)) {
                return parsed.map(item => {
                    if (typeof item === 'string' && (item.startsWith('[') || item.startsWith('{'))) {
                        const inner = safeParse(item);
                        if (Array.isArray(inner) && inner.length > 0) return inner[0];
                        if (typeof inner === 'string') return inner;
                    }
                    if (typeof item === 'string') return item.replace(/^"|"$/g, '').replace(/^'|'$/g, '');
                    return item;
                });
            }
            return [];
        };

        setFormData({
            title: yatra.title || '',
            icon: yatra.icon || '🛕',
            image: yatra.image || '',
            date: yatra.date || '',
            duration: yatra.duration || '',
            travelMode: yatra.travelMode || 'Train',
            locations: yatra.locations || '',
            eligibility: yatra.eligibility || 'Open for all seekers',
            description: yatra.description || '',
            ticketPrice: yatra.ticketPrice || '',
            whatsappLink: yatra.whatsappLink || '',
            trainInfo: safeParse(yatra.trainInfo) || [],
            itinerary: safeParse(yatra.itinerary) || [],
            packages: safeParse(yatra.packages) || [],
            customPackages: safeParse(yatra.customPackages) || [],
            instructions: safeParseArray(yatra.instructions),
            includes: safeParseArray(yatra.includes),
            excludes: safeParseArray(yatra.excludes),
            startDate: yatra.startDate ? yatra.startDate.split('T')[0] : '',
            endDate: yatra.endDate ? yatra.endDate.split('T')[0] : '',
            advancePaymentPercentage: yatra.advancePaymentPercentage || ''
        });
        // Ensure image field is set in formData if it exists, so if they save without changing, we send the URL.
        if (yatra.image) {
            setFormData(prev => ({ ...prev, image: yatra.image }));
        }

        setEditingId(yatra._id);
        setIsFormOpen(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this Tirth Yatra?')) return;
        try {
            await api.delete(`/tirthyatra/${id}`);
            showNotification('success', 'Tirth Yatra deleted successfully');
            fetchYatras();
        } catch (error) {
            console.error('Error deleting yatra:', error);
            showNotification('error', 'Failed to delete Tirth Yatra');
        }
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingId(null);
        setFormData(initialFormState);

    };

    return (
        <div className="space-y-6">
            {/* Header / Actions */}
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Tirth Yatra Management</h2>
                    <p className="text-gray-500">Manage pilgrimage details, dates, and prices</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-6 py-3 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold"
                >
                    <Plus size={20} />
                    Add New Yatra
                </button>
            </div>

            {/* Notification Toast */}
            <AnimatePresence>
                {notification.message && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`fixed top-24 right-8 z-50 p-4 rounded-xl shadow-2xl flex items-center gap-3 ${notification.type === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'
                            }`}
                    >
                        {notification.type === 'success' ? <CheckCircle size={24} /> : <XCircle size={24} />}
                        <span className="font-medium">{notification.message}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* List */}
            {loading ? (
                <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
                    <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading yatras...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {yatras.map((yatra) => (
                            <motion.div
                                key={yatra._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-white group rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300"
                            >
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={yatra.image}
                                        alt={yatra.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                                    />
                                    <div className="absolute top-3 right-3 flex gap-2">
                                        <button
                                            onClick={() => handleEdit(yatra)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(yatra._id)}
                                            className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-lg"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-sm font-semibold text-gray-800 shadow-lg flex items-center gap-1">
                                        <span>{yatra.icon}</span>
                                        <span>{yatra.title}</span>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <Calendar size={18} className="mt-1 text-orange-500" />
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Date</p>
                                            <p className="font-medium text-gray-900">{yatra.date}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 text-gray-600">
                                        <MapPin size={18} className="mt-1 text-orange-500" />
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Locations</p>
                                            <p className="font-medium text-gray-900 line-clamp-1">{yatra.locations}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Form Modal */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto mx-4 md:mx-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-8">
                                <div className="flex justify-between items-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        {editingId ? 'Edit Tirth Yatra' : 'Create New Tirth Yatra'}
                                    </h2>
                                    <button onClick={handleCloseForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                        <X size={24} className="text-gray-500" />
                                    </button>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                                            e.preventDefault();
                                        }
                                    }}
                                >
                                    {/* Basic Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Yatra Title</label>
                                            <input
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g. 84 Kos Vrindavan Yatra"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Icon</label>
                                            <div className="relative">
                                                <select
                                                    name="icon"
                                                    value={formData.icon}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none"
                                                >
                                                    {ICONS.map(icon => (
                                                        <option key={icon} value={icon}>{icon}</option>
                                                    ))}
                                                </select>
                                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div className="space-y-4">
                                        <label className="text-sm font-semibold text-gray-700">Yatra Image</label>

                                        {formData.image && (
                                            <div className="relative w-full h-64 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 mb-4 group">
                                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => setFormData({ ...formData, image: '' })}
                                                        className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium shadow-lg flex items-center gap-2 hover:bg-red-50"
                                                    >
                                                        <Trash2 size={18} /> Remove Image
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex gap-4">
                                            <div className="relative w-full">
                                                <input
                                                    type="file"
                                                    id="direct-upload"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleDirectUpload}
                                                    disabled={uploading}
                                                />
                                                <label
                                                    htmlFor="direct-upload"
                                                    className={`flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-medium transition-colors cursor-pointer border-2 border-dashed border-gray-300 hover:border-orange-500 hover:bg-orange-50 w-full ${uploading ? 'bg-gray-100 text-gray-400' : 'bg-white text-gray-600'}`}
                                                >
                                                    {uploading ? (
                                                        <>
                                                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                            Uploading...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Upload size={20} /> {formData.image ? 'Change Image' : 'Upload Image'}
                                                        </>
                                                    )}
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date & Travel */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Display Date (Text)</label>
                                            <input
                                                name="date"
                                                value={formData.date}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="e.g. 24th – 31st Oct 2025"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">Start Date</label>
                                                <input
                                                    type="date"
                                                    name="startDate"
                                                    value={formData.startDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm font-semibold text-gray-700">End Date</label>
                                                <input
                                                    type="date"
                                                    name="endDate"
                                                    value={formData.endDate}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Duration (Auto)</label>
                                            <input
                                                name="duration"
                                                value={formData.duration}
                                                readOnly
                                                placeholder="Calculated automatically..."
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 outline-none"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Travel Mode</label>
                                            <input
                                                name="travelMode"
                                                value={formData.travelMode}
                                                onChange={handleInputChange}
                                                placeholder="e.g. Train, Bus"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Advance Payment (%)</label>
                                            <input
                                                type="text"
                                                name="advancePaymentPercentage"
                                                value={formData.advancePaymentPercentage || ''}
                                                onChange={handleInputChange}
                                                placeholder="e.g. 50"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Location & Ticket Price */}

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Locations</label>
                                        <input
                                            name="locations"
                                            value={formData.locations}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="e.g. Barsana, Nandgaon, Govardhan"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Detailed Description</label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            placeholder="Enter detailed description of the Yatra..."
                                            rows="4"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none"
                                        />
                                    </div>

                                    {/* Dynamic Train Details */}
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Train size={18} />
                                                Train & Pricing Details
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={addTrain}
                                                className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Train
                                            </button>
                                        </div>

                                        {formData.trainInfo?.map((train, tIndex) => (
                                            <div key={tIndex} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <h5 className="text-sm font-bold text-gray-500 uppercase">Train #{tIndex + 1}</h5>
                                                    <button type="button" onClick={() => removeTrain(tIndex)} className="text-red-500 hover:text-red-700">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                    <input
                                                        placeholder="Train Name"
                                                        value={train.trainName}
                                                        onChange={(e) => updateTrain(tIndex, 'trainName', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                    />
                                                    <input
                                                        placeholder="Train No."
                                                        value={train.trainNumber}
                                                        onChange={(e) => updateTrain(tIndex, 'trainNumber', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                    />
                                                    <input
                                                        placeholder="From Station"
                                                        value={train.from}
                                                        onChange={(e) => updateTrain(tIndex, 'from', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                    />
                                                    <input
                                                        placeholder="To Station"
                                                        value={train.to}
                                                        onChange={(e) => updateTrain(tIndex, 'to', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                    />
                                                </div>

                                                {/* Classes & Prices - REMOVED */}


                                                {/* Routes Section */}
                                                <div className="space-y-3 pt-3 border-t border-gray-100">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-semibold text-gray-500 uppercase">Specific Routes (Optional)</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => addRoute(tIndex)}
                                                            className="text-xs text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1"
                                                        >
                                                            <Plus size={12} /> Add Route
                                                        </button>
                                                    </div>

                                                    {(train.routes || []).map((route, rIndex) => (
                                                        <div key={rIndex} className="bg-gray-50 p-3 rounded-lg border border-gray-200 space-y-3">
                                                            <div className="flex justify-between items-center">
                                                                <span className="text-xs font-bold text-gray-400">Route #{rIndex + 1}</span>
                                                                <button type="button" onClick={() => removeRoute(tIndex, rIndex)} className="text-red-400 hover:text-red-600">
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-3">
                                                                <input
                                                                    placeholder="From (e.g. Mumbai)"
                                                                    value={route.from}
                                                                    onChange={(e) => updateRoute(tIndex, rIndex, 'from', e.target.value)}
                                                                    className="w-full px-2 py-2 rounded border border-gray-300 text-sm"
                                                                />
                                                                <input
                                                                    placeholder="To (e.g. Surat)"
                                                                    value={route.to}
                                                                    onChange={(e) => updateRoute(tIndex, rIndex, 'to', e.target.value)}
                                                                    className="w-full px-2 py-2 rounded border border-gray-300 text-sm"
                                                                />
                                                            </div>

                                                            {/* Route Classes */}
                                                            <div className="space-y-2 pl-2 border-l-2 border-teal-100">
                                                                {route.classes.map((cls, rcIndex) => (
                                                                    <div key={rcIndex} className="flex gap-2 items-center">
                                                                        <select
                                                                            value={cls.category}
                                                                            onChange={(e) => updateRouteClass(tIndex, rIndex, rcIndex, 'category', e.target.value)}
                                                                            className="w-1/3 px-2 py-1 rounded border border-gray-300 text-sm"
                                                                        >
                                                                            <option value="AC">AC (Gen)</option>
                                                                            <option value="1 AC">1 AC</option>
                                                                            <option value="2 AC">2 AC</option>
                                                                            <option value="3 AC">3 AC</option>
                                                                            <option value="CC">Chair Car</option>
                                                                            <option value="SL">Sleeper</option>
                                                                            <option value="2S">2nd Sit</option>
                                                                            <option value="Gn">General</option>
                                                                        </select>
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Price"
                                                                            value={cls.price}
                                                                            onChange={(e) => updateRouteClass(tIndex, rIndex, rcIndex, 'price', e.target.value)}
                                                                            className="w-1/3 px-2 py-1 rounded border border-gray-300 text-sm"
                                                                        />
                                                                        <button type="button" onClick={() => removeRouteClass(tIndex, rIndex, rcIndex)} className="text-gray-400 hover:text-red-500">
                                                                            <X size={12} />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => addRouteClass(tIndex, rIndex)}
                                                                    className="text-xs text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                                                >
                                                                    <Plus size={10} /> Add Price
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Itinerary Section */}
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <Calendar size={18} />
                                                Itinerary (Yatra Karyakram) - Auto Generated via Dates
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={addDay}
                                                className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Day
                                            </button>
                                        </div>

                                        {formData.itinerary?.map((day, dIndex) => (
                                            <div key={dIndex} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <h5 className="text-sm font-bold text-gray-500 uppercase">Day {day.day}</h5>
                                                    <button type="button" onClick={() => removeDay(dIndex)} className="text-red-500 hover:text-red-700">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <input
                                                    placeholder="Date (e.g. 17/05)"
                                                    value={day.date}
                                                    onChange={(e) => updateDay(dIndex, 'date', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                />

                                                {/* Schedule */}
                                                <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-semibold text-gray-400">Schedule</label>
                                                        <button type="button" onClick={() => addActivity(dIndex)} className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                                            <Plus size={12} /> Add Activity
                                                        </button>
                                                    </div>
                                                    {day.schedule.map((act, aIndex) => (
                                                        <div key={aIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                            <input
                                                                placeholder="Time"
                                                                value={act.time}
                                                                onChange={(e) => updateActivity(dIndex, aIndex, 'time', e.target.value)}
                                                                className="px-2 py-1 text-sm border rounded"
                                                            />
                                                            <input
                                                                placeholder="Activity"
                                                                value={act.activity}
                                                                onChange={(e) => updateActivity(dIndex, aIndex, 'activity', e.target.value)}
                                                                className="px-2 py-1 text-sm border rounded"
                                                            />
                                                            <div className="flex gap-2 items-center col-span-3 mt-2">
                                                                <select
                                                                    value={act.icon}
                                                                    onChange={(e) => updateActivity(dIndex, aIndex, 'icon', e.target.value)}
                                                                    className="px-2 py-1 text-sm border rounded w-16"
                                                                >
                                                                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                                                                </select>
                                                                <input
                                                                    placeholder="Desc/Details"
                                                                    value={act.description}
                                                                    onChange={(e) => updateActivity(dIndex, aIndex, 'description', e.target.value)}
                                                                    className="px-2 py-1 text-sm border rounded w-full"
                                                                />
                                                                <button type="button" onClick={() => removeActivity(dIndex, aIndex)} className="text-red-500"><X size={14} /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Meals */}
                                                <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                                                    <label className="text-xs font-semibold text-gray-400">Meals</label>
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                        <input
                                                            placeholder="Breakfast"
                                                            value={day.meals?.breakfast || ''}
                                                            onChange={(e) => updateDay(dIndex, 'meals.breakfast', e.target.value)}
                                                            className="px-2 py-1 text-sm border rounded"
                                                        />
                                                        <input
                                                            placeholder="Lunch"
                                                            value={day.meals?.lunch || ''}
                                                            onChange={(e) => updateDay(dIndex, 'meals.lunch', e.target.value)}
                                                            className="px-2 py-1 text-sm border rounded"
                                                        />
                                                        <input
                                                            placeholder="Dinner"
                                                            value={day.meals?.dinner || ''}
                                                            onChange={(e) => updateDay(dIndex, 'meals.dinner', e.target.value)}
                                                            className="px-2 py-1 text-sm border rounded"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Packages Section */}
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <DollarSign size={18} />
                                                Accommodation Packages
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={addPackage}
                                                className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Package
                                            </button>
                                        </div>

                                        {formData.packages?.map((pkg, pIndex) => (
                                            <div key={pIndex} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <h5 className="text-sm font-bold text-gray-500 uppercase">Package #{pIndex + 1}</h5>
                                                    <button type="button" onClick={() => removePackage(pIndex)} className="text-red-500 hover:text-red-700">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <input
                                                    placeholder="Package Name (e.g. Mayapur Stay)"
                                                    value={pkg.name}
                                                    onChange={(e) => updatePackage(pIndex, 'name', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                />
                                                <input
                                                    placeholder="Description (e.g. AC Room, Attach Bath)"
                                                    value={pkg.description}
                                                    onChange={(e) => updatePackage(pIndex, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                />

                                                {/* Pricing Tiers */}
                                                <div className="space-y-2 pl-4 border-l-2 border-gray-100">
                                                    <div className="flex justify-between items-center">
                                                        <label className="text-xs font-semibold text-gray-400">Pricing Tiers</label>
                                                        <button type="button" onClick={() => addPackagePrice(pIndex)} className="text-xs text-blue-600 font-medium flex items-center gap-1">
                                                            <Plus size={12} /> Add Price
                                                        </button>
                                                    </div>
                                                    {pkg.pricing.map((price, prIndex) => (
                                                        <div key={prIndex} className="grid grid-cols-1 md:grid-cols-3 gap-2">
                                                            <input
                                                                placeholder="Type (e.g. Double Sharing)"
                                                                value={price.type}
                                                                onChange={(e) => updatePackagePrice(pIndex, prIndex, 'type', e.target.value)}
                                                                className="px-2 py-1 text-sm border rounded"
                                                            />
                                                            <input
                                                                type="number"
                                                                placeholder="Total Cost"
                                                                value={price.cost}
                                                                onChange={(e) => updatePackagePrice(pIndex, prIndex, 'cost', e.target.value)}
                                                                className="px-2 py-1 text-sm border rounded"
                                                            />
                                                            <div className="flex gap-2">
                                                                <input
                                                                    type="number"
                                                                    placeholder="Per Person"
                                                                    value={price.perPerson}
                                                                    onChange={(e) => updatePackagePrice(pIndex, prIndex, 'perPerson', e.target.value)}
                                                                    className="px-2 py-1 text-sm border rounded w-full"
                                                                />
                                                                <button type="button" onClick={() => removePackagePrice(pIndex, prIndex)} className="text-red-500"><X size={14} /></button>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Custom Packages (Add-ons) Section */}
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <DollarSign size={18} />
                                                Custom Packages (Add-ons)
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={addCustomPackage}
                                                className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Custom Package
                                            </button>
                                        </div>

                                        {formData.customPackages?.map((pkg, cIndex) => (
                                            <div key={cIndex} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
                                                <div className="flex justify-between items-start">
                                                    <h5 className="text-sm font-bold text-gray-500 uppercase">Add-on #{cIndex + 1}</h5>
                                                    <button type="button" onClick={() => removeCustomPackage(cIndex)} className="text-red-500 hover:text-red-700">
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <input
                                                        placeholder="Name (e.g. Prasad Kit)"
                                                        value={pkg.name}
                                                        onChange={(e) => updateCustomPackage(cIndex, 'name', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                    />
                                                    <input
                                                        type="number"
                                                        placeholder="Price (₹)"
                                                        value={pkg.price}
                                                        onChange={(e) => updateCustomPackage(cIndex, 'price', e.target.value)}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                    />
                                                </div>
                                                <input
                                                    placeholder="Description (Optional)"
                                                    value={pkg.description}
                                                    onChange={(e) => updateCustomPackage(cIndex, 'description', e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Instructions Section */}
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <CheckCircle size={18} />
                                                Important Instructions
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={addInstruction}
                                                className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Rule
                                            </button>
                                        </div>
                                        {formData.instructions?.map((inst, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    value={inst}
                                                    onChange={(e) => updateInstruction(index, e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
                                                    placeholder="Enter instruction..."
                                                />
                                                <button type="button" onClick={() => removeInstruction(index)} className="text-red-500"><X size={16} /></button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Includes Section */}
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <CheckCircle size={18} className="text-green-500" />
                                                Yatra Includes
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={addInclude}
                                                className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Item
                                            </button>
                                        </div>
                                        {formData.includes?.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    value={item}
                                                    onChange={(e) => updateInclude(index, e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
                                                    placeholder="Enter included item..."
                                                />
                                                <button type="button" onClick={() => removeInclude(index)} className="text-red-500"><X size={16} /></button>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Excludes Section */}
                                    <div className="p-4 bg-gray-50 rounded-xl space-y-4 border border-gray-100">
                                        <div className="flex justify-between items-center">
                                            <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                                                <XCircle size={18} className="text-red-500" />
                                                Yatra Excludes
                                            </h4>
                                            <button
                                                type="button"
                                                onClick={addExclude}
                                                className="text-sm text-orange-600 font-semibold hover:text-orange-700 flex items-center gap-1"
                                            >
                                                <Plus size={16} /> Add Item
                                            </button>
                                        </div>
                                        {formData.excludes?.map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <input
                                                    value={item}
                                                    onChange={(e) => updateExclude(index, e.target.value)}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none text-sm"
                                                    placeholder="Enter excluded item..."
                                                />
                                                <button type="button" onClick={() => removeExclude(index)} className="text-red-500"><X size={16} /></button>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all scale-100 hover:scale-[1.02] active:scale-95"
                                    >
                                        {editingId ? 'Update Tirth Yatra' : 'Create Tirth Yatra'}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TirthYatraManagement;
