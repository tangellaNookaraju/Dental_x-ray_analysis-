import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../services/api';
import Layout from '../components/Layout';

const AddPatientPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        contact: '',
        email: '',
        address: '',
        medicalHistory: '',
        allergies: '',
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();

    const { name, age, gender, contact, email, address, medicalHistory, allergies } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        // Basic validation
        if (!name || !age || !gender || !contact) {
            setError('Please fill in all required fields (Name, Age, Gender, Contact)');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/patients', formData);
            setSuccess('Patient added successfully! Redirecting...');
            setTimeout(() => {
                navigate('/patients');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Error adding patient. Please try again.');
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl shadow-sm border border-sky-200">
                        ➕
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">Add New Patient</h1>
                        <p className="text-slate-500 font-medium">Enter patient details to create a new record</p>
                    </div>
                </div>

                <div className="card">
                    {error && (
                        <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-lg flex items-center gap-3 animate-fade-in">
                            <span className="text-xl">⚠️</span>
                            <p className="font-bold text-sm uppercase tracking-tight">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-lg flex items-center gap-3 animate-fade-in">
                            <span className="text-xl">✅</span>
                            <p className="font-bold text-sm uppercase tracking-tight">{success}</p>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="label-text" htmlFor="name">Full Name *</label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={name}
                                    onChange={onChange}
                                    placeholder="e.g. John Doe"
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="label-text" htmlFor="age">Age *</label>
                                <input
                                    type="number"
                                    id="age"
                                    name="age"
                                    value={age}
                                    onChange={onChange}
                                    placeholder="e.g. 35"
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="label-text" htmlFor="gender">Gender *</label>
                                <select
                                    id="gender"
                                    name="gender"
                                    value={gender}
                                    onChange={onChange}
                                    className="input-field cursor-pointer"
                                    required
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="label-text" htmlFor="contact">Contact Number *</label>
                                <input
                                    type="text"
                                    id="contact"
                                    name="contact"
                                    value={contact}
                                    onChange={onChange}
                                    placeholder="e.g. +1 234 567 8900"
                                    className="input-field"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="label-text" htmlFor="email">Email Address</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={onChange}
                                    placeholder="e.g. john@example.com"
                                    className="input-field"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="label-text" htmlFor="address">Address</label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={address}
                                    onChange={onChange}
                                    placeholder="Street, City, Country"
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="label-text" htmlFor="medicalHistory">Medical History</label>
                            <textarea
                                id="medicalHistory"
                                name="medicalHistory"
                                value={medicalHistory}
                                onChange={onChange}
                                placeholder="Any past surgeries, conditions, or treatments?"
                                className="input-field min-h-[100px] py-3"
                            ></textarea>
                        </div>

                        <div className="space-y-2">
                            <label className="label-text" htmlFor="allergies">Allergies</label>
                            <input
                                type="text"
                                id="allergies"
                                name="allergies"
                                value={allergies}
                                onChange={onChange}
                                placeholder="e.g. Penicillin, Latex"
                                className="input-field"
                            />
                        </div>

                        <div className="pt-4 flex items-center gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary flex-1 py-4 text-lg shadow-sky-200"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : 'Save Patient Record'}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/patients')}
                                className="btn-secondary py-4 text-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default AddPatientPage;
