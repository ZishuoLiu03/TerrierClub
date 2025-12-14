import React, { useEffect, useState } from 'react';
import { api } from '../api';

// export default function ResultsScreen({ sessionId, onRestart }) {
//     const [clubs, setClubs] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         async function fetchRecommendations() {
//             try {
//                 const data = await api.getRecommendations(sessionId);
//                 setClubs(data);
//             } catch (error) {
//                 console.error("Failed to fetch recommendations", error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchRecommendations();
//     }, [sessionId]);

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-3xl mx-auto">
//                 <div className="text-center mb-12">
//                     <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
//                         Your Perfect Matches
//                     </h2>
//                     <p className="mt-4 text-xl text-gray-500">
//                         Based on your answers, here are the clubs we think you'll love!
//                     </p>
//                 </div>

//                 <div className="space-y-6">
//                     {clubs.map((club, index) => (
//                         <div
//                             key={club.id}
//                             className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
//                         >
//                             <div className="p-6 sm:p-8">
//                                 <div className="flex items-center justify-between mb-4">
//                                     <h3 className="text-2xl font-bold text-gray-900">{club.name}</h3>
//                                     {index === 0 && (
//                                         <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
//                                             Top Match
//                                         </span>
//                                     )}
//                                 </div>
//                                 <p className="text-gray-600 text-lg mb-6">{club.description}</p>
//                                 <div className="flex flex-wrap gap-2">
//                                     {club.tags.split(',').map(tag => (
//                                         <span key={tag} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
//                                             #{tag}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>
//                         </div>
//                     ))}
//                 </div>

//                 <div className="mt-12 text-center">
//                     <button
//                         onClick={onRestart}
//                         className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors"
//                     >
//                         Start Over
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// }

function ResultsScreen({ sessionId, onRestart }) {
    const [loading, setLoading] = useState(true);
    const [persona, setPersona] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [error, setError] = useState(null);

    // Feedback state
    const [rating, setRating] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

    async function handleFeedbackSubmit() {
        if (rating === null) return;

        try {
            await api.submitFeedback(sessionId, rating, feedback);
            setFeedbackSubmitted(true);
        } catch (err) {
            console.error('Failed to submit feedback', err);
            // Still show success to user to not disrupt flow
            setFeedbackSubmitted(true);
        }
    }

    useEffect(() => {
        async function loadResults() {
            setLoading(true);
            setError(null);

            try {
                const data = await api.getResults(sessionId);
                setPersona(data.persona);
                setRecommendations(data.recommendations || []);
            } catch (err) {
                console.error('Failed to load results', err);
                setError('We had trouble loading your matches. Please try again.');
            } finally {
                setLoading(false);
            }
        }

        if (sessionId) {
            loadResults();
        }
    }, [sessionId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 px-4">
                <p className="text-red-400 text-sm">{error}</p>
                <button
                    onClick={onRestart}
                    className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                >
                    Restart quiz
                </button>
            </div>
        );
    }

    if (!persona) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center space-y-4 px-4">
                <p className="text-slate-300 text-sm">
                    No persona found for this session.</p>
                <button
                    onClick={onRestart}
                    className="px-4 py-2 rounded-md bg-red-600 text-white text-sm font-medium hover:bg-red-700"
                >
                    Restart quiz
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 py-10 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto space-y-8">
                { /* Top: heading + persona card */}
                <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch">
                    <div className="flex-1">
                        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-50 mb-2">
                            Your matches are ready 🎯
                        </h1>
                        <p className="text-sm md:text-base text-slate-300 max-w-xl">
                            Based on your answers, we’ve identified your <span className="font-semibold text-slate-50">student persona</span> and
                            selected organizations that align with how you like to get involved —
                            both on campus and beyond BU.
                        </p>
                    </div>

                    { /* Persona card */}
                    <div className="w-full lg:w-80 bg-gradient-to-br from-slate=900 to-slate-800 rounded-2xl border border-slate-700 shadow-lg p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                    {persona.type === 'Explorer' && '🌍'}
                                    {persona.type === 'Innovator' && '🚀'}
                                    {persona.type === 'Creator' && '🎨'}
                                    {persona.type === 'Connector' && '🤝'}
                                </span>
                                <div>
                                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                                        Your student persona
                                    </p>
                                    <p className="text-sm font-bold text-slate-50">
                                        {persona.type}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-slate-200 mb-3">
                            {persona.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                            {persona.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2.5 py-0.5 rounded-full bg-slate-800 text-[11px] text-slate-200 border border-slate-700"
                                >
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                { /* Legend + restart */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-300">
                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#B5182A]" />
                            <span> BU Organizations </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#3B82F6]" />
                            <span> External Organizations </span>
                        </div>
                    </div>

                    <button
                        onClick={onRestart}
                        className="inline-flex items-center px-4 py-2 rounded-md border border-slate-600 text-xs font-medium text-['#0f172a'] bg-white hover:bg-slate-800"
                    >
                        Restart Quiz
                    </button>
                </div>

                { /* Recommendations */}
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Left Column: BU Clubs */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block w-3 h-3 rounded-full bg-[#B5182A]" />
                            <h2 className="text-xl font-bold text-slate-50">BU Organizations</h2>
                        </div>
                        {recommendations.filter(r => r.type === 'BU').length === 0 ? (
                            <p className="text-sm text-slate-400">No BU matches found.</p>
                        ) : (
                            recommendations.filter(r => r.type === 'BU').map((org) => (
                                <OrgRecommendationCard key={org.id} org={org} />
                            ))
                        )}
                    </div>

                    {/* Right Column: External Clubs */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block w-3 h-3 rounded-full bg-[#3B82F6]" />
                            <h2 className="text-xl font-bold text-slate-50">External Organizations</h2>
                        </div>
                        {recommendations.filter(r => r.type === 'External').length === 0 ? (
                            <p className="text-sm text-slate-400">No external matches found.</p>
                        ) : (
                            recommendations.filter(r => r.type === 'External').map((org) => (
                                <OrgRecommendationCard key={org.id} org={org} />
                            ))
                        )}
                    </div>
                </div>

                { /* Feedback Section */}
                <div className="mt-12 pt-8 border-t border-slate-800">
                    <h3 className="text-xl font-bold text-slate-50 mb-4 text-center">
                        How was your experience?
                    </h3>

                    {!feedbackSubmitted ? (
                        <div className="max-w-md mx-auto bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Rate us (1-10)
                                </label>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={rating || 5}
                                    onChange={(e) => setRating(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                />
                                <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span>1</span>
                                    <span>5</span>
                                    <span>10</span>
                                </div>
                                <div className="text-center mt-2 text-indigo-400 font-bold">
                                    {rating ? rating : '-'}
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Any comments? (Optional)
                                </label>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                                    rows="3"
                                    placeholder="Tell us what you think..."
                                />
                            </div>

                            <button
                                onClick={handleFeedbackSubmit}
                                disabled={rating === null}
                                className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${rating !== null
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                    }`}
                            >
                                Done
                            </button>
                        </div>
                    ) : (
                        <div className="text-center p-6 bg-green-900/20 rounded-xl border border-green-900/50 max-w-md mx-auto">
                            <p className="text-green-400 font-medium">
                                Thank you for your feedback!
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// Small card component for each recommendation
function OrgRecommendationCard({ org }) {
    const isBU = org.type === 'BU';

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 border-l-4 border-l-[var(--accent-color)]"
            style={{
                // dynamic accent color: red for BU, navy for external
                '--accent-color': isBU ? '#B5182A' : '#3B82F6',
            }}
        >
            <div className="flex items-start justify-between mb-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                    {org.name}
                </h3>
                <span
                    className={
                        'ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full ' +
                        (isBU ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700')
                    }
                >
                    {isBU ? 'BU' : 'External'}
                </span>
            </div>

            <p className="text-xs text-gray-700 mb-2 line-clamp-3">
                {org.description}
            </p>

            {org.tags && org.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {org.tags.slice(0, 3).map((tag) => (
                        <span
                            key={tag}
                            className="px-2 py-0.5 rounded-full bg-gray-100 text-[11px] text-gray-700"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between">
                <span className="text-[11px] text-gray-500">
                    {org.matchLabel || 'Recommended for you'}
                </span>
                {org.url && (
                    <a
                        href={org.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[11px] text-indigo-600 font-medium underline"
                    >
                        Open
                    </a>
                )}
            </div>
        </div>
    );
}

export default ResultsScreen;