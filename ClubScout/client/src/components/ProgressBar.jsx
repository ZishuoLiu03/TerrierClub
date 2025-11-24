import React from 'react';

export default function ProgressBar({ current, total }) {
    const progress = Math.min(100, (current / total) * 100);

    return (
        <div className="w-full max-w-2xl mx-4 mb-8">
            <div className="flex justify-between text-sm font-medium text-gray-500 mb-2">
                <span>Question {current} of {total}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}
