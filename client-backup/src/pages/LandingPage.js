import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="min-h-screen relative font-sans overflow-x-hidden">
            {/* Global Background Elements */}
            <div className="app-bg"></div>
            <div className="app-overlay !bg-white/80"></div>

            {/* Premium Navigation */}
            <nav className="glass sticky top-0 z-50 border-b border-white/40 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex justify-between items-center h-24">
                        <div className="flex items-center gap-3">
                            <span className="text-4xl hover:rotate-12 transition-transform duration-300">🦷</span>
                            <span className="text-3xl font-black gradient-dental tracking-tighter uppercase leading-none">
                                DentAI
                            </span>
                        </div>
                        <div className="flex gap-8 items-center">
                            <Link to="/login" className="text-slate-600 font-black uppercase text-[10px] tracking-[0.2em] hover:text-sky-600 transition-colors">
                                Login
                            </Link>
                            <Link to="/register" className="btn-primary px-8 py-3.5 text-[10px] tracking-[0.2em] uppercase font-black shadow-sky-500/20">
                                Get Started
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 pt-24 pb-32">
                <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                    <div className="flex-1 text-center lg:text-left space-y-10 animate-fade-in">
                        <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-sky-50 border border-sky-100 shadow-sm">
                            <span className="flex h-2 w-2 rounded-full bg-sky-500 animate-ping"></span>
                            <span className="text-[10px] font-black text-sky-600 uppercase tracking-[0.2em]">Next-Gen Clinical AI</span>
                        </div>
                        <h1 className="text-6xl md:text-[5.5rem] font-black text-slate-900 leading-[0.85] tracking-tighter uppercase">
                            Visionary <br />
                            <span className="text-sky-600">Dental</span> <br />
                            Care.
                        </h1>
                        <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed italic">
                            Empowering modern practices with deep-learning lesion detection and automated diagnostic protocols.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start pt-6">
                            <Link to="/register" className="btn-primary text-xs px-12 py-5 shadow-2xl hover:translate-y-[-4px] transition-all tracking-[0.2em] uppercase font-black">
                                Join the Practice
                            </Link>
                            <a href="#features" className="btn-secondary text-xs px-12 py-5 flex items-center justify-center gap-2 tracking-[0.2em] uppercase font-black bg-white/50 backdrop-blur-sm">
                                Tech Specs ✨
                            </a>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full max-w-2xl animate-fade-in delay-200">
                        <div className="card !p-2 ring-[12px] ring-white/50 shadow-2xl overflow-hidden bg-slate-900 group border-white">
                            <div className="relative">
                                <img 
                                    src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                                    alt="Modern Clinic" 
                                    className="w-full h-auto rounded-xl opacity-80 group-hover:opacity-100 transition-opacity duration-1000"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-10 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent">
                                    <div className="flex items-center gap-5 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="w-14 h-14 rounded-2xl bg-sky-500 flex items-center justify-center text-3xl shadow-lg ring-4 ring-white/10 animate-pulse">✨</div>
                                        <div>
                                            <p className="text-white font-black uppercase text-[10px] tracking-[0.2em]">Live Analysis Active</p>
                                            <p className="text-sky-300 font-bold text-lg tracking-tight">88% Detection Precision</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="relative z-10 -mt-16 pb-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: 'Precision Rate', value: '92%' },
                            { label: 'Latency Rate', value: '< 1s' },
                            { label: 'Active Dental Units', value: '1.2k' },
                            { label: 'Clinical Standard', value: 'HIPAA' },
                        ].map((stat, i) => (
                            <div key={i} className="card py-12 flex flex-col items-center justify-center text-center hover:bg-white transition-all duration-500 border-white ring-4 ring-white/30 shadow-2xl group">
                                <p className="text-5xl font-black text-slate-800 mb-3 tracking-tighter group-hover:scale-110 transition-transform">{stat.value}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
