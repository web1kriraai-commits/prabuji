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
    X,
    MapPin,
    Phone,
    Mail,
    UserCheck,
    MessageSquare
} from 'lucide-react';
import LogoutButton from '../components/LogoutButton';
import TirthYatraManagement from '../components/TirthYatraManagement';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const [users, setUsers] = useState([]);
    const [counselors, setCounselors] = useState([]);
    const [accountability, setAccountability] = useState([]);
    const [yatraRegistrations, setYatraRegistrations] = useState([]);
    const [contactMessages, setContactMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [counselorSearchTerm, setCounselorSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');
    const [activeTab, setActiveTab] = useState('counselors'); // 'counselors', 'users', 'tirthyatra', 'registrations', 'messages'
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [selectedRegistration, setSelectedRegistration] = useState(null);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedUserForView, setSelectedUserForView] = useState(null);
    const [expandedCounselor, setExpandedCounselor] = useState(null);
    const [viewingUserSubmissions, setViewingUserSubmissions] = useState(null);
    const [submissionDateFilter, setSubmissionDateFilter] = useState('');
    const [submissionStartDate, setSubmissionStartDate] = useState('');
    const [submissionEndDate, setSubmissionEndDate] = useState('');
    const [registrationSearchTerm, setRegistrationSearchTerm] = useState('');
    const [messageSearchTerm, setMessageSearchTerm] = useState('');
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
        fetchYatraRegistrations();
        fetchContactMessages();
    }, []);;

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

    const fetchYatraRegistrations = async () => {
        try {
            const response = await api.get('/yatra-registration');
            setYatraRegistrations(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching yatra registrations:', error);
            setYatraRegistrations([]);
        }
    };

    const updateRegistrationStatus = async (regId, status) => {
        try {
            await api.put(`/yatra-registration/${regId}`, { status });
            fetchYatraRegistrations();
        } catch (error) {
            console.error('Error updating registration status:', error);
        }
    };

    const deleteRegistration = async (regId) => {
        if (!window.confirm('Are you sure you want to delete this registration?')) return;
        try {
            await api.delete(`/yatra-registration/${regId}`);
            fetchYatraRegistrations();
        } catch (error) {
            console.error('Error deleting registration:', error);
        }
    };

    const fetchContactMessages = async () => {
        try {
            const response = await api.get('/contact');
            setContactMessages(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching contact messages:', error);
            setContactMessages([]);
        }
    };

    const updateMessageStatus = async (msgId, status) => {
        try {
            await api.put(`/contact/${msgId}`, { status });
            fetchContactMessages();
        } catch (error) {
            console.error('Error updating message status:', error);
        }
    };

    const deleteMessage = async (msgId) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        try {
            await api.delete(`/contact/${msgId}`);
            fetchContactMessages();
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    // Filter contact messages by search
    const filteredRegistrations = yatraRegistrations.filter(reg => {
        if (!registrationSearchTerm) return true;
        const search = registrationSearchTerm.toLowerCase();
        const memberNames = reg.members?.map(m => m.name?.toLowerCase()).join(' ') || '';
        return memberNames.includes(search) ||
            reg.primaryEmail?.toLowerCase().includes(search) ||
            reg.primaryPhone?.includes(search) ||
            reg.yatraTitle?.toLowerCase().includes(search);
    });

    // Filter contact messages by search
    const filteredMessages = contactMessages.filter(msg => {
        if (!messageSearchTerm) return true;
        const search = messageSearchTerm.toLowerCase();
        return msg.name?.toLowerCase().includes(search) ||
            msg.email?.toLowerCase().includes(search) ||
            msg.message?.toLowerCase().includes(search);
    });

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
                    <button
                        onClick={() => setActiveTab('registrations')}
                        className={`px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'registrations'
                            ? 'border-teal-500 text-teal-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Yatra Registrations
                        {yatraRegistrations.length > 0 && (
                            <span className="bg-teal-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {yatraRegistrations.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('messages')}
                        className={`px-6 py-3 font-semibold transition-all border-b-2 whitespace-nowrap flex items-center gap-2 ${activeTab === 'messages'
                            ? 'border-blue-500 text-blue-700'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Contact Messages
                        {contactMessages.length > 0 && (
                            <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                {contactMessages.length}
                            </span>
                        )}
                    </button>
                </div>

                {activeTab === 'tirthyatra' ? (
                    <TirthYatraManagement />
                ) : activeTab === 'registrations' ? (
                    /* Yatra Registrations Section */
                    <motion.div
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-white">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Yatra Registrations</h2>
                                    <p className="text-gray-600">View and manage all yatra registration requests</p>
                                </div>
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, phone or yatra..."
                                        value={registrationSearchTerm}
                                        onChange={(e) => setRegistrationSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {filteredRegistrations.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Contact</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Yatra</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Members</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Payment</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredRegistrations.map((reg) => (
                                            <motion.tr
                                                key={reg._id}
                                                className="hover:bg-gray-50 transition-colors"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                            {reg.members?.[0]?.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{reg.members?.[0]?.name || 'N/A'}</h4>
                                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                                <Mail className="w-3 h-3" />
                                                                {reg.primaryEmail}
                                                            </div>
                                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                                <Phone className="w-3 h-3" />
                                                                {reg.primaryPhone}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-gray-800">{reg.yatraTitle}</div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(reg.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    {/* Display selected packages (Multi-select) */}
                                                    {reg.selectedPackages && reg.selectedPackages.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1 mt-1">
                                                            {reg.selectedPackages.map((pkg, pIdx) => (
                                                                <span key={pIdx} className="inline-block px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                                                                    {pkg.packageName}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : reg.selectedPackage?.packageName ? (
                                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full">
                                                            {reg.selectedPackage.packageName}
                                                        </span>
                                                    ) : null}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm">
                                                        <div className="flex items-center gap-1 text-gray-600 font-medium">
                                                            <Users className="w-3 h-3" />
                                                            {reg.members?.length || 0} member(s)
                                                        </div>
                                                        {reg.members?.slice(0, 2).map((m, idx) => (
                                                            <div key={idx} className="text-xs text-gray-500 pl-4">
                                                                • {m.name} ({m.age}, {m.gender})
                                                            </div>
                                                        ))}
                                                        {reg.members?.length > 2 && (
                                                            <div className="text-xs text-gray-400 pl-4">
                                                                +{reg.members.length - 2} more
                                                            </div>
                                                        )}
                                                        {reg.sameRoomPreference && (
                                                            <span className="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded">
                                                                Same Room
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-center">
                                                        <div className="font-bold text-gray-800">₹{(reg.totalAmount || 0).toLocaleString()}</div>
                                                        <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${reg.paymentStatus === 'verified' ? 'bg-green-100 text-green-700' :
                                                            reg.paymentStatus === 'uploaded' ? 'bg-blue-100 text-blue-700' :
                                                                reg.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                                                                    'bg-yellow-100 text-yellow-700'
                                                            }`}>
                                                            {reg.paymentStatus || 'pending'}
                                                        </span>
                                                        {reg.paymentScreenshot && (
                                                            <a
                                                                href={reg.paymentScreenshot}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block text-xs text-teal-600 hover:underline mt-1"
                                                            >
                                                                View Receipt
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <select
                                                        value={reg.status}
                                                        onChange={(e) => updateRegistrationStatus(reg._id, e.target.value)}
                                                        className={`text-sm font-medium px-3 py-1.5 rounded-lg border-0 cursor-pointer ${reg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            reg.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                                                                reg.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                                                    'bg-red-100 text-red-800'
                                                            }`}
                                                    >
                                                        <option value="pending">Pending</option>
                                                        <option value="contacted">Contacted</option>
                                                        <option value="confirmed">Confirmed</option>
                                                        <option value="cancelled">Cancelled</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={`tel:${reg.primaryPhone}`}
                                                            className="p-2 text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"
                                                            title="Call"
                                                        >
                                                            <Phone className="w-4 h-4" />
                                                        </a>
                                                        <a
                                                            href={`mailto:${reg.primaryEmail}`}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Email"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => setSelectedRegistration(reg)}
                                                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                            title="View Details"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteRegistration(reg._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-teal-100 to-teal-200 rounded-full flex items-center justify-center mb-4">
                                        <UserCheck className="w-10 h-10 text-teal-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No registrations yet</h3>
                                    <p className="text-gray-600">Registrations will appear here when users sign up for yatras.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ) : activeTab === 'messages' ? (
                    /* Contact Messages Section */
                    <motion.div
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                    >
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Messages</h2>
                                    <p className="text-gray-600">View and manage contact form submissions</p>
                                </div>
                                <div className="relative flex-1 max-w-md">
                                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, or message..."
                                        value={messageSearchTerm}
                                        onChange={(e) => setMessageSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            {filteredMessages.length > 0 ? (
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Contact</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Message</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Date</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Status</th>
                                            <th className="text-left py-4 px-6 font-semibold text-gray-700 text-sm uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredMessages.map((msg) => (
                                            <motion.tr
                                                key={msg._id}
                                                className="hover:bg-gray-50 transition-colors"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold">
                                                            {msg.name?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-gray-900">{msg.name}</h4>
                                                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                                <Mail className="w-3 h-3" />
                                                                {msg.email}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <p className="text-gray-700 line-clamp-2">
                                                        {msg.message}
                                                    </p>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(msg.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <select
                                                        value={msg.status}
                                                        onChange={(e) => updateMessageStatus(msg._id, e.target.value)}
                                                        className={`text-sm font-medium px-3 py-1.5 rounded-lg border-0 cursor-pointer ${msg.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                                                            msg.status === 'read' ? 'bg-blue-100 text-blue-800' :
                                                                'bg-green-100 text-green-800'
                                                            }`}
                                                    >
                                                        <option value="new">New</option>
                                                        <option value="read">Read</option>
                                                        <option value="resolved">Resolved</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <a
                                                            href={`mailto:${msg.email}`}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Reply via Email"
                                                        >
                                                            <Mail className="w-4 h-4" />
                                                        </a>
                                                        <button
                                                            onClick={() => setSelectedMessage(msg)}
                                                            className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                                            title="View Full Message"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => deleteMessage(msg._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-16">
                                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mb-4">
                                        <Mail className="w-10 h-10 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No messages yet</h3>
                                    <p className="text-gray-600">Contact form submissions will appear here.</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
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

            {/* Registration Details Modal */}
            <AnimatePresence>
                {selectedRegistration && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-start justify-center p-4 overflow-y-auto pt-24"
                        onClick={() => setSelectedRegistration(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-teal-50 to-white sticky top-0 z-10">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900">Registration Details</h2>
                                    <p className="text-sm text-gray-500">ID: {selectedRegistration._id}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedRegistration(null)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-6">
                                {/* Yatra Info */}
                                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                                    <h3 className="font-semibold text-teal-900 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        Yatra Information
                                    </h3>
                                    <p className="text-lg font-bold text-gray-800">{selectedRegistration.yatraTitle}</p>
                                    <p className="text-sm text-gray-600">
                                        Registered on: {new Date(selectedRegistration.createdAt).toLocaleString()}
                                    </p>
                                </div>

                                {/* Primary Contact */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <UserCircle className="w-4 h-4 text-purple-500" />
                                        Primary Contact
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase">Email</p>
                                            <p className="font-medium text-gray-900">{selectedRegistration.primaryEmail}</p>
                                        </div>
                                        <div className="bg-gray-50 p-3 rounded-lg">
                                            <p className="text-xs text-gray-500 uppercase">Phone</p>
                                            <p className="font-medium text-gray-900">{selectedRegistration.primaryPhone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Info */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                                        Payment Details
                                    </h3>
                                    <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-4 rounded-xl border border-emerald-100">
                                        <div className="flex flex-col gap-3 mb-4">
                                            <div className="flex justify-between items-center">
                                                <p className="text-sm text-emerald-800">Total Yatra Cost</p>
                                                <p className="text-xl font-bold text-emerald-900">₹{(selectedRegistration.totalAmount || 0).toLocaleString()}</p>
                                            </div>

                                            <div className="flex justify-between items-center border-t border-emerald-200/50 pt-2">
                                                <p className="text-sm text-emerald-800">
                                                    Amount Paid
                                                    <span className="text-xs ml-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full">
                                                        {selectedRegistration.paymentType === 'advance' ? 'Advance' : 'Full'}
                                                    </span>
                                                </p>
                                                <p className="text-lg font-semibold text-emerald-700">₹{(selectedRegistration.paymentAmount || 0).toLocaleString()}</p>
                                            </div>

                                            <div className="flex justify-between items-center border-t border-emerald-200 pt-2">
                                                <p className="text-sm font-bold text-gray-700">Balance Due</p>
                                                <p className={`text-xl font-bold ${(selectedRegistration.totalAmount - (selectedRegistration.paymentAmount || 0)) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                    ₹{Math.max(0, (selectedRegistration.totalAmount - (selectedRegistration.paymentAmount || 0))).toLocaleString()}
                                                </p>
                                            </div>

                                            <div className="flex justify-end mt-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${selectedRegistration.paymentStatus === 'verified' ? 'bg-green-200 text-green-800' :
                                                    selectedRegistration.paymentStatus === 'uploaded' ? 'bg-blue-200 text-blue-800' :
                                                        selectedRegistration.paymentStatus === 'failed' ? 'bg-red-200 text-red-800' :
                                                            'bg-yellow-200 text-yellow-800'
                                                    }`}>
                                                    Status: {selectedRegistration.paymentStatus || 'Pending'}
                                                </span>
                                            </div>
                                        </div>
                                        {selectedRegistration.paymentScreenshot && (
                                            <div>
                                                <p className="text-xs text-emerald-700 mb-2 font-semibold">Payment Screenshot:</p>
                                                <a
                                                    href={selectedRegistration.paymentScreenshot}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="block relative group overflow-hidden rounded-lg border border-emerald-200"
                                                >
                                                    <img
                                                        src={selectedRegistration.paymentScreenshot}
                                                        alt="Payment Screenshot"
                                                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                                        <span className="opacity-0 group-hover:opacity-100 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-800 shadow-sm transition-opacity">
                                                            Click to View Full
                                                        </span>
                                                    </div>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Members */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <Users className="w-4 h-4 text-blue-500" />
                                        Members ({selectedRegistration.members?.length || 0})
                                    </h3>
                                    <div className="space-y-3">
                                        {selectedRegistration.members?.map((member, idx) => (
                                            <div key={idx} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex flex-col sm:flex-row justify-between gap-4">
                                                    <div>
                                                        <h4 className="font-bold text-gray-800">{member.name}</h4>
                                                        <div className="text-sm text-gray-500 mt-1 flex flex-wrap gap-3">
                                                            <span>Age: {member.age}</span>
                                                            <span>•</span>
                                                            <span>Gender: {member.gender}</span>
                                                            {member.mobileNumber && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>Ph: {member.mobileNumber}</span>
                                                                </>
                                                            )}
                                                            {member.city && (
                                                                <>
                                                                    <span>•</span>
                                                                    <span>City: {member.city}</span>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {member.aadhaarCard && (
                                                        <a
                                                            href={member.aadhaarCard.replace(/^http:\/\//i, 'https://')}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            download={member.aadhaarCard.toLowerCase().endsWith('.pdf') ? "aadhaar.pdf" : "aadhaar.jpg"}
                                                            className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-lg transition-colors self-start whitespace-nowrap"
                                                        >
                                                            <div className="w-8 h-8 rounded bg-blue-200/50 flex items-center justify-center">
                                                                {member.aadhaarCard.toLowerCase().endsWith('.pdf') ? (
                                                                    <Book className="w-4 h-4" />
                                                                ) : (
                                                                    <div className="w-full h-full overflow-hidden rounded">
                                                                        <img src={member.aadhaarCard.replace(/^http:\/\//i, 'https://')} className="w-full h-full object-cover" alt="prev" />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {member.aadhaarCard.toLowerCase().endsWith('.pdf') ? 'View PDF' : 'View Image'}
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {selectedRegistration.sameRoomPreference && (
                                        <div className="mt-3 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2">
                                            <Users className="w-4 h-4" />
                                            Preference: All members in same room
                                        </div>
                                    )}
                                    {selectedRegistration.accommodationNotes && (
                                        <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                            <span className="font-medium text-gray-800">Accommodation Notes:</span> {selectedRegistration.accommodationNotes}
                                        </div>
                                    )}
                                </div>

                                {/* Custom Packages (Add-ons) */}
                                {selectedRegistration.selectedCustomPackages && selectedRegistration.selectedCustomPackages.length > 0 && (
                                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                                        <h3 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                                            <Target className="w-4 h-4" />
                                            Selected Add-ons (Custom Packages)
                                        </h3>
                                        <div className="space-y-2">
                                            {selectedRegistration.selectedCustomPackages.map((pkg, idx) => (
                                                <div key={idx} className="bg-white p-3 rounded-lg border border-orange-200 flex justify-between items-center shadow-sm">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{pkg.name}</p>
                                                        {pkg.description && <p className="text-xs text-gray-500">{pkg.description}</p>}
                                                    </div>
                                                    <div className="text-orange-700 font-bold">
                                                        ₹{pkg.price}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Travel & Package */}
                                {(selectedRegistration.selectedTrain || selectedRegistration.selectedPackage) && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {selectedRegistration.selectedTrain && (
                                            <div className="border border-gray-100 rounded-xl p-4">
                                                <h3 className="font-semibold text-gray-900 mb-2">Train Preference</h3>
                                                <div className="text-sm text-gray-600">
                                                    <p><span className="font-medium">Train:</span> {selectedRegistration.selectedTrain.trainName}</p>
                                                    <p><span className="font-medium">Number:</span> {selectedRegistration.selectedTrain.trainNumber}</p>
                                                    <p><span className="font-medium">Class:</span> {selectedRegistration.selectedTrain.classCategory}</p>
                                                    {selectedRegistration.selectedTrain.price && (
                                                        <p><span className="font-medium">Price:</span> ₹{selectedRegistration.selectedTrain.price}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                        {/* Multi-select Packages Display */}
                                        {(selectedRegistration.selectedPackages && selectedRegistration.selectedPackages.length > 0) ? (
                                            <div className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                                                <h3 className="font-semibold text-gray-900 mb-3">Packages Selected</h3>
                                                <div className="space-y-3">
                                                    {selectedRegistration.selectedPackages.map((pkg, idx) => (
                                                        <div key={idx} className="bg-white p-3 rounded-lg border border-gray-200">
                                                            <p className="font-medium text-purple-700">{pkg.packageName}</p>
                                                            {pkg.description && <p className="text-xs text-gray-500 mb-1">{pkg.description}</p>}
                                                            <div className="text-sm text-gray-600 grid grid-cols-2 gap-2 mt-2">
                                                                {pkg.pricingType && <p>Type: <span className="font-medium">{pkg.pricingType}</span></p>}
                                                                {(pkg.pricePerPerson || pkg.cost) && (
                                                                    <p>Price/Person: <span className="font-medium">₹{pkg.pricePerPerson || pkg.cost}</span></p>
                                                                )}
                                                                {pkg.totalCost && (
                                                                    <p className="col-span-2 font-bold text-gray-800">Total: ₹{pkg.totalCost}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ) : selectedRegistration.selectedPackage && (
                                            <div className="border border-gray-100 rounded-xl p-4">
                                                <h3 className="font-semibold text-gray-900 mb-2">Package Selected</h3>
                                                <div className="text-sm text-gray-600">
                                                    <p className="font-medium text-purple-700">{selectedRegistration.selectedPackage.packageName}</p>
                                                    {selectedRegistration.selectedPackage.pricingType && (
                                                        <p>Type: {selectedRegistration.selectedPackage.pricingType}</p>
                                                    )}
                                                    {selectedRegistration.selectedPackage.pricePerPerson && (
                                                        <p className="mt-1">Price per person: ₹{selectedRegistration.selectedPackage.pricePerPerson}</p>
                                                    )}
                                                    {selectedRegistration.selectedPackage.totalCost && (
                                                        <p className="mt-1 font-bold">Total Cost: ₹{selectedRegistration.selectedPackage.totalCost}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Suggestions */}
                                {selectedRegistration.suggestions && (
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Suggestions/Notes</h3>
                                        <div className="bg-orange-50 text-orange-800 p-4 rounded-xl text-sm border border-orange-100">
                                            {selectedRegistration.suggestions}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end">
                                <button
                                    onClick={() => setSelectedRegistration(null)}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* Contact Message Detail Modal */}
                {selectedMessage && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
                        style={{ paddingTop: '90px' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedMessage(null)}
                    >
                        <motion.div
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-y-auto"
                            style={{ maxHeight: 'calc(100vh - 120px)' }}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Contact Message</h2>
                                        <p className="text-sm text-gray-600">
                                            Received on {new Date(selectedMessage.createdAt).toLocaleString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setSelectedMessage(null)}
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X className="w-5 h-5 text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Contact Info */}
                                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-5 border border-blue-100">
                                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <UserCircle className="w-5 h-5 text-blue-500" />
                                        Contact Information
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0">
                                                {selectedMessage.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{selectedMessage.name}</p>
                                                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                                    <Mail className="w-4 h-4" />
                                                    <a href={`mailto:${selectedMessage.email}`} className="hover:text-blue-600 transition-colors">
                                                        {selectedMessage.email}
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Message Content */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                        <MessageSquare className="w-5 h-5 text-purple-500" />
                                        Message
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                                        <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Status */}
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-3">Status</h3>
                                    <select
                                        value={selectedMessage.status}
                                        onChange={(e) => {
                                            updateMessageStatus(selectedMessage._id, e.target.value);
                                            setSelectedMessage({ ...selectedMessage, status: e.target.value });
                                        }}
                                        className={`w-full text-sm font-medium px-4 py-3 rounded-xl border-0 cursor-pointer ${selectedMessage.status === 'new' ? 'bg-yellow-100 text-yellow-800' :
                                            selectedMessage.status === 'read' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                            }`}
                                    >
                                        <option value="new">New</option>
                                        <option value="read">Read</option>
                                        <option value="resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-between">
                                <a
                                    href={`mailto:${selectedMessage.email}`}
                                    className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                                >
                                    <Mail className="w-4 h-4" />
                                    Reply via Email
                                </a>
                                <button
                                    onClick={() => setSelectedMessage(null)}
                                    className="px-6 py-2.5 bg-white border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                >
                                    Close
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div >
    );
};

export default AdminDashboard;