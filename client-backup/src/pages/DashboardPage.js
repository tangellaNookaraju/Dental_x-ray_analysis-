import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';

const DashboardPage = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        patientsCount: 0,
        xraysCount: 0,
        reportsCount: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await dashboardAPI.getStats();
                // Map API response fields to our local stats state if they differ
                setStats({
                    patientsCount: response.data.stats?.totalPatients || 0,
                    xraysCount: response.data.stats?.totalXrays || 0,
                    reportsCount: response.data.stats?.totalReports || 0,
                    recentActivity: response.data.stats?.recentActivity || []
                });
            } catch (error) {
                console.error('Error fetching dashboard stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const statCards = [
        { label: 'Total Patients', value: stats.patientsCount, icon: '👥', color: 'sky', link: '/patients' },
        { label: 'X-Rays Analyzed', value: stats.xraysCount, icon: '🧬', color: 'teal', link: '/upload' },
        { label: 'Reports Ready', value: stats.reportsCount, icon: '📋', color: 'blue', link: '/patients' },
    ];

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
                    <div className="w-16 h-16 rounded-full border-t-4 border-sky-600 border-r-4 border-transparent animate-spin mb-4"></div>
                    <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Loading CLINIC DATA...</p>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="space-y-10 animate-fade-in pb-20">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-800 tracking-tight leading-none uppercase">
                            Welcome Back, <span className="gradient-dental text-sky-600">Dr. {user?.name?.split(' ')[0] || 'Dentist'}</span>
                        </h1>
                        <p className="text-slate-500 font-bold mt-3 uppercase tracking-[0.2em] text-[10px]">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link to="/upload" className="btn-primary flex items-center gap-3 group px-8">
                            <span className="text-xl group-hover:rotate-12 transition-transform duration-300">✨</span> 
                            <span className="tracking-widest text-xs font-black uppercase">Start Analysis</span>
                        </Link>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {statCards.map((card, i) => (
                        <Link 
                            key={i} 
                            to={card.link}
                            className="card group hover:-translate-y-2 relative overflow-hidden flex flex-col items-center text-center py-12 ring-2 ring-white/50 border-white"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-full -mr-12 -mt-12 transition-transform group-hover:scale-125 opacity-40"></div>
                            <div className="text-6xl mb-6 transform group-hover:scale-110 transition-all duration-500 drop-shadow-sm">{card.icon}</div>
                            <h3 className="text-5xl font-black text-slate-800 mb-1 tracking-tighter">{card.value}</h3>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">{card.label}</p>
                            <div className="w-10 h-1.5 bg-sky-500/20 rounded-full mt-8 transition-all group-hover:w-20 group-hover:bg-sky-500/50"></div>
                        </Link>
                    ))}
                </div>

                {/* Main Dashboard Content */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-8">
                        <div className="flex items-center px-2">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
                                <span className="text-sky-500">🔥</span> Quick Actions
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <Link 
                                to="/add-patient"
                                className="card flex flex-col items-center p-10 hover:bg-sky-600 hover:text-white group transition-all duration-500 border-white ring-2 ring-white/50"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-sky-50 flex items-center justify-center text-3xl group-hover:bg-white/20 mb-6 transition-colors">👤</div>
                                <span className="font-black text-[11px] uppercase tracking-[0.2em] group-hover:text-white">New patient</span>
                            </Link>
                            <Link 
                                to="/upload"
                                className="card flex flex-col items-center p-10 hover:bg-teal-600 hover:text-white group transition-all duration-500 border-white ring-2 ring-white/50"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center text-3xl group-hover:bg-white/20 mb-6 transition-colors">📸</div>
                                <span className="font-black text-[11px] uppercase tracking-[0.2em] group-hover:text-white">run detection</span>
                            </Link>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tight">
                                <span className="text-sky-500">🕐</span> Recent Activity
                            </h2>
                            <button className="text-[10px] font-black uppercase text-sky-600 tracking-[0.2em] hover:underline">View History</button>
                        </div>
                        <div className="card divide-y divide-slate-100 p-0 overflow-hidden ring-2 ring-white/60 border-white transition-all">
                            {stats.recentActivity && stats.recentActivity.length > 0 ? (
                                stats.recentActivity.map((activity, idx) => (
                                    <div key={idx} className="p-6 flex items-start gap-5 hover:bg-white/90 transition-all group">
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-inner border border-white">
                                            {activity.type === 'upload' ? '📸' : '👤'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-black text-slate-800 tracking-tight">{activity.description}</p>
                                            <div className="flex items-center gap-3 mt-2">
                                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest bg-slate-100/50 px-2 py-0.5 rounded">
                                                    {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                                <span className="text-[10px] text-sky-600 font-bold uppercase tracking-tight truncate">{activity.patientName}</span>
                                            </div>
                                        </div>
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="text-sky-500 hover:text-sky-700">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-16 text-center space-y-4">
                                    <div className="text-6xl drop-shadow-sm opacity-50">📭</div>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">No activity detected today</p>
                                    <p className="text-[10px] font-bold text-slate-300 tracking-widest transition-all">Activity stream will update automatically</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default DashboardPage;

