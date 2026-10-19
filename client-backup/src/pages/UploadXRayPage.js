import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../services/api';
import Layout from '../components/Layout';

const UploadXRayPage = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [patientId, setPatientId] = useState('');
    const [imageType, setImageType] = useState('OPG');
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        // Get patientId from query string if available
        const params = new URLSearchParams(location.search);
        const pid = params.get('patientId');
        if (pid) setPatientId(pid);

        fetchPatients();
    }, [location.search]);

    const fetchPatients = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/patients');
            setPatients(response.data.patients);
        } catch (err) {
            setError('Error fetching patients');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError('');
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file || !patientId) {
            setError('Please select a patient and an X-ray image');
            return;
        }

        setUploading(true);
        setError('');
        setSuccess('');

        const formData = new FormData();
        formData.append('xray', file);
        formData.append('patientId', patientId);
        formData.append('imageType', imageType);

        try {
            const response = await axios.post('/xrays/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setSuccess('X-ray uploaded successfully! Analyzing now...');
            
            // Navigate to analysis page after short delay
            setTimeout(() => {
                navigate(`/analysis/${response.data.xray._id}`);
            }, 1500);
        } catch (err) {
            setError(err.response?.data?.message || 'Error uploading X-ray');
            setUploading(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-4xl mx-auto animate-fade-in">
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-2xl bg-sky-100 flex items-center justify-center text-2xl shadow-sm border border-sky-200">
                        📤
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-800 tracking-tight">X-Ray Analysis</h1>
                        <p className="text-slate-500 font-medium">Upload a dental X-ray for AI-powered lesion detection</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                    <div className="lg:col-span-3">
                        <div className="card h-full flex flex-col items-center justify-center min-h-[400px] border-dashed border-2 border-sky-200 bg-sky-50/20 relative group overflow-hidden">
                            {preview ? (
                                <div className="absolute inset-0 flex flex-col">
                                    <img src={preview} alt="Preview" className="w-full h-full object-contain p-4" />
                                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button 
                                            onClick={() => {setFile(null); setPreview(null);}}
                                            className="bg-white/20 backdrop-blur-md text-white border border-white/40 px-6 py-3 rounded-xl font-bold hover:bg-white/30 transition-all"
                                        >
                                            Change Image
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full p-10 group-hover:bg-sky-50/50 transition-all">
                                    <div className="w-24 h-24 rounded-full bg-white shadow-xl flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
                                        📷
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-xl font-bold text-slate-700 mb-2">Click or Drag to Upload</h3>
                                        <p className="text-slate-400 text-sm font-medium">Support JPG, PNG (Max 10MB)</p>
                                    </div>
                                    <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                                </label>
                            )}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <div className="card">
                            <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                                <span className="text-sky-500">⚙️</span>
                                Parameters
                            </h2>

                            {error && (
                                <div className="mb-6 p-4 bg-rose-50 border-l-4 border-rose-500 text-rose-700 rounded-lg animate-fade-in">
                                    <p className="text-xs font-black uppercase tracking-tight">{error}</p>
                                </div>
                            )}

                            {success && (
                                <div className="mb-6 p-4 bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 rounded-lg animate-fade-in">
                                    <p className="text-xs font-black uppercase tracking-tight">{success}</p>
                                </div>
                            )}

                            <form onSubmit={handleUpload} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="label-text">Select Patient</label>
                                    <select
                                        className="input-field"
                                        value={patientId}
                                        onChange={(e) => setPatientId(e.target.value)}
                                        required
                                    >
                                        <option value="">Select a patient...</option>
                                        {patients.map((p) => (
                                            <option key={p._id} value={p._id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="label-text">X-Ray Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {['OPG', 'Bitewing', 'Periapical', 'Other'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setImageType(type)}
                                                className={`py-3 px-4 rounded-xl text-xs font-black transition-all ${imageType === type 
                                                    ? 'bg-sky-600 text-white shadow-lg' 
                                                    : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={uploading || !file || !patientId}
                                    className="btn-primary w-full py-4 text-sm tracking-widest uppercase font-black"
                                >
                                    {uploading ? (
                                        <span className="flex items-center justify-center gap-2 font-black">
                                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Analyzing...
                                        </span>
                                    ) : 'Run AI Detection'}
                                </button>
                                
                                <p className="text-[10px] text-slate-400 font-black text-center uppercase tracking-[0.2em]">
                                    🔒 HIPAA COMPLIANT SYSTEM
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default UploadXRayPage;

