import React from 'react';
import { Users, Heart, Droplet, Layers, Briefcase } from 'lucide-react';

function StatsAndCharts({
  stats,
  loading,
  bloodGroupCounts,
  topProfessions,
  selectedBloodGroup,
  toggleBloodGroup,
  donorStatusFilter,
  setDonorStatusFilter,
  donationFilter,
  setDonationFilter
}) {
  return (
    <div className="space-y-6 sm:space-y-8 mb-6 sm:mb-8 animate-fade-in">
      
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
        {/* Card 1: Total Members */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#0a3d2e] to-[#125843] rounded-2xl p-4 sm:p-6 text-white border border-emerald-800 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full translate-x-8 -translate-y-8" />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-300 uppercase">মোট সদস্য</span>
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-4xl font-bold tracking-tight">
            {loading ? <span className="inline-block w-12 h-8 bg-emerald-800/60 animate-pulse rounded" /> : stats.total}
          </div>
          <div className="text-[10px] sm:text-xs text-emerald-300/80 mt-1 font-medium">নিবন্ধিত স্বেচ্ছাসেবী</div>
        </div>

        {/* Card 2: Emergency Donors */}
        <button
          onClick={() => setDonorStatusFilter(v => v === 'emergency' ? '' : 'emergency')}
          className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left cursor-pointer ${
            donorStatusFilter === 'emergency'
              ? 'bg-rose-600 border-rose-500 text-white'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full translate-x-8 -translate-y-8 ${donorStatusFilter === 'emergency' ? 'bg-white/10' : 'bg-rose-50'}`} />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className={`text-[11px] sm:text-xs font-semibold tracking-wider uppercase ${donorStatusFilter === 'emergency' ? 'text-rose-100' : 'text-rose-500'}`}>জরুরি রক্তদাতা</span>
            <Heart className={`w-5 h-5 ${donorStatusFilter === 'emergency' ? 'text-white fill-white/20' : 'text-rose-500 fill-rose-100'}`} />
          </div>
          <div className="text-2xl sm:text-4xl font-bold tracking-tight">
            {loading ? <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" /> : stats.emergencyDonors}
          </div>
          <div className={`text-[10px] sm:text-xs mt-1 font-medium ${donorStatusFilter === 'emergency' ? 'text-rose-100' : 'text-slate-500'}`}>
            {donorStatusFilter === 'emergency' ? '✓ ফিল্টার চালু আছে' : 'জরুরি রক্তদানে আগ্রহী'}
          </div>
        </button>

        {/* Card 3: Platelet Donors */}
        <button
          onClick={() => setDonorStatusFilter(v => v === 'platelet' ? '' : 'platelet')}
          className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left cursor-pointer ${
            donorStatusFilter === 'platelet'
              ? 'bg-red-600 border-red-500 text-white'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full translate-x-8 -translate-y-8 ${donorStatusFilter === 'platelet' ? 'bg-white/10' : 'bg-red-50/50'}`} />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className={`text-[11px] sm:text-xs font-semibold tracking-wider uppercase ${donorStatusFilter === 'platelet' ? 'text-red-100' : 'text-red-600'}`}>প্লাটিলেট দাতা</span>
            <Droplet className={`w-5 h-5 ${donorStatusFilter === 'platelet' ? 'text-white fill-white/20' : 'text-red-600 fill-red-50'}`} />
          </div>
          <div className="text-2xl sm:text-4xl font-bold tracking-tight">
            {loading ? <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" /> : stats.plateletDonors}
          </div>
          <div className={`text-[10px] sm:text-xs mt-1 font-medium ${donorStatusFilter === 'platelet' ? 'text-red-100' : 'text-slate-500'}`}>
            {donorStatusFilter === 'platelet' ? '✓ ফিল্টার চালু আছে' : 'অ্যাফেরেসিস আগ্রহী'}
          </div>
        </button>

        {/* Card 4: Blood Groups */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-full translate-x-8 -translate-y-8" />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-emerald-600 uppercase">রক্তের গ্রুপ</span>
            <Layers className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            {loading ? <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" /> : stats.uniqueBloodGroups}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">রকমের গ্রুপ নিবন্ধিত</div>
        </div>

        {/* Card 5: Professions */}
        <div className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full translate-x-8 -translate-y-8" />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-blue-600 uppercase">পেশা বিভাজন</span>
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div className="text-2xl sm:text-4xl font-bold text-slate-800 tracking-tight">
            {loading ? <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" /> : stats.uniqueProfessions}
          </div>
          <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">ধরনের পেশাজীবী</div>
        </div>

        {/* Card 6: Monthly Donors */}
        <button
          onClick={() => setDonationFilter(v => !v)}
          className={`relative overflow-hidden rounded-2xl p-4 sm:p-6 border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-left cursor-pointer ${
            donationFilter
              ? 'bg-amber-600 border-amber-500 text-white'
              : 'bg-white border-slate-200 text-slate-800'
          }`}
        >
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full translate-x-8 -translate-y-8 ${donationFilter ? 'bg-white/10' : 'bg-amber-50/70'}`} />
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className={`text-[11px] sm:text-xs font-semibold tracking-wider uppercase ${donationFilter ? 'text-amber-100' : 'text-amber-600'}`}>মাসিক অনুদান</span>
            <svg className={`w-5 h-5 ${donationFilter ? 'text-amber-100' : 'text-amber-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className={`text-2xl sm:text-4xl font-bold tracking-tight ${donationFilter ? 'text-white' : 'text-slate-800'}`}>
            {loading ? <span className="inline-block w-12 h-8 bg-amber-100/40 animate-pulse rounded" /> : stats.monthlyDonors}
          </div>
          <div className={`text-[10px] sm:text-xs mt-1 font-medium ${donationFilter ? 'text-amber-100' : 'text-slate-500'}`}>
            {donationFilter ? '✓ ফিল্টার চালু আছে' : 'দানে আগ্রহী সদস্য'}
          </div>
        </button>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Blood Group Counts */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-4 flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-[#0a3d2e] flex items-center gap-2">
              <Droplet className="w-4 h-4 text-red-500 fill-current" />
              রক্তের গ্রুপ অনুযায়ী রক্তদাতা
            </h2>
            <span className="text-[10px] text-slate-400 bg-white border px-2 py-0.5 rounded-full font-medium">ফিল্টার করতে ক্লিক করুন</span>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center">
            {loading ? (
              <div className="grid grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-2.5 sm:gap-3">
                {Object.entries(bloodGroupCounts).map(([group, count]) => {
                  const isActive = selectedBloodGroup === group;
                  return (
                    <button
                      key={group}
                      onClick={() => toggleBloodGroup(group)}
                      className={`group p-3 sm:p-4 rounded-xl text-center border transition-all duration-200 flex flex-col items-center justify-center cursor-pointer ${
                        isActive
                          ? 'bg-red-600 border-red-600 text-white shadow-md scale-105 shadow-red-200'
                          : 'bg-rose-50/50 hover:bg-rose-100/50 border-rose-100 text-slate-800 hover:scale-[1.02]'
                      }`}
                    >
                      <span className={`text-base sm:text-lg font-extrabold ${isActive ? 'text-white' : 'text-red-600'}`}>
                        {group}
                      </span>
                      <span className={`text-[10px] sm:text-xs mt-1 ${isActive ? 'text-white/95 font-medium' : 'text-slate-500 group-hover:text-slate-600'}`}>
                        {count} জন
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Profession Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="bg-slate-50 border-b border-slate-100 px-5 py-4">
            <h2 className="text-sm sm:text-base font-bold text-[#0a3d2e] flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              পেশা অনুযায়ী বিভাজন (শীর্ষ ৩)
            </h2>
          </div>
          <div className="p-5 flex-1 flex flex-col justify-center">
            {loading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="h-4 w-24 bg-slate-100 animate-pulse rounded" />
                      <div className="h-4 w-8 bg-slate-100 animate-pulse rounded" />
                    </div>
                    <div className="h-2.5 bg-slate-100 animate-pulse rounded-full" />
                  </div>
                ))}
              </div>
            ) : topProfessions.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">কোনো তথ্য পাওয়া যায়নি</div>
            ) : (
              <div className="space-y-3.5">
                {topProfessions.map((prof) => {
                  const maxVal = Math.max(...topProfessions.map(p => p.count)) || 1;
                  const percent = ((prof.count / maxVal) * 100).toFixed(0);
                  return (
                    <div key={prof.name} className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs sm:text-sm font-medium">
                        <span className="text-slate-700">{prof.name}</span>
                        <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">{prof.count} জন</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${percent}%` }}
                          className="h-full bg-emerald-600 rounded-full transition-all duration-1000 ease-out"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}

export default StatsAndCharts;
