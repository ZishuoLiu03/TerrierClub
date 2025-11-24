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
        <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center transform transition-all hover:scale-105 duration-300">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-6">
                    ClubScout
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                    Find your tribe on campus. Answer a few questions and get matched with the perfect club!
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2 text-left">
                            What should we call you?
                        </label>
                        <input
                            type="text"
                            id="nickname"
                            required
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring focus:ring-indigo-200 transition-all outline-none text-lg"
                            placeholder="Enter your nickname"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transform hover:-translate-y-1 transition-all duration-200 shadow-lg hover:shadow-xl text-lg"
                    >
                        Let's Go! 🚀
                    </button>
                </form>
            </div>
        </div>
    );
}
