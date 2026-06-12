import React from 'react';
import { RefreshCw } from 'lucide-react';
import heroIcon from '../assets/hero.jpg';

function Header({ lastUpdated, loading, loadData }) {
  return (
    <header className="sticky top-0 z-40 bg-[#0a3d2e] border-b border-emerald-800/40 shadow-md backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-4">
        
        {/* Left Side: Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-emerald-800 to-emerald-600 rounded-xl overflow-hidden flex items-center justify-center shadow-lg border border-emerald-500/20 transform hover:rotate-6 transition-transform duration-300 shrink-0">
            <img src={heroIcon} alt="খতমে নবুওয়াত ফাউন্ডেশন লোগো" className="w-full h-full object-cover" />
          </div>
          <div>
            <h1 className="font-serif-bengali text-lg sm:text-2xl font-bold text-white tracking-wide leading-tight">
              খতমে নবুওয়াত ফাউন্ডেশন
            </h1>
            <p className="text-[10px] sm:text-xs text-emerald-400 font-medium font-bengali">
              স্বেচ্ছাসেবী ও রক্তদাতা ড্যাশবোর্ড
            </p>
          </div>
        </div>

        {/* Right Side: Timestamp & Refresh Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {lastUpdated && (
            <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 rounded-full border border-emerald-800/50 text-xs text-emerald-300 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              সর্বশেষ: {lastUpdated}
            </span>
          )}
          <button
            onClick={loadData}
            disabled={loading}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs sm:text-sm font-medium rounded-lg border border-emerald-700/50 transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
