import React from 'react';

export default function QuestionCard({ question, onAnswer, isSubmitting, onPrevious, isFirstQuestion }) {
  return (
    <div className="bg-white/95 backdrop-blur p-8 rounded-2xl shadow-2xl 
                    max-w-2xl w-full mx-4 border border-slate-200/90 
                    transition-all duration-300">
      {/* Category + question */}
      <div className="mb-6">
        <div className="flex items-center justify-between gap-3 mb-2">
          <span className="inline-flex items-center gap-2
                            text-[11px] font-semibold uppercase tracking-wide
                            text-slate-600">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B5182A]" />
            {question.category}
          </span>
          <span className="text-[11px] text-slate-400">
            No wrong answers.
          </span>
        </div>

        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
          {question.text}
        </h2>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, idx) => (
          <button
            key={option.id}
            onClick={() => onAnswer(option.id)}
            disabled={isSubmitting}
            className=" w-full text-left p-4 rounded-xl 
                        border border-slate-200 bg-slate-50/90 
                        [@media(hover:hover)]:hover:border-[#B5182A] [@media(hover:hover)]:hover:bg-red-50/70 
                        transition-all duration-150 group
                        focus:outline-none focus:ring-2 focus:ring-[#B5182A] 
                        focus:ring-offset-2 focus:ring-offset-slate-950
                        disabled:opacity-60 disabled:cursor-not-allowed
            "
          >
            <div className="flex items-start gap-3">
              <div className="mt-1 h-7 w-7 rounded-full flex items-center justify-center 
                            border border-slate-300 bg-white 
                            text-[11px] font-semibold text-slate-600 
                            [@media(hover:hover)]:group-hover:border-[#B5182A] 
                            [@media(hover:hover)]:group-hover:text-[#B5182A]
                ">
                {String.fromCharCode(65 + idx)}
              </div>

              <p className="text-sm md:text-base text-slate-800 [@media(hover:hover)]:group-hover:text-slate-900">
                {option.text}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Navigation & Hint */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
        <button
          onClick={onPrevious}
          disabled={!onPrevious || isFirstQuestion}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 border
                ${(!onPrevious || isFirstQuestion)
              ? 'text-slate-300 border-transparent cursor-not-allowed'
              : 'text-slate-700 border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm active:scale-95'
            }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <p className="text-[11px] text-slate-400">
          Go with your gut! That's what reflects your real persona.
        </p>
      </div>
    </div>
  );
}
