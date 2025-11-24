import React, { useEffect, useState } from 'react';
import { api } from '../api';

export default function ResultsScreen({ sessionId, onRestart }) {
    const [clubs, setClubs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecommendations() {
            try {
                const data = await api.getRecommendations(sessionId);
                setClubs(data);
            } catch (error) {
                console.error("Failed to fetch recommendations", error);
            } finally {
                setLoading(false);
            }
        }
        fetchRecommendations();
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Your Perfect Matches
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        Based on your answers, here are the clubs we think you'll love!
                    </p>
                </div>

                <div className="space-y-6">
                    {clubs.map((club, index) => (
                        <div
                            key={club.id}
                            className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
                        >
                            <div className="p-6 sm:p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-2xl font-bold text-gray-900">{club.name}</h3>
                                    {index === 0 && (
                                        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                                            Top Match
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-600 text-lg mb-6">{club.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {club.tags.split(',').map(tag => (
                                        <span key={tag} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button
                        onClick={onRestart}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
                    >
                        Start Over
                    </button>
                </div>
            </div>
        </div>
    );
}
