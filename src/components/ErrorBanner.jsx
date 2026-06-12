import React from 'react';
import { AlertTriangle } from 'lucide-react';

function ErrorBanner({ error }) {
  if (!error) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5 text-red-800 flex items-start gap-3 shadow-sm animate-fade-in mb-6">
      <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
      <div className="space-y-1">
        <h3 className="font-semibold text-sm sm:text-base">ডেটা লোড করা যায়নি</h3>
        <p className="text-xs sm:text-sm text-red-700/90 leading-relaxed">
          অনুগ্রহ করে নিশ্চিত করুন যে গুগল স্প্রেডশিটটি <strong>"Anyone with the link → Viewer"</strong> হিসেবে শেয়ার করা আছে এবং আপনার ইন্টারনেট সংযোগ ঠিক আছে।
        </p>
        <p className="text-[11px] font-mono text-red-500 mt-2 bg-red-100/50 px-2 py-1 rounded inline-block">
          ত্রুটি: {error}
        </p>
      </div>
    </div>
  );
}

export default ErrorBanner;
