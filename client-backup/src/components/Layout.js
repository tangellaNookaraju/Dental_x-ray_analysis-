import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Layout = ({ children }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/add-patient', label: 'Add Patient', icon: '➕' },
        { path: '/patients', label: 'View Patients', icon: '👥' },
        { path: '/upload', label: 'X-Ray Prediction', icon: '🧬' },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen relative font-sans">
            {/* Global Background Elements */}
            <div className="app-bg"></div>
            <div className="app-overlay"></div>

            {/* Top Navigation */}
            <nav className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-20">
                        <Link to="/dashboard" className="flex items-center group">
                            <span className="text-3xl mr-3 group-hover:rotate-12 transition-transform duration-300">🦷</span>
                            <span className="text-2xl font-black gradient-dental bg-clip-text text-transparent tracking-tighter uppercase">
                                DentAI
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-2 bg-white/40 p-1.5 rounded-2xl border border-white/60">
                            {navItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2.5 ${isActive(item.path)
                                        ? 'bg-white text-sky-600 shadow-md scale-105'
                                        : 'text-slate-600 hover:text-sky-600 hover:bg-white/60'
                                        }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    {item.label}
                                </Link>
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="hidden sm:flex items-center gap-3 bg-white/60 px-4 py-2 rounded-2xl border border-white shadow-sm hover:shadow-md transition-all">
                                <div className="flex flex-col text-right leading-none">
                                    <span className="text-sm font-black text-slate-800">{user?.name || 'User'}</span>
                                    <span className="text-[10px] text-sky-600 font-bold uppercase tracking-widest mt-1">{user?.role || 'Dentist'}</span>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 text-white flex items-center justify-center font-black text-lg shadow-lg ring-2 ring-white transform hover:rotate-6 transition-transform">
                                    {user?.name?.charAt(0) || 'D'}
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all duration-300 border border-white/60 hover:border-rose-100 shadow-sm"
                                title="Logout"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
                {children}
            </main>

            {/* Mobile Navigation */}
            <div className="md:hidden fixed bottom-6 left-6 right-6 glass rounded-2xl shadow-2xl border border-white/60 px-2 py-2 overflow-hidden">
                <div className="flex justify-around items-center h-14">
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full rounded-xl transition-all ${isActive(item.path) ? 'bg-sky-50 text-sky-600' : 'text-slate-500 hover:bg-white/40'
                                }`}
                        >
                            <span className="text-xl">{item.icon}</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Layout;

