import React from 'react';
import { X, HelpCircle, CheckCircle, Volume2, ShieldCheck, Sparkles } from 'lucide-react';

interface HowToPlayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowToPlayModal: React.FC<HowToPlayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 text-slate-800 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <img src="/logo.jpg" alt="Logo" className="w-6 h-6 rounded-lg object-cover border border-slate-200" />
            <h2 className="font-bold text-xl text-slate-900">How to Play BingoBlitz</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-5 py-4 text-sm text-slate-600">
          {/* Section 1: Objective */}
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              1. Objective
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Match called numbers with the numbers on your 5×5 BingoBlitz card. Complete a winning pattern first and get <strong className="text-indigo-600 font-bold">BINGO!</strong>
            </p>
          </div>

          {/* Section 2: Card Layout */}
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-2 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. Shuffled Card Layout (1–25)
            </h3>
            <p className="text-slate-600 leading-relaxed">
              Numbers 1 through 25 are randomly shuffled across all 25 spots on your 5×5 card.
            </p>
          </div>

          {/* Section 3: Playing & Marking */}
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-sky-600" />
              3. Playing & Marking
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
              <li>Tap numbers on your card to mark or unmark them as called.</li>
              <li>Click <strong className="text-slate-900">New Card</strong> anytime to generate a fresh shuffled card layout.</li>
            </ul>
          </div>

          {/* Section 4: Winning Patterns */}
          <div>
            <h3 className="font-bold text-base text-slate-900 mb-1 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              4. Winning Pattern (B-I-N-G-O)
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed">
              <li>To win, you must complete <strong className="text-indigo-600 font-bold">5 total lines</strong> (any combination of horizontal rows, vertical columns, or diagonal lines).</li>
              <li>Each completed line lights up a letter in <strong className="text-indigo-600 font-black">B - I - N - G - O</strong>!</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 text-center">
          <button
            onClick={onClose}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition-all cursor-pointer shadow-md shadow-indigo-200"
          >
            Got It, Let's Play!
          </button>
        </div>
      </div>
    </div>
  );
};
