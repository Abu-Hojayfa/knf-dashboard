import React from 'react';
import {
  X,
  UserCheck,
  CheckCircle,
  Users,
  MapPin,
  GraduationCap,
  Award,
  Phone,
  FileText
} from 'lucide-react';

function VolunteerModal({ selectedVolunteer, onClose }) {
  if (!selectedVolunteer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
      {/* Backdrop Click */}
      <div className="absolute inset-0 cursor-default" onClick={onClose} />
      
      {/* Modal Card */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative z-10 border border-slate-100 animate-scale-up">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0a3d2e] to-[#145d47] px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between text-white border-b border-emerald-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-800 rounded-xl flex items-center justify-center shadow-inner shrink-0">
              <UserCheck className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-serif-bengali font-bold text-base sm:text-xl">
                {selectedVolunteer[2] || 'নামবিহীন সদস্য'}
              </h3>
              <p className="text-[10px] sm:text-xs text-emerald-300 font-medium">নিবন্ধন ফরম এর বিস্তারিত তথ্য</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 bg-emerald-950/60 border border-emerald-800/40 text-emerald-300 hover:text-white rounded-lg hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 sm:space-y-8 text-xs sm:text-sm">
          
          {/* Category 1: Blood & Emergency status */}
          <div className="bg-gradient-to-br from-rose-50 to-red-50/20 border border-rose-100 rounded-xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-1.5 bg-red-600 rounded-xl text-white font-extrabold text-sm sm:text-lg shadow-sm">
                {selectedVolunteer[23] || '?'}
              </div>
              <div>
                <div className="font-bold text-slate-800">রক্তের গ্রুপ ও ডোনার তথ্য</div>
                <div className="text-[11px] text-slate-500 mt-0.5">
                  পূর্বে দান করেছেন: {selectedVolunteer[24] === 'হ্যাঁ' ? 'হ্যাঁ (সর্বশেষ: ' + (selectedVolunteer[25] || 'অজানা') + ')' : 'না'}
                </div>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {/* Emergency Blood donor tag */}
              {selectedVolunteer[26] && selectedVolunteer[26].includes('আগ্রহী') && !selectedVolunteer[26].includes('না') ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-800 border border-red-200 text-xs font-semibold rounded-full shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" /> জরুরি দানে আগ্রহী
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium rounded-full">
                  জরুরি দানে অনিচ্ছুক
                </span>
              )}

              {/* Platelet tag */}
              {selectedVolunteer[27] && selectedVolunteer[27].includes('হ্যাঁ') ? (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-100 text-rose-800 border border-rose-200 text-xs font-semibold rounded-full shadow-sm">
                  <CheckCircle className="w-3.5 h-3.5" /> প্লাটিলেট দাতা
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-100 text-slate-500 border border-slate-200 text-xs font-medium rounded-full">
                  প্লাটিলেট দানে অনিচ্ছুক
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {/* Panel: Personal Details */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 font-bold text-[#0a3d2e] flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-700" />
                ব্যক্তিগত বিবরণ
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">পূর্ণ নাম:</span>
                  <span className="col-span-2 text-slate-800 font-semibold">{selectedVolunteer[2] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">মোবাইল:</span>
                  <span className="col-span-2 text-slate-800 select-all font-mono font-bold text-emerald-800">{selectedVolunteer[7] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">WhatsApp:</span>
                  <span className="col-span-2 text-slate-800 select-all font-mono font-semibold">{selectedVolunteer[8] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">ই-মেইল:</span>
                  <span className="col-span-2 text-slate-800 select-all truncate">{selectedVolunteer[9] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">লিঙ্গ:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[6] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">জন্মতারিখ:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[5] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">পিতার নাম:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[3] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">মাতার নাম:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[4] || '—'}</span>
                </div>
              </div>
            </div>

            {/* Panel: Address */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 font-bold text-[#0a3d2e] flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-700" />
                ঠিকানা ও অবস্থান
              </div>
              <div className="p-4 space-y-4 flex-1">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">বর্তমান ঠিকানা</div>
                  <p className="text-slate-800 bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed text-xs">
                    {selectedVolunteer[10] || 'বর্তমান ঠিকানা প্রদান করা হয়নি।'}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">স্থায়ী ঠিকানা</div>
                  <p className="text-slate-800 bg-slate-50 border border-slate-100 p-2.5 rounded-lg leading-relaxed text-xs">
                    {selectedVolunteer[11] || 'স্থায়ী ঠিকানা প্রদান করা হয়নি।'}
                  </p>
                </div>
              </div>
            </div>

            {/* Panel: Education & Profession */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 font-bold text-[#0a3d2e] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                পেশা ও যোগ্যতা
              </div>
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">পেশা:</span>
                  <span className="col-span-2 text-slate-800 font-semibold">{selectedVolunteer[17] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">কর্মস্থল:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[18] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">পদবি:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[19] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 border-t border-slate-100 pt-2.5 mt-2.5">
                  <span className="text-slate-400 font-medium">প্রতিষ্ঠান:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[12] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">বিভাগ:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[13] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">শ্রেণি / বর্ষ:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[14] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <span className="text-slate-400 font-medium">সেমিস্টার:</span>
                  <span className="col-span-2 text-slate-800">{selectedVolunteer[15] || '—'}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 border-t border-slate-100 pt-2.5">
                  <span className="text-slate-400 font-medium">সর্বোচ্চ যোগ্যতা:</span>
                  <span className="col-span-2 text-slate-850 font-medium">{selectedVolunteer[16] || '—'}</span>
                </div>
              </div>
            </div>

            {/* Panel: Skills */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 font-bold text-[#0a3d2e] flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-700" />
                দক্ষতা ও অভিজ্ঞতা
              </div>
              <div className="p-4 space-y-4 flex-1">
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">বিশেষ দক্ষতা</div>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {selectedVolunteer[21] ? (
                      selectedVolunteer[21].split(',').map((s, i) => (
                        <span key={i} className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-emerald-800 font-medium text-xs rounded-md shadow-sm">
                          {s.trim()}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-xs italic">কোনো বিশেষ দক্ষতা যোগ করা হয়নি</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">অন্যান্য দক্ষতা বা অভিজ্ঞতা</div>
                  <p className="text-slate-800 bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs leading-relaxed">
                    {selectedVolunteer[22] || 'অন্য কোনো অতিরিক্ত দক্ষতার তথ্য নেই।'}
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">সহশিক্ষা কার্যক্রমে অভিজ্ঞতা</div>
                  <p className="text-slate-800 bg-slate-50 border border-slate-100 p-2.5 rounded-lg text-xs leading-relaxed">
                    {selectedVolunteer[20] || 'কোনো সহশিক্ষা কার্যক্রমের বিবরণ নেই।'}
                  </p>
                </div>
              </div>
            </div>

            {/* Panel: Monthly Donation */}
            {(selectedVolunteer[33] || selectedVolunteer[34] || selectedVolunteer[35]) && (
              <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-4 md:col-span-2 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 mb-3 font-bold text-amber-900">
                  <svg className="w-4 h-4 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  মাসিক অনুদান তথ্য
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">অনুদানে আগ্রহ</div>
                    <div className={`text-sm font-semibold ${
                      selectedVolunteer[33] && (selectedVolunteer[33].includes('হ্যাঁ') || selectedVolunteer[33].includes('আগ্রহী')) && !selectedVolunteer[33].includes('না') && !selectedVolunteer[33].includes('নই')
                        ? 'text-emerald-700'
                        : 'text-slate-500'
                    }`}>
                      {selectedVolunteer[33] || '—'}
                    </div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">পরিমাণ (মাসিক)</div>
                    <div className="text-sm font-bold text-amber-800">{selectedVolunteer[34] || '—'}</div>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[11px] text-amber-700 font-bold uppercase tracking-wider">সম্ভাব্য তারিখ</div>
                    <div className="text-sm font-semibold text-slate-700">{selectedVolunteer[35] || '—'}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Panel: Commitments */}
            <div className="bg-emerald-50/20 border border-emerald-100 rounded-xl p-4 md:col-span-2 flex items-start gap-3 shadow-inner">
              <FileText className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-bold text-emerald-950">অঙ্গীকারনামা</div>
                <p className="text-xs text-emerald-900/80 leading-relaxed font-medium">
                  আমি শপথ করছি যে, খতমে নবুওয়াত ফাউন্ডেশনের আদর্শে অনুপ্রাণিত হয়ে একজন স্বেচ্ছাসেবী হিসেবে ইসলামের কল্যাণে এবং মানবতার সেবায় সর্বদা নিয়োজিত থাকব।
                </p>
                <div className="text-[10px] text-emerald-700/80 bg-emerald-100/50 border border-emerald-200/50 px-2 py-0.5 rounded inline-block mt-2 font-medium">
                  অঙ্গীকার স্থিতি: {selectedVolunteer[32] || 'স্বাক্ষরিত'}
                </div>
              </div>
            </div>

            {/* Panel: Emergency Contact Info */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden md:col-span-2">
              <div className="bg-slate-50 border-b border-slate-100 px-4 py-3 font-bold text-[#0a3d2e] flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-700" />
                জরুরি অভিভাবক ও যোগাযোগকারী
              </div>
              <div className="p-4 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">নাম</div>
                  <div className="text-slate-800 font-semibold text-sm">{selectedVolunteer[28] || '—'}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">সম্পর্ক</div>
                  <div className="text-slate-800 font-medium text-sm">{selectedVolunteer[29] || '—'}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">মোবাইল নম্বর</div>
                  <div className="text-emerald-800 font-bold font-mono text-sm select-all">{selectedVolunteer[30] || '—'}</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">WhatsApp নম্বর</div>
                  <div className="text-slate-800 font-semibold font-mono text-sm select-all">{selectedVolunteer[31] || '—'}</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-5 py-4 border-t border-slate-200 flex justify-between items-center text-xs shrink-0">
          <span className="text-slate-400 font-medium">নিবন্ধন সময়কাল: {selectedVolunteer[0]}</span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0a3d2e] hover:bg-emerald-850 text-white rounded-lg font-bold shadow transition-all duration-150 cursor-pointer active:scale-95"
          >
            বন্ধ করুন
          </button>
        </div>

      </div>
    </div>
  );
}

export default VolunteerModal;
