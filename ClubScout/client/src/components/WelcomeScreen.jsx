import React, { useState } from 'react';

export default function WelcomeScreen({ onStart }) {
    const [nickname, setNickname] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (nickname.trim()) {
            onStart(nickname);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-8">
      <div className="max-w-6xl w-full grid gap-10 lg:grid-cols-[1.3fr,1fr] items-center">
        {/* Left: Hero / brand section */}
        <div className="space-y-6 text-slate-50">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/60 border border-slate-700 px-3 py-1 text-xs font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
            Live prototype • ClubScout
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
            Find your community
            <span className="block text-red-400">
              on and beyond the BU campus
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 max-w-xl">
            ClubScout learns about your interests and student persona, then
            recommends BU clubs and Boston-area organizations that actually fit
            you — not just whatever happens to show up first in a directory.
          </p>

          <div className="flex flex-wrap gap-2 text-[11px]">
            <span className="px-3 py-1 rounded-full bg-red-900/60 border border-red-500/50 text-red-100">
              🎯 Persona-based matching
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-600 text-slate-100">
              🐾 BU clubs & external orgs
            </span>
            <span className="px-3 py-1 rounded-full bg-slate-900/70 border border-slate-600 text-slate-100">
              🤝 Designed to reduce search fatigue
            </span>
          </div>

          <p className="text-[11px] text-slate-400">
            This is a course project prototype — no real accounts, just an
            exploration of how recommendation systems can support student
            belonging.
          </p>
        </div>

        {/* Right: Onboarding card */}
        <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl border border-slate-200 p-7 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-900">
              Let’s get to know you
            </h2>
            <span className="text-[11px] font-medium text-slate-400">
              ~ 6 quick questions
            </span>
          </div>

          <p className="text-sm text-slate-600 mb-6">
            We’ll ask a few questions about how you like to get involved, then
            match you with clubs and organizations.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="nickname"
                className="block text-xs font-medium text-slate-600 mb-2"
              >
                What should we call you?
              </label>
              <input
                id="nickname"
                type="text"
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-red-500 focus:ring focus:ring-red-200 text-sm outline-none"
                placeholder="Enter a name or nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 text-white font-semibold py-3 rounded-xl hover:bg-red-700 transition-transform duration-150 hover:-translate-y-0.5 shadow-lg text-sm flex items-center justify-center gap-1"
            >
              Start my matches
              <span aria-hidden>🚀</span>
            </button>
          </form>
        </div>
      </div>
    </div>
    );
}
