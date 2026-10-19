import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../services/api';
import Layout from '../components/Layout';

const AnalysisPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [analysis, setAnalysis] = useState(null);
    const [xray, setXray] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get X-ray details
                const xResponse = await axios.get(`/xrays/${id}`);
                setXray(xResponse.data.xray);

                // Run/Get analysis
                const aResponse = await axios.post(`/xrays/analyze/${id}`);
                setAnalysis(aResponse.data.predictions);
            } catch (err) {
                setError('Failed to load analysis results.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return (
            <Layout>
                <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
                    <div className="w-24 h-24 rounded-full bg-sky-100 flex items-center justify-center text-5xl mb-6 shadow-sm border border-sky-200">
                        🧬
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 mb-2">AI is Analyzing...</h2>
                    <p className="text-slate-500 font-medium tracking-tight uppercase">Identifying potential dental issues</p>
                </div>
            </Layout>
        );
    }

    const detections = analysis?.detections || [];

    return (
        <Layout>
            <div className="max-w-6xl mx-auto animate-fade-in pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-sky-600 flex items-center justify-center text-3xl shadow-xl ring-4 ring-sky-100 border border-sky-400">
                            ✨
                        </div>
                        <div>
                            <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Diagnosis Results</h1>
                            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em] mt-1">AI-powered diagnostic assistance</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => navigate('/upload')}
                        className="btn-secondary flex items-center gap-2 px-6 shadow-sm hover:shadow-md"
                    >
                        <span>⬅️</span> Back to Upload
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* X-Ray Image */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="card p-4 bg-slate-900 overflow-hidden group shadow-2xl ring-1 ring-slate-800">
                            <div className="relative overflow-hidden rounded-xl bg-black flex items-center justify-center min-h-[400px]">
                                <img 
                                    src={`http://localhost:5000${xray?.imageUrl}`} 
                                    alt="X-Ray" 
                                    className="max-h-[600px] w-auto h-auto rounded-xl object-contain shadow-2xl transition-transform group-hover:scale-[1.03] duration-700"
                                />
                                {detections.map((det, idx) => (
                                    <div 
                                        key={idx}
                                        className="absolute border-2 border-rose-500 bg-rose-500/10 pointer-events-none group-hover:bg-rose-500/20 transition-all shadow-[0_0_15px_rgba(244,63,94,0.4)]"
                                        style={{
                                            left: `${det.boundingBox.x / 1.5}%`,
                                            top: `${det.boundingBox.y / 1.5}%`,
                                            width: `${det.boundingBox.width / 1.2}%`,
                                            height: `${det.boundingBox.height / 1.2}%`,
                                        }}
                                    >
                                        <div className="absolute -top-6 left-0 bg-rose-500 text-white text-[9px] font-black px-2 py-0.5 rounded shadow-lg uppercase tracking-tighter">
                                            {det.lesionType} - {det.confidence}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="card py-6 px-10 flex items-center justify-around bg-white/40 ring-2 ring-white/60">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-sky-50 flex items-center justify-center text-2xl shadow-inner border border-sky-100">👤</div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Patient</p>
                                    <p className="text-base font-black text-slate-800 tracking-tight">{xray?.patientId?.name || 'Loading...'}</p>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-slate-200"></div>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-2xl shadow-inner border border-teal-100">📅</div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Analyzed</p>
                                    <p className="text-base font-black text-slate-800 tracking-tight">{new Date(xray?.uploadDate).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Results Sidebar */}
                    <div className="space-y-8">
                        <div className="card shadow-2xl border-white ring-2 ring-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-sky-50 rounded-full -mr-12 -mt-12 opacity-50"></div>
                            <h3 className="text-2xl font-black text-slate-800 mb-8 flex items-center gap-2 relative z-10">
                                <span className="text-sky-600">🧬</span>
                                AI Analytics
                            </h3>

                            {detections.length === 0 ? (
                                <div className="bg-emerald-50 p-8 rounded-3xl border border-emerald-100 flex flex-col items-center gap-4 text-center">
                                    <span className="text-5xl">🛡️</span>
                                    <p className="text-sm font-black text-emerald-800 tracking-tight leading-relaxed uppercase">Clinical scan shows optimal dental health. No issues detected.</p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {detections.map((det, idx) => (
                                        <div key={idx} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 group hover:border-sky-300 hover:shadow-xl transition-all duration-300">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100">Tooth {det.toothNumber}</span>
                                                    <h4 className="text-xl font-black text-slate-800 mt-4 tracking-tight">{det.lesionType}</h4>
                                                </div>
                                                <div className="text-right">
                                                    <div className="flex flex-col">
                                                        <span className="text-xl font-black text-sky-600">{det.confidence}%</span>
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Probability</span>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 mb-6">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm ring-1 ring-white ${
                                                    det.severity === 'Severe' ? 'bg-rose-100 text-rose-600' : 
                                                    det.severity === 'Moderate' ? 'bg-amber-100 text-amber-600' : 
                                                    'bg-emerald-100 text-emerald-600'
                                                }`}>
                                                    {det.severity} SEVERITY
                                                </span>
                                            </div>

                                            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-inner group-hover:bg-sky-50/50 transition-colors">
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 leading-none">Treatment Protocol</p>
                                                <p className="text-xs font-bold text-slate-700 leading-relaxed uppercase tracking-tight">
                                                    {det.lesionType === 'Caries' ? 'Restorative therapy needed. Assess dental pulp sensitivity.' : 
                                                     det.lesionType === 'Periapical Lesion' ? 'Endodontic eval required. Rule out fractures.' :
                                                     'Clinical examination required to validate digital scan.'}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="card bg-gradient-to-br from-sky-600 to-sky-700 text-white border-none shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                            <h3 className="text-lg font-black mb-6 flex items-center gap-2 relative z-10">
                                <span className="bg-white/20 p-2 rounded-xl">⚙️</span>
                                CLINICAL ACTIONS
                            </h3>
                            <div className="space-y-4 relative z-10">
                                <button className="w-full py-4 bg-white text-sky-600 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95">
                                    GENERATE DENTAL REPORT
                                </button>
                                <button className="w-full py-4 bg-sky-500/30 text-white border border-white/20 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-500/50 transition-all">
                                    SEND TO PATIENT PORTAL
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AnalysisPage;

