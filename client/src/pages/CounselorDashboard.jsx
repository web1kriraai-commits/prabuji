import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import {
    Users,
    UserPlus,
    CheckCircle,
    XCircle,
    ChevronDown,
    ChevronUp,
    Calendar,
    Clock,
    Book,
    Headphones,
    Target,
    Eye,
    X,
    Search,
    Filter,
    Moon
} from 'lucide-react';
import LogoutButton from '../components/LogoutButton';

const CounselorDashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [accountability, setAccountability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [expandedUser, setExpandedUser] = useState(null);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [hoveredUser, setHoveredUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchAccountability();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/users');
            setUsers(Array.isArray(response.data) ? response.data : []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching users:', error);
            setUsers([]);
            setLoading(false);
        }
    };

    const fetchAccountability = async () => {
        try {
            const response = await api.get('/accountability/my-users');
            setAccountability(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching accountability:', error);
            setAccountability([]);
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        setFormError('');
        setFormSuccess('');

        try {
            await api.post('/auth/create-user', {
                ...formData,
                role: 'user' // Counselors can only create regular users
            });

            setFormSuccess('User created successfully!');
            setFormData({ name: '', email: '', password: '' });
            fetchUsers();

            setTimeout(() => {
                setFormSuccess('');
                setShowCreateForm(false);
            }, 2000);
        } catch (error) {
            setFormError(error.response?.data?.msg || 'Failed to create user');
        }
    };

    const getUserSubmissions = (userId) => {
        let filtered = accountability.filter(a => a.userId?._id === userId);

        // Apply date filters
        if (dateFilter) {
            const filterDate = new Date(dateFilter);
            filtered = filtered.filter(a => {
                const subDate = new Date(a.date);
                return subDate.toDateString() === filterDate.toDateString();
            });
        }

        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            filtered = filtered.filter(a => {
                const subDate = new Date(a.date);
                return subDate >= start && subDate <= end;
            });
        }

        return filtered;
    };

    // Filter users based on search term
    const filteredUsers = users.filter(u => {
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return u.name?.toLowerCase().includes(search) || u.email?.toLowerCase().includes(search);
    });

    const statsCards = [
        {
            title: 'Assigned Users',
            value: users.length,
            icon: '👥',
            color: 'bg-sky-blue'
        },
        {
            title: 'Total Submissions',
            value: accountability.length,
            icon: '📝',
            color: 'bg-soft-green'
        },
        {
            title: 'This Week',
            value: accountability.filter(a => {
                const date = new Date(a.date);
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                return date >= weekAgo;
            }).length,
            icon: '📊',
            color: 'bg-lavender/50'
        },
        {
            title: 'Active Today',
            value: accountability.filter(a => {
                const date = new Date(a.date);
                const today = new Date();
                return date.toDateString() === today.toDateString();
            }).length,
            icon: '✅',
            color: 'bg-primary/20'
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-soft-green/10 via-white to-lavender/10">
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-semibold text-gray-900 mb-2">Counselor Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {user?.name}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-soft-green text-gray-800 px-5 py-2.5 rounded-full shadow-md">
                            <span className="text-xl">🎯</span>
                            <span className="font-semibold">Counselor</span>
                        </div>
                        <LogoutButton />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="bg-white rounded-3xl shadow-md p-6 border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-14 h-14 ${stat.color} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 font-medium">{stat.title}</p>
                                    <h3 className="text-3xl font-semibold text-gray-900">{stat.value}</h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Create User Section */}
                <motion.div
                    className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">User Management</h2>
                        <motion.button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${showCreateForm
                                ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white'
                                : 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                                }`}
                        >
                            {showCreateForm ? (
                                <>
                                    <XCircle className="w-5 h-5" />
                                    Cancel
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-5 h-5" />
                                    Create New User
                                </>
                            )}
                        </motion.button>
                    </div>

                    {/* Create User Form */}
                    <AnimatePresence>
                        {showCreateForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <form onSubmit={handleCreateUser} className="space-y-4 p-6 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter full name"
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Email Address
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter email address"
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                Password
                                            </label>
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                                placeholder="Enter password"
                                                minLength="6"
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                            />
                                        </div>
                                    </div>

                                    {formError && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-2"
                                        >
                                            <XCircle className="w-5 h-5" />
                                            {formError}
                                        </motion.div>
                                    )}

                                    {formSuccess && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2"
                                        >
                                            <CheckCircle className="w-5 h-5" />
                                            {formSuccess}
                                        </motion.div>
                                    )}

                                    <div className="flex justify-end">
                                        <motion.button
                                            type="submit"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="bg-gradient-to-r from-emerald-500 to-green-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                        >
                                            Create User
                                        </motion.button>
                                    </div>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Detailed Accountability Modal */}
                <AnimatePresence>
                    {selectedSubmission && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedSubmission(null)}
                        >
                            <motion.div
                                className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
                                initial={{ scale: 0.9, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.9, y: 20 }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gradient-to-r from-emerald-50 to-green-50">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Sadhana Report Details</h2>
                                        <p className="text-gray-600 mt-1">
                                            {selectedSubmission.userId?.name} • {new Date(selectedSubmission.date).toLocaleDateString('en-US', {
                                                weekday: 'long',
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedSubmission(null)}
                                        className="p-2 hover:bg-white rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-600" />
                                    </button>
                                </div>

                                <div className="p-6 space-y-6">
                                    {/* Time Schedule */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clock className="w-5 h-5 text-amber-600" />
                                                <h3 className="font-semibold text-gray-900">Wake Up Time</h3>
                                            </div>
                                            <p className="text-2xl font-bold text-amber-700">{selectedSubmission.wakeupTime}</p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Moon className="w-5 h-5 text-indigo-600" />
                                                <h3 className="font-semibold text-gray-900">Bed Time</h3>
                                            </div>
                                            <p className="text-2xl font-bold text-indigo-700">{selectedSubmission.bedTime}</p>
                                        </div>
                                    </div>

                                    {/* Sadhana Metrics */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div className="p-4 bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl border border-emerald-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Target className="w-5 h-5 text-emerald-600" />
                                                <h3 className="font-semibold text-gray-900">Chanting Rounds</h3>
                                            </div>
                                            <p className="text-3xl font-bold text-emerald-700">{selectedSubmission.chantingRounds}</p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Book className="w-5 h-5 text-purple-600" />
                                                <h3 className="font-semibold text-gray-900">Book Reading</h3>
                                            </div>
                                            <p className="text-3xl font-bold text-purple-700">{selectedSubmission.bookReading} <span className="text-lg">min</span></p>
                                        </div>
                                        <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Headphones className="w-5 h-5 text-blue-600" />
                                                <h3 className="font-semibold text-gray-900">Hearing</h3>
                                            </div>
                                            <p className="text-3xl font-bold text-blue-700">{selectedSubmission.hearingMinutes} <span className="text-lg">min</span></p>
                                        </div>
                                    </div>

                                    {/* Deity Prayer */}
                                    <div className="p-4 bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl border border-yellow-200">
                                        <h3 className="font-semibold text-gray-900 mb-2">Deity Prayer</h3>
                                        <p className="text-lg font-medium text-gray-700">{selectedSubmission.deityPrayer || 'Not specified'}</p>
                                    </div>

                                    {/* Lectures Heard */}
                                    {selectedSubmission.lectureBy && selectedSubmission.lectureBy.length > 0 && (
                                        <div className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200">
                                            <h3 className="font-semibold text-gray-900 mb-3">Lectures Heard From</h3>
                                            <div className="flex flex-wrap gap-2">
                                                {selectedSubmission.lectureBy.map((lecture, idx) => (
                                                    <span key={idx} className="px-3 py-1 bg-white border border-rose-300 rounded-full text-sm font-medium text-rose-700">
                                                        {lecture}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Individual Vows */}
                                    {selectedSubmission.individualVows && (
                                        <div className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 rounded-xl border border-gray-200">
                                            <h3 className="font-semibold text-gray-900 mb-2">Individual Vows</h3>
                                            <p className="text-gray-700 whitespace-pre-wrap">{selectedSubmission.individualVows}</p>
                                        </div>
                                    )}

                                    {/* Submission Info */}
                                    <div className="pt-4 border-t border-gray-200">
                                        <p className="text-sm text-gray-500">
                                            Submitted on {new Date(selectedSubmission.submittedAt).toLocaleString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Assigned Users */}
                <motion.div
                    className="bg-white rounded-3xl shadow-md p-6 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-semibold text-gray-900">My Assigned Users</h2>
                    </div>

                    {/* Search and Filters */}
                    <div className="mb-6 space-y-4">
                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search users by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                            />
                        </div>

                        {/* Date Filters */}
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Specific Date
                                </label>
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => {
                                        setDateFilter(e.target.value);
                                        setStartDate('');
                                        setEndDate('');
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    From Date
                                </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => {
                                        setStartDate(e.target.value);
                                        setDateFilter('');
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                />
                            </div>
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    To Date
                                </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => {
                                        setEndDate(e.target.value);
                                        setDateFilter('');
                                    }}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all outline-none"
                                />
                            </div>
                            {(dateFilter || startDate || endDate) && (
                                <div className="flex items-end">
                                    <button
                                        onClick={() => {
                                            setDateFilter('');
                                            setStartDate('');
                                            setEndDate('');
                                        }}
                                        className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {loading ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
                            <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-16">
                            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
                            <p className="text-gray-600">{searchTerm ? 'Try adjusting your search' : 'Create your first user to get started'}</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredUsers.map((assignedUser, index) => {
                                const userSubmissions = getUserSubmissions(assignedUser._id);
                                const isExpanded = expandedUser === assignedUser._id;
                                const isHovered = hoveredUser === assignedUser._id;

                                return (
                                    <motion.div
                                        key={assignedUser._id}
                                        className="border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-all duration-300 relative"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        onMouseEnter={() => setHoveredUser(assignedUser._id)}
                                        onMouseLeave={() => setHoveredUser(null)}
                                    >
                                        <div
                                            className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-soft-green/10 cursor-pointer"
                                            onClick={() => setExpandedUser(isExpanded ? null : assignedUser._id)}
                                        >
                                            <div className="flex items-center gap-4 flex-1">
                                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-xl">
                                                    {assignedUser.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{assignedUser.name}</p>
                                                    <span className="text-sm text-gray-600">{assignedUser.email}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                {/* View Button on Hover */}
                                                <AnimatePresence>
                                                    {isHovered && userSubmissions.length > 0 && (
                                                        <motion.button
                                                            initial={{ opacity: 0, scale: 0.8 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.8 }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedSubmission(userSubmissions[0]);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors shadow-md"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                            View Latest
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>
                                                <span className="px-4 py-2 rounded-full text-sm font-semibold bg-soft-green text-green-900">
                                                    {userSubmissions.length} Submission{userSubmissions.length !== 1 ? 's' : ''}
                                                </span>
                                                {isExpanded ? (
                                                    <ChevronUp className="w-5 h-5 text-gray-400" />
                                                ) : (
                                                    <ChevronDown className="w-5 h-5 text-gray-400" />
                                                )}
                                            </div>
                                        </div>

                                        {/* User Submissions */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="border-t border-gray-200 bg-gray-50"
                                                >
                                                    {userSubmissions.length === 0 ? (
                                                        <div className="p-8 text-center text-gray-500">
                                                            No accountability submissions yet
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 space-y-3">
                                                            {userSubmissions.slice(0, 5).map((submission) => (
                                                                <div
                                                                    key={submission._id}
                                                                    className="bg-white p-4 rounded-xl border border-gray-200"
                                                                >
                                                                    <div className="flex items-center justify-between mb-3">
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setSelectedSubmission(submission);
                                                                            }}
                                                                            className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors text-xs font-semibold"
                                                                        >
                                                                            <Eye className="w-3 h-3" />
                                                                            View Details
                                                                        </button>
                                                                        <div className="flex items-center gap-4">
                                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                <Calendar className="w-4 h-4" />
                                                                                {new Date(submission.date).toLocaleDateString('en-US', {
                                                                                    month: 'short',
                                                                                    day: 'numeric',
                                                                                    year: 'numeric'
                                                                                })}
                                                                            </div>
                                                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                                                <Clock className="w-4 h-4" />
                                                                                {new Date(submission.submittedAt).toLocaleTimeString('en-US', {
                                                                                    hour: '2-digit',
                                                                                    minute: '2-digit'
                                                                                })}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                                                        <div className="flex items-center gap-2">
                                                                            <Target className="w-4 h-4 text-emerald-600" />
                                                                            <span className="text-gray-600">Rounds:</span>
                                                                            <span className="font-semibold">{submission.chantingRounds}</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Book className="w-4 h-4 text-purple-600" />
                                                                            <span className="text-gray-600">Reading:</span>
                                                                            <span className="font-semibold">{submission.bookReading} min</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Headphones className="w-4 h-4 text-blue-600" />
                                                                            <span className="text-gray-600">Hearing:</span>
                                                                            <span className="font-semibold">{submission.hearingMinutes} min</span>
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Clock className="w-4 h-4 text-amber-600" />
                                                                            <span className="text-gray-600">Wake:</span>
                                                                            <span className="font-semibold">{submission.wakeupTime}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
};

export default CounselorDashboard;
