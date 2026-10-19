import React from 'react';
import { useParams } from 'react-router-dom';
import Layout from '../components/Layout';

const PatientDetailPage = () => {
    const { id } = useParams();

    return (
        <Layout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Patient Details</h1>
                        <p className="text-gray-500 font-medium tracking-tight">ID: {id}</p>
                    </div>
                </div>

                <div className="card">
                    <p className="text-gray-600 text-center py-12">Patient detail view for <strong>{id}</strong> coming soon...</p>
                </div>
            </div>
        </Layout>
    );
};

export default PatientDetailPage;
