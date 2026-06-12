import React from 'react';
import { Search, X, Users, ChevronLeft, ChevronRight } from 'lucide-react';

function VolunteersTable({
  loading,
  allData,
  filteredData,
  paginatedData,
  searchQuery,
  setSearchQuery,
  selectedBloodGroup,
  setSelectedBloodGroup,
  selectedProfession,
  setSelectedProfession,
  donorStatusFilter,
  setDonorStatusFilter,
  donationFilter,
  setDonationFilter,
  professionsList,
  currentPage,
  setCurrentPage,
  totalPages,
  itemsPerPage,
  setSelectedVolunteer
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col animate-fade-in">
      
      {/* Filters Bar */}
      <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-base sm:text-lg font-bold text-[#0a3d2e] flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-700" />
            সদস্য তালিকা
          </h2>
          {filteredData.length < allData.length && (
            <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
              {filteredData.length} টি ফলাফল পাওয়া গেছে
            </span>
          )}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="নাম, মোবাইল বা এলাকা দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all duration-200"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Blood Group Dropdown */}
          <div className="relative">
            <select
              value={selectedBloodGroup}
              onChange={(e) => setSelectedBloodGroup(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">সব রক্তের গ্রুপ</option>
              {['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'].map(bg => (
                <option key={bg} value={bg}>{bg}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          {/* Profession Dropdown */}
          <div className="relative">
            <select
              value={selectedProfession}
              onChange={(e) => setSelectedProfession(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">সব পেশা</option>
              {professionsList.map(prof => (
                <option key={prof} value={prof}>{prof}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          {/* Donor Type Filter */}
          <div className="relative">
            <select
              value={donorStatusFilter}
              onChange={(e) => setDonorStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition-all duration-200 appearance-none cursor-pointer"
            >
              <option value="">সব সদস্য</option>
              <option value="donor">শুধু রক্তদাতা</option>
              <option value="emergency">জরুরি রক্তদানে আগ্রহী</option>
              <option value="platelet">প্লাটিলেট দাতা</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>

          {/* Monthly Donation Toggle */}
          <button
            onClick={() => setDonationFilter(v => !v)}
            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-xl border text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              donationFilter
                ? 'bg-amber-500 border-amber-500 text-white shadow-md shadow-amber-100'
                : 'bg-white border-slate-200 text-slate-600 hover:border-amber-400 hover:text-amber-600'
            }`}
          >
            <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {donationFilter ? 'অনুদান: চালু ✓' : 'মাসিক অনুদানদাতা'}
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto w-full">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 border-3 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            <span className="text-slate-400 text-xs sm:text-sm">গুগল স্প্রেডশিট থেকে ডেটা লোড হচ্ছে...</span>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Users className="w-10 h-10 text-slate-300" />
            <span className="text-xs sm:text-sm font-medium">কোনো সদস্য পাওয়া যায়নি</span>
            <span className="text-[11px] text-slate-400">ফিল্টার পরিবর্তন করে আবার চেষ্টা করুন।</span>
          </div>
        ) : (
          <table className="w-full border-collapse text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-bold text-slate-700 font-bengali">পূর্ণ নাম</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-bold text-slate-700 font-bengali">মোবাইল</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-bold text-slate-700 font-bengali text-center">রক্তের গ্রুপ</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-bold text-slate-700 font-bengali">পেশা</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-bold text-slate-700 font-bengali hidden md:table-cell">বিশেষ দক্ষতা</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-bold text-slate-700 font-bengali hidden md:table-cell">বর্তমান ঠিকানা</th>
                <th className="px-4 py-3 sm:px-6 sm:py-4 font-bold text-slate-700 text-right">পদক্ষেপ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedData.map((row, index) => {
                const skills = row[21]
                  ? row[21].split(',').slice(0, 2).map(s => s.trim())
                  : [];
                const isDonor = row[24] === 'হ্যাঁ';
                
                return (
                  <tr
                    key={index}
                    onClick={() => setSelectedVolunteer(row)}
                    className="hover:bg-slate-50/70 transition-colors group cursor-pointer"
                  >
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4">
                      <div className="font-semibold text-emerald-950 group-hover:text-emerald-800 font-bengali">
                        {row[2] || '—'}
                      </div>
                      {row[33] && (row[33].includes('হ্যাঁ') || row[33].includes('আগ্রহী')) && !row[33].includes('না') && !row[33].includes('নই') && (
                        <div className="mt-1 flex flex-wrap items-center gap-1.5 font-bengali">
                          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-amber-50 border border-amber-200 text-amber-800 text-[10px] font-bold">
                            <span className="text-[9px]">৳</span> {row[34] || 'আগ্রহী'}
                          </span>
                          {row[35] && (
                            <span className="text-[10px] text-slate-400 font-medium">
                              (তারিখ: {row[35]})
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-slate-600 select-all font-mono text-[11px] sm:text-xs">
                      {row[7] || '—'}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-center">
                      <div className="inline-flex items-center gap-1 justify-center">
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 border border-rose-100 text-rose-600">
                          {row[23] || '?'}
                        </span>
                        {isDonor && (
                          <span
                            title="পূর্বে রক্তদান করেছেন"
                            className="w-4.5 h-4.5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm shrink-0"
                          >
                            ✓
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-slate-600 font-bengali font-medium">
                      {row[17] || '—'}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {skills.length > 0 ? (
                          skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-[10px] rounded font-medium">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-slate-400 hidden md:table-cell max-w-xs truncate text-xs">
                      {row[10] || '—'}
                    </td>
                    <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedVolunteer(row);
                        }}
                        className="px-2.5 py-1 bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white rounded text-xs transition-all duration-150 font-medium active:scale-95 cursor-pointer"
                      >
                        বিস্তারিত
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalPages > 1 && (
        <div className="px-4 py-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
          <div className="font-medium">
            {(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)} / মোট {filteredData.length} জন স্বেচ্ছাসেবী
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(c => Math.max(1, c - 1))}
              className="p-1.5 sm:p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Page numbers */}
            {(() => {
              const pages = [];
              const range = 2; // numbers before and after current page
              const startPage = Math.max(1, currentPage - range);
              const endPage = Math.min(totalPages, currentPage + range);

              if (startPage > 1) {
                pages.push(
                  <button
                    key={1}
                    onClick={() => setCurrentPage(1)}
                    className={`w-8 h-8 rounded-lg border text-xs font-semibold cursor-pointer ${currentPage === 1 ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    1
                  </button>
                );
                if (startPage > 2) {
                  pages.push(<span key="ellipsis1" className="px-1 text-slate-400">...</span>);
                }
              }

              for (let i = startPage; i <= endPage; i++) {
                pages.push(
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-all duration-150 cursor-pointer ${currentPage === i ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm scale-105' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {i}
                  </button>
                );
              }

              if (endPage < totalPages) {
                if (endPage < totalPages - 1) {
                  pages.push(<span key="ellipsis2" className="px-1 text-slate-400">...</span>);
                }
                pages.push(
                  <button
                    key={totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                    className={`w-8 h-8 rounded-lg border text-xs font-semibold cursor-pointer ${currentPage === totalPages ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(c => Math.min(totalPages, c + 1))}
              className="p-1.5 sm:p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default VolunteersTable;
