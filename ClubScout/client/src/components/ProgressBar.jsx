import React from 'react';

export default function ProgressBar({ current, total }) {
    const progress = Math.min(100, (current / total) * 100);

    return (
        <div className="w-full max-w-2xl mx-4 mb-8">
            { /* Top row: step info */ }
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 border border-slate-700 px-3 py-1 text-[11px] font-medium text-slate-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#B5182A]"/>
                        Step {current} or {total}
                    </span>
                    <span className="hidden sm:inline text-[11px] text-slate-400">
                        Help us learn how you like to get involved.
                    </span>
                </div>
                <span className="text-[11px] font-medium text-slate-300">
                    {Math.round(progress)}% complete
                </span>
            </div>

            { /* Progress track */}
            <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-slate-700/80 shadow-inner">
                <div 
                    className="h-2.5 rounded-full transition-all duration-500 ease-out 
                    bg-gradient-to-r from-[#B5182A] via-red-500 to-rose-400 
                    shadow-[0_0_10px_rgba(181,24,42,0.7)]"
                    style={{ width: `${progress}%`}}
                />
            </div>
        </div>
    );
}
