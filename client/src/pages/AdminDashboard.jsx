import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import {
    Users,
    Shield,
    UserCircle,
    Target,
    UserPlus,
    Trash2,
    Search,
    Filter,
    Download,
    Eye,
    Edit,
    CheckCircle,
    XCircle,
    TrendingUp,
    MoreVertical,
    Calendar,
    Clock,
    Book,
    Headphones,
    Moon,
    X
} from 'lucide-react';
import LogoutButton from '../components/LogoutButton';
import TirthYatraManagement from '../components/TirthYatraManagement';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [accountability, setAccountability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [counselorSearchTerm, setCounselorSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [activeTab, setActiveTab] = useState('counselors'); // 'counselors', 'users', 'tirthyatra'
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [selectedUserForView, setSelectedUserForView] = useState(null);
    const [expandedCounselor, setExpandedCounselor] = useState(null);
    const [viewingUserSubmissions, setViewingUserSubmissions] = useState(null);
    const [submissionDateFilter, setSubmissionDateFilter] = useState('');
    const [submissionStartDate, setSubmissionStartDate] = useState('');
    const [submissionEndDate, setSubmissionEndDate] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user',
        counselorId: ''
    });
    const [formError, setFormError] = useState('');
    const [formSuccess, setFormSuccess] = useState('');

    useEffect(() => {
        fetchUsers();
        fetchCounselors();
        fetchAllAccountability();
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

    const fetchCounselors = async () => {
        try {
            const response = await api.get('/users/counselors');
            setCounselors(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching counselors:', error);
            setCounselors([]);
        }
    };

    const fetchAllAccountability = async () => {
        try {
            const response = await api.get('/accountability/all');
            setAccountability(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching accountability:', error);
            setAccountability([]);
        }
    };

    // Helper function to get user count for counselor
    const getUserCountForCounselor = (counselorId) => {
        return users.filter(u => u.counselor?._id === counselorId || u.counselor === counselorId).length;
    };

    // Helper function to get submission count for user
    const getSubmissionCountForUser = (userId) => {
        return accountability.filter(a => a.userId?._id === userId || a.userId === userId).length;
    };

    // Helper function to get user submissions
    const getUserSubmissions = (userId) => {
        return accountability.filter(a => a.userId?._id === userId || a.userId === userId);
    };

    // Filter counselors by search
    const filteredCounselors = counselors.filter(c => {
        if (!counselorSearchTerm) return true;
        const search = counselorSearchTerm.toLowerCase();
        return c.name?.toLowerCase().includes(search) || c.email?.toLowerCase().includes(search);
    });

    // Filter users by search and role
    const filteredUsers = users.filter(u => {
        // Role filter
        if (selectedRole !== 'all' && u.role !== selectedRole) return false;

        // Search filter
        if (!searchTerm) return true;
        const search = searchTerm.toLowerCase();
        return u.name?.toLowerCase().includes(search) || u.email?.toLowerCase().includes(search);
    });

    // Helper function to format time (convert minutes to hours when high)
    const formatTime = (minutes) => {
        if (minutes >= 60) {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
        }
        return `${minutes}m`;
    };

    // Get filtered submissions for a user
    const getFilteredUserSubmissions = (userId) => {
        let filtered = getUserSubmissions(userId);

        if (submissionDateFilter) {
            const filterDate = new Date(submissionDateFilter);
            filtered = filtered.filter(s => {
                const subDate = new Date(s.date);
                return subDate.toDateString() === filterDate.toDateString();
            });
        }

        if (submissionStartDate && submissionEndDate) {
            const start = new Date(submissionStartDate);
            const end = new Date(submissionEndDate);
            filtered = filtered.filter(s => {
                const subDate = new Date(s.date);
                return subDate >= start && subDate <= end;
            });
        }

        return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
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
            // Use create-user endpoint instead of register
            const payload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role
            };

            // Only include counselorId if creating a regular user and counselor is selected
            if (formData.role === 'user' && formData.counselorId) {
                payload.counselorId = formData.counselorId;
            }

            await api.post('/auth/create-user', payload);

            setFormSuccess('User created successfully!');
            setFormData({ name: '', email: '', password: '', role: 'user', counselorId: '' });
            fetchUsers();
            fetchCounselors(); // Refresh counselors list if a new counselor was created

            setTimeout(() => {
                setFormSuccess('');
                setShowCreateForm(false);
            }, 2000);
        } catch (error) {
            setFormError(error.response?.data?.msg || 'Failed to create user');
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            await api.delete(`/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Failed to delete user');
        }
    };

    const statsCards = [
        {
            title: 'Total Users',
            value: users.length,
            icon: <Users className="w-6 h-6" />,
            color: 'bg-gradient-to-br from-sky-500 to-cyan-400',
            change: '+12.5%',
            trend: 'up'
        },
        {
            title: 'Admins',
            value: users.filter(u => u.role === 'admin').length,
            icon: <Shield className="w-6 h-6" />,
            color: 'bg-gradient-to-br from-purple-500 to-violet-400',
            change: '+5.2%',
            trend: 'up'
        },
        {
            title: 'Counselors',
            value: users.filter(u => u.role === 'counselor').length,
            icon: <Target className="w-6 h-6" />,
            color: 'bg-gradient-to-br from-emerald-500 to-green-400',
            change: '+8.7%',
            trend: 'up'
        },
        {
            title: 'Regular Users',
            value: users.filter(u => u.role === 'user').length,
            icon: <UserCircle className="w-6 h-6" />,
            color: 'bg-gradient-to-br from-amber-500 to-orange-400',
            change: '+15.3%',
            trend: 'up'
        },
    ];

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin': return 'bg-gradient-to-r from-purple-100 to-purple-50 text-purple-800 border-l-4 border-purple-500';
            case 'counselor': return 'bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 border-l-4 border-emerald-500';
            default: return 'bg-gradient-to-r from-sky-100 to-cyan-50 text-sky-800 border-l-4 border-sky-500';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))]" />

            <motion.div
                className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <motion.div
                    className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="p-2 bg-gradient-to-br from-purple-500 to-violet-600 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        </div>
                        <p className="text-gray-600 flex items-center gap-2">
                            <span>Welcome back,</span>
                            <span className="font-semibold text-gray-900">{user?.name}</span>
                            <span className="text-gray-400">•</span>
                            <span className="text-sm px-3 py-1 bg-gradient-to-r from-purple-100 to-violet-100 text-purple-700 rounded-full font-medium">
                                Administrator
                            </span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <LogoutButton />
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                    {statsCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -4, scale: 1.02 }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.color} shadow-lg`}>
                                    {stat.icon}
                                </div>
                                <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
                                    <TrendingUp className="w-4 h-4" />
                                    {stat.change}
                                </div>
                            </div>
                            <h3 className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</h3>
                            <p className="text-gray-600 font-medium">{stat.title}</p>
                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <motion.div
                                        className={`h-full ${stat.color.split(' ')[0]} rounded-full`}
                                        initial={{ width: 0 }}
                                        animate={{ width: `${Math.min(100, stat.value * 10)}%` }}
                                        transition={{ duration: 1, delay: index * 0.1 }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs Navigation */}
                <div className="flex gap-4 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                    <button
                        onClick={() => setActiveTab('counselors')}
                        className={`px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === 'counselors'
                            ? 'border-purple-500 text-purple-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Users & Counselors
                    </button>
                    <button
                        onClick={() => setActiveTab('tirthyatra')}
                        className={`px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap ${activeTab === 'tirthyatra'
                            ? 'border-orange-500 text-orange-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Tirth Yatra Management
                    </button>
                </div>

                {activeTab === 'tirthyatra' ? (
                    <TirthYatraManagement />
                ) : (
                    /* User Management Section */
                    <motion.div
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        {/* Section Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">User Management</h2>
                                    <p className="text-gray-600">Manage all user accounts and permissions</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <motion.button
                                        onClick={() => setShowCreateForm(!showCreateForm)}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`group flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition-all duration-300 ${showCreateForm
                                            ? 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white shadow-lg'
                                            : 'bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl'
                                            }`}
                                    >
                                        {showCreateForm ? (
                                            <>
                                                <XCircle className="w-5 h-5" />
                                                Cancel
                                            </>
                                        ) : (
                                            <>
                                                <UserPlus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                                                Create User
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>

                            {/* Search and Filter Bar */}
                            <div className="flex flex-col md:flex-row gap-4 mt-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search users by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none"
                                    />
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            value={selectedRole}
                                            onChange={(e) => setSelectedRole(e.target.value)}
                                            className="pl-12 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none appearance-none"
                                        >
                                            <option value="all">All Roles</option>
                                            <option value="admin">Admins</option>
                                            <option value="counselor">Counselors</option>
                                            <option value="user">Users</option>
                                        </select>
                                    </div>

                                    <button className="flex items-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl font-medium text-gray-700 transition-colors">
                                        <Download className="w-4 h-4" />
                                        Export
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Create User Form */}
                        <AnimatePresence>
                            {showCreateForm && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden border-b border-gray-100"
                                >
                                    <div className="p-6">
                                        <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-inner">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="p-2 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg">
                                                    <UserPlus className="w-6 h-6 text-purple-600" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900">Create New User</h3>
                                            </div>

                                            <form onSubmit={handleCreateUser} className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none hover:border-gray-400"
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
                                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none hover:border-gray-400"
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
                                                            placeholder="Enter password (min. 6 characters)"
                                                            minLength="6"
                                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none hover:border-gray-400"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            Role
                                                        </label>
                                                        <select
                                                            name="role"
                                                            value={formData.role}
                                                            onChange={handleInputChange}
                                                            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none hover:border-gray-400 appearance-none"
                                                        >
                                                            <option value="user">Regular User</option>
                                                            <option value="counselor">Counselor</option>
                                                            <option value="admin">Administrator</option>
                                                        </select>
                                                    </div>
                                                    {formData.role === 'user' && (
                                                        <div>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                Assign Counselor (Optional)
                                                            </label>
                                                            <select
                                                                name="counselorId"
                                                                value={formData.counselorId}
                                                                onChange={handleInputChange}
                                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all outline-none hover:border-gray-400 appearance-none"
                                                            >
                                                                <option value="">No Counselor</option>
                                                                {counselors.map(counselor => (
                                                                    <option key={counselor._id} value={counselor._id}>
                                                                        {counselor.name} ({counselor.email})
                                                                    </option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    )}
                                                </div>

                                                {formError && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="p-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 rounded-xl"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <XCircle className="w-5 h-5" />
                                                            {formError}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                {formSuccess && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: -10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        className="p-4 bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 text-emerald-700 rounded-xl"
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <CheckCircle className="w-5 h-5" />
                                                            {formSuccess}
                                                        </div>
                                                    </motion.div>
                                                )}

                                                <div className="flex justify-end">
                                                    <motion.button
                                                        type="submit"
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        className="bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                                    >
                                                        Create User Account
                                                    </motion.button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Users Table */}
                        <div className="overflow-hidden">
                            {loading ? (
                                <div className="text-center py-16">
                                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-purple-500 border-t-transparent"></div>
                                    <p className="mt-4 text-gray-600 font-medium">Loading users...</p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                                <th className="text-left py-5 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                                    User Details
                                                </th>
                                                <th className="text-left py-5 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                                    Role
                                                </th>
                                                <th className="text-left py-5 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                                    Created
                                                </th>
                                                <th className="text-left py-5 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {filteredUsers.map((u) => (
                                                <motion.tr
                                                    key={u._id}
                                                    className="hover:bg-gray-50 transition-colors group"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                                                >
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center text-gray-700 font-bold text-lg">
                                                                {u.name?.charAt(0) || 'U'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                                                                    {u.name}
                                                                </h4>
                                                                <p className="text-gray-600 text-sm mt-1">{u.email}</p>
                                                                {u.counselor && (
                                                                    <p className="text-emerald-600 text-xs mt-1 flex items-center gap-1">
                                                                        <Target className="w-3 h-3" />
                                                                        Counselor: {u.counselor.name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <span className={`inline-flex items-center px-4 py-2 rounded-lg font-medium text-sm ${getRoleColor(u.role)}`}>
                                                            {u.role === 'admin' && <Shield className="w-4 h-4 mr-2" />}
                                                            {u.role === 'counselor' && <Target className="w-4 h-4 mr-2" />}
                                                            {u.role === 'user' && <UserCircle className="w-4 h-4 mr-2" />}
                                                            {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="text-gray-600">
                                                            <div className="font-medium">
                                                                {new Date(u.createdAt).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric'
                                                                })}
                                                            </div>
                                                            <div className="text-sm text-gray-500">
                                                                {new Date(u.createdAt).toLocaleTimeString('en-US', {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-5 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <button className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                                                                <Eye className="w-4 h-4" />
                                                            </button>
                                                            <button className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <motion.button
                                                                onClick={() => handleDeleteUser(u._id)}
                                                                disabled={u._id === user?.id}
                                                                whileHover={{ scale: u._id !== user?.id ? 1.1 : 1 }}
                                                                whileTap={{ scale: u._id !== user?.id ? 0.95 : 1 }}
                                                                className={`p-2 rounded-lg transition-colors ${u._id === user?.id
                                                                    ? 'text-gray-300 cursor-not-allowed'
                                                                    : 'text-gray-400 hover:text-red-600 hover:bg-red-50'
                                                                    }`}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </motion.button>
                                                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                                                <MoreVertical className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    {filteredUsers.length === 0 && (
                                        <div className="text-center py-16">
                                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                                                <Users className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No users found</h3>
                                            <p className="text-gray-600 max-w-sm mx-auto">
                                                {searchTerm || selectedRole !== 'all'
                                                    ? 'Try adjusting your search or filter criteria'
                                                    : 'No users have been created yet'
                                                }
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {/* Footer Stats */}
                <motion.div
                    className="mt-8 text-center text-gray-500 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p>Last updated: {new Date().toLocaleDateString()} • Total Records: {users.length}</p>
                </motion.div>
            </motion.div>
        </div >
    );
};

export default AdminDashboard;