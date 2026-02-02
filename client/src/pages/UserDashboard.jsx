import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import LogoutButton from '../components/LogoutButton';

const UserDashboard = () => {
    const { user, logout } = useAuth();

    const accountabilityStats = [
        { title: 'Days Active', value: '45', icon: '📅', color: 'bg-sky-blue' },
        { title: 'Total Sessions', value: '23', icon: '🎯', color: 'bg-soft-green' },
        { title: 'Current Streak', value: '12', icon: '🔥', color: 'bg-primary/20' },
        { title: 'Next Session', value: '2 days', icon: '⏰', color: 'bg-lavender/50' },
    ];

    const recentActivities = [
        { title: 'Completed Daily Check-in', date: 'Today', time: '9:00 AM', status: 'Completed' },
        { title: 'Session with Counselor', date: 'Yesterday', time: '3:00 PM', status: 'Completed' },
        { title: 'Weekly Report Submitted', date: '3 days ago', time: '10:30 AM', status: 'Completed' },
        { title: 'Upcoming Session', date: 'In 2 days', time: '2:00 PM', status: 'Scheduled' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-blue/10 via-white to-soft-green/10">
            <motion.div
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-semibold text-gray-900 mb-2">My Dashboard</h1>
                        <p className="text-gray-600">Welcome back, {user?.name}!</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-sky-blue text-gray-800 px-5 py-2.5 rounded-full shadow-md">
                            <span className="text-xl">👤</span>
                            <span className="font-semibold">Member</span>
                        </div>
                        <LogoutButton />
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {accountabilityStats.map((stat, index) => (
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

                {/* User Profile Card */}
                <motion.div
                    className="bg-white rounded-3xl shadow-md p-6 border border-gray-100 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Profile Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Full Name</label>
                            <div className="bg-gradient-to-r from-sky-blue/20 to-soft-green/10 p-3 rounded-xl">
                                <p className="text-gray-900 font-medium">{user?.name}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Email Address</label>
                            <div className="bg-gradient-to-r from-sky-blue/20 to-soft-green/10 p-3 rounded-xl">
                                <p className="text-gray-900 font-medium">{user?.email}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Role</label>
                            <div className="bg-gradient-to-r from-sky-blue/20 to-soft-green/10 p-3 rounded-xl">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-blue text-blue-900">
                                    {user?.role}
                                </span>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">Member Since</label>
                            <div className="bg-gradient-to-r from-sky-blue/20 to-soft-green/10 p-3 rounded-xl">
                                <p className="text-gray-900 font-medium">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Recent Activities */}
                <motion.div
                    className="bg-white rounded-3xl shadow-md p-6 border border-gray-100"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                >
                    <h2 className="text-2xl font-semibold text-gray-900 mb-6">Recent Activities</h2>
                    <div className="space-y-4">
                        {recentActivities.map((activity, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-white to-sky-blue/10 rounded-2xl hover:shadow-md transition-all duration-300 border border-gray-100"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="flex-1">
                                    <p className="font-semibold text-gray-900">{activity.title}</p>
                                    <p className="text-sm text-gray-600">
                                        {activity.date} at {activity.time}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full text-sm font-semibold ${activity.status === 'Completed'
                                    ? 'bg-soft-green text-green-900'
                                    : 'bg-sky-blue text-blue-900'
                                    }`}>
                                    {activity.status}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default UserDashboard;
