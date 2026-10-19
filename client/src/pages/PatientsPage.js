import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import Layout from '../components/Layout';

const PatientsPage = () => {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const fetchPatients = async (query = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`/patients?search=${query}`);
            setPatients(response.data.patients);
            setError('');
        } catch (err) {
            setError('Error fetching patients. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            fetchPatients(search);
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [search]);

    return (
        <Layout>
            <div className="space-y-8 animate-fade-in">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <span className="text-3xl">👥</span>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Patient Records</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage and view all registered patients in the clinic</p>
                    </div>

                    <Link
                        to="/add-patient"
                        className="btn-primary flex items-center justify-center gap-2.5 py-3 shadow-sky-100"
                    >
                        <span className="text-xl">➕</span>
                        <span>Register New Patient</span>
                    </Link>
                </div>

                {/* Search Bar */}
                <div className="relative group max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none group-focus-within:text-sky-500 transition-colors">
                        <svg className="h-6 w-6 text-slate-400 group-focus-within:text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search patients by name or contact..."
                        className="input-field pl-12 py-4 shadow-sm group-hover:shadow-md focus:bg-white"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {error && (
                    <div className="p-6 bg-rose-50 border-2 border-rose-100 rounded-3xl text-rose-700 flex items-center gap-4">
                        <span className="text-2xl">🚨</span>
                        <p className="font-bold tracking-tight">{error}</p>
                    </div>
                )}

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="card h-[250px] animate-pulse bg-white/40">
                                <div className="h-4 bg-slate-200 rounded-full w-3/4 mb-4"></div>
                                <div className="h-3 bg-slate-200 rounded-full w-1/2 mb-2"></div>
                                <div className="h-3 bg-slate-200 rounded-full w-2/3 mb-6"></div>
                                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
                            </div>
                        ))}
                    </div>
                ) : patients.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {patients.map((patient) => (
                            <div
                                key={patient._id}
                                className="card group hover:-translate-y-2 p-0 overflow-hidden"
                            >
                                <div className="p-8 pb-4">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-50 to-teal-50 flex items-center justify-center text-3xl shadow-inner ring-1 ring-white/50">
                                            {patient.gender === 'Male' ? '👨' : patient.gender === 'Female' ? '👩' : '👤'}
                                        </div>
                                        <div className="bg-white/80 rounded-full px-4 py-1.5 border border-slate-100 shadow-sm flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Active</span>
                                        </div>
                                    </div>

                                    <h3 className="text-xl font-black text-slate-800 mb-1 truncate">{patient.name}</h3>
                                    <p className="text-sm font-bold text-sky-600 mb-4">{patient.age} years old • {patient.gender}</p>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-600">
                                            <span className="text-lg">📱</span>
                                            <span className="text-sm font-semibold tracking-tight">{patient.contact}</span>
                                        </div>
                                        {patient.medicalHistory && (
                                            <div className="flex items-start gap-3 text-slate-500 bg-slate-50/50 p-3 rounded-xl border border-slate-100 group-hover:bg-sky-50/30 transition-colors">
                                                <span className="text-lg">📜</span>
                                                <span className="text-xs font-medium line-clamp-2">{patient.medicalHistory}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 bg-slate-50/50 border-t border-slate-100 mt-4 flex items-center gap-3">
                                    <button
                                        onClick={() => navigate(`/patient/${patient._id}`)}
                                        className="btn-secondary flex-1 py-3 text-xs tracking-wider uppercase font-black hover:bg-white"
                                    >
                                        View Details
                                    </button>
                                    <button
                                        onClick={() => navigate(`/upload?patientId=${patient._id}`)}
                                        className="btn-primary px-4 py-3 flex items-center justify-center"
                                        title="Analyze X-Ray"
                                    >
                                        <span className="text-xl">🧬</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="card text-center py-20 bg-white/50 ring-2 ring-white/80 border-dashed border-sky-200">
                        <div className="text-6xl mb-6">🔍</div>
                        <h3 className="text-2xl font-black text-slate-800 mb-2">No Patients Found</h3>
                        <p className="text-slate-500 max-w-md mx-auto font-medium">We couldn't find any patient matching your criteria. Try adjusting your search or add a new patient.</p>
                        <Link to="/add-patient" className="btn-primary inline-flex mt-8 px-10">
                            Register First Patient
                        </Link>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default PatientsPage;

