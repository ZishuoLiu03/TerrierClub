import React from 'react';

export default function QuestionCard({ question, onAnswer, isSubmitting }) {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full mx-4 transition-all duration-300">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{question.text}</h2>
            <span className="inline-block bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full mb-6 uppercase tracking-wide font-semibold">
                {question.category}
            </span>

            <div className="space-y-3">
                {question.options.map((option) => (
                    <button
                        key={option.id}
                        onClick={() => onAnswer(option.id)}
                        disabled={isSubmitting}
                        className="w-full text-left p-4 rounded-xl border-2 border-gray-100 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="text-gray-700 font-medium group-hover:text-indigo-700 text-lg">
                            {option.text}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
