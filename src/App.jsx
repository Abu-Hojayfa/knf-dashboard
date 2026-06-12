import React, { useState, useEffect, useMemo } from 'react';
import heroIcon from './assets/hero.jpg';
import {
  Search,
  RefreshCw,
  Users,
  Droplet,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  FileText,
  X,
  Calendar,
  Award,
  GraduationCap,
  Heart,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  CheckCircle,
  AlertTriangle,
  Layers,
  Map,
  BookOpen,
  Info
} from 'lucide-react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const SHEET_ID = '1tAs1zh6RKEtZSL088KXKl9iZ1mD-Di8Zz88eDBZtRJs';
const SHEET_NAME = 'Form Responses 1';
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

function App() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [donorStatusFilter, setDonorStatusFilter] = useState(''); // '', 'donor', 'emergency', 'platelet'

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Selected volunteer for detail modal
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(GOOGLE_SHEET_URL);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const text = await response.text();
      const start = text.indexOf('{');
      const end = text.lastIndexOf('}');
      if (start === -1 || end === -1) throw new Error('Invalid response format');
      const json = JSON.parse(text.substring(start, end + 1));
      const rows = json.table?.rows || [];

      const parsed = rows
        .filter(row => row && row.c)
        .map(row => {
          const cells = row.c.map(cell => {
            if (!cell) return '';
            const val = cell.f !== undefined && cell.f !== null
              ? cell.f
              : (cell.v !== undefined && cell.v !== null ? cell.v : '');
            return String(val).trim();
          });
          // Pad rows to ensure index safety (length 35)
          while (cells.length < 35) {
            cells.push('');
          }
          return cells;
        });

      setAllData(parsed);
      const now = new Date();
      const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()}`;
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 hour becomes 12
      const timeStr = `${hours.toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')} ${ampm}`;
      setLastUpdated(`${dateStr} ${timeStr}`);
    } catch (err) {
      console.error(err);
      setError(err.message || 'ডেটা লোড করতে সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute statistics dynamically
  const stats = useMemo(() => {
    const total = allData.length;
    const emergencyDonors = allData.filter(r => r[26] && r[26].includes('আগ্রহী') && !r[26].includes('না')).length;
    const uniqueBloodGroups = new Set(allData.map(r => r[23]).filter(Boolean)).size;
    const uniqueProfessions = new Set(allData.map(r => r[17]).filter(Boolean)).size;
    const plateletDonors = allData.filter(r => r[27] && r[27].includes('হ্যাঁ')).length;
    
    return {
      total,
      emergencyDonors,
      uniqueBloodGroups,
      uniqueProfessions,
      plateletDonors
    };
  }, [allData]);

  // Compute Blood Group Counts
  const bloodGroupCounts = useMemo(() => {
    const groups = ['A+', 'A−', 'B+', 'B−', 'AB+', 'AB−', 'O+', 'O−'];
    const counts = {};
    groups.forEach(g => counts[g] = 0);
    allData.forEach(r => {
      const g = r[23];
      if (counts[g] !== undefined) {
        counts[g]++;
      }
    });
    return counts;
  }, [allData]);

  // Compute Profession Distribution (top 7)
  const topProfessions = useMemo(() => {
    const counts = {};
    allData.forEach(r => {
      const p = r[17];
      if (p) {
        counts[p] = (counts[p] || 0) + 1;
      }
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 7)
      .map(([name, count]) => ({ name, count }));
  }, [allData]);

  // Unique list of professions for dropdown selector
  const professionsList = useMemo(() => {
    const set = new Set(allData.map(r => r[17]).filter(Boolean));
    return Array.from(set).sort();
  }, [allData]);

  // Filter logic
  const filteredData = useMemo(() => {
    return allData.filter(r => {
      // Search: Name (2), Mobile (7), Address (10)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const name = (r[2] || '').toLowerCase();
        const mobile = (r[7] || '').toLowerCase();
        const address = (r[10] || '').toLowerCase();
        if (!name.includes(query) && !mobile.includes(query) && !address.includes(query)) {
          return false;
        }
      }

      // Blood Group filter
      if (selectedBloodGroup && r[23] !== selectedBloodGroup) {
        return false;
      }

      // Profession filter
      if (selectedProfession && r[17] !== selectedProfession) {
        return false;
      }

      // Donor status filter
      if (donorStatusFilter === 'donor' && r[24] !== 'হ্যাঁ') {
        return false;
      }
      if (donorStatusFilter === 'emergency') {
        const isEmergency = r[26] && r[26].includes('আগ্রহী') && !r[26].includes('না');
        if (!isEmergency) return false;
      }
      if (donorStatusFilter === 'platelet') {
        const isPlatelet = r[27] && r[27].includes('হ্যাঁ');
        if (!isPlatelet) return false;
      }

      return true;
    });
  }, [allData, searchQuery, selectedBloodGroup, selectedProfession, donorStatusFilter]);

  // Pagination calculation
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset page number if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBloodGroup, selectedProfession, donorStatusFilter]);

  // Helper to toggle blood group filter
  const toggleBloodGroup = (group) => {
    if (selectedBloodGroup === group) {
      setSelectedBloodGroup('');
    } else {
      setSelectedBloodGroup(group);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col font-sans selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#0a3d2e] border-b border-emerald-800/40 shadow-md backdrop-blur-md bg-opacity-95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-tr from-emerald-800 to-emerald-600 rounded-xl overflow-hidden flex items-center justify-center shadow-lg border border-emerald-500/20 transform hover:rotate-6 transition-transform duration-300">
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
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 rounded-full border border-emerald-800/50 text-xs text-emerald-300 font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                সর্বশেষ: {lastUpdated}
              </span>
            )}
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 bg-emerald-800 hover:bg-emerald-700 text-emerald-100 text-xs sm:text-sm font-medium rounded-lg border border-emerald-700/50 transition-all duration-200 shadow-sm active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>রিফ্রেশ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-6 sm:space-y-8">
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-5 text-red-800 flex items-start gap-3 shadow-sm animate-fade-in">
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
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-5">
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
          <div className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-50 rounded-full translate-x-8 -translate-y-8" />
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-rose-500 uppercase">জরুরি রক্তদাতা</span>
              <Heart className="w-5 h-5 text-rose-500 fill-rose-100" />
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              {loading ? <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" /> : stats.emergencyDonors}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">জরুরি রক্তদানে আগ্রহী</div>
          </div>

          {/* Card 3: Platelet Donors */}
          <div className="relative overflow-hidden bg-white rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-50/50 rounded-full translate-x-8 -translate-y-8" />
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider text-red-600 uppercase">প্লাটিলেট দাতা</span>
              <Droplet className="w-5 h-5 text-red-600 fill-red-50" />
            </div>
            <div className="text-2xl sm:text-4xl font-bold text-slate-800 tracking-tight">
              {loading ? <span className="inline-block w-12 h-8 bg-slate-100 animate-pulse rounded" /> : stats.plateletDonors}
            </div>
            <div className="text-[10px] sm:text-xs text-slate-500 mt-1 font-medium">অ্যাফেরেসিস আগ্রহী</div>
          </div>

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
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Blood Group Counts */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-emerald-550/5 border-b border-slate-100 px-5 py-4 flex items-center justify-between bg-slate-50">
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

          {/* Profession Fills */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
            <div className="bg-slate-50 border-b border-slate-100 px-5 py-4">
              <h2 className="text-sm sm:text-base font-bold text-[#0a3d2e] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-emerald-600" />
                পেশা অনুযায়ী বিভাজন (শীর্ষ ৭)
              </h2>
            </div>
            <div className="p-5 flex-1 flex flex-col justify-center">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex justify-between"><div className="h-4 w-24 bg-slate-100 animate-pulse rounded" /><div className="h-4 w-8 bg-slate-100 animate-pulse rounded" /></div>
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

        {/* Filters and Table Section */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Filters Bar */}
          <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#0a3d2e] flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-700" />
                সদস্য তালিকা
              </h2>
              {filteredData.length < allData.length && (
                <span className="text-xs font-semibold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full animate-pulse">
                  {filteredData.length} টি ফলাফল পাওয়া গেছে
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
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
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
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
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-slate-600 select-all font-mono text-[11px] sm:text-xs">
                          {row[7] || '—'}
                        </td>
                        <td className="px-4 py-3.5 sm:px-6 sm:py-4 text-center">
                          <div className="inline-flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-50 border border-rose-100 text-rose-600">
                              {row[23] || '?'}
                            </span>
                            {isDonor && (
                              <span
                                title="পূর্বে রক্তদান করেছেন"
                                className="w-4.5 h-4.5 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-sm"
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
                            className="px-2.5 py-1 bg-slate-100 text-slate-600 group-hover:bg-emerald-600 group-hover:text-white rounded text-xs transition-all duration-150 font-medium active:scale-95"
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
            <div className="px-4 py-4 sm:px-6 sm:py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm text-slate-500">
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
                        className={`w-8 h-8 rounded-lg border text-xs font-semibold ${currentPage === 1 ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
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
                        className={`w-8 h-8 rounded-lg border text-xs font-semibold transition-all duration-150 ${currentPage === i ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm scale-105' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
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
                        className={`w-8 h-8 rounded-lg border text-xs font-semibold ${currentPage === totalPages ? 'bg-emerald-700 border-emerald-700 text-white shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
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
      </main>

      {/* Footer */}
      <footer className="bg-[#0a3d2e] border-t border-emerald-950 py-6 sm:py-8 mt-12 text-center text-emerald-400/80 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 space-y-2">
          <p className="font-serif-bengali text-[#f0d98a] font-semibold tracking-wide">© খতমে নবুওয়াত ফাউন্ডেশন</p>
          <p className="text-[10px] text-emerald-500 font-medium font-bengali">একটি স্বেচ্ছাসেবী ও জনকল্যাণমুখী ইসলামি প্রতিষ্ঠান</p>
        </div>
      </footer>

      {/* Detail Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-fade-in">
          {/* Backdrop Click */}
          <div className="absolute inset-0 cursor-default" onClick={() => setSelectedVolunteer(null)} />
          
          {/* Modal Card */}
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative z-10 border border-slate-100 animate-scale-up">
            
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-[#0a3d2e] to-[#145d47] px-5 py-4 sm:px-6 sm:py-5 flex items-center justify-between text-white border-b border-emerald-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-emerald-800 rounded-xl flex items-center justify-center shadow-inner">
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
                onClick={() => setSelectedVolunteer(null)}
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

              </div>

            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-5 py-4 border-t border-slate-200 flex justify-between items-center text-xs">
              <span className="text-slate-400 font-medium">নিবন্ধন সময়কাল: {selectedVolunteer[0]}</span>
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="px-5 py-2 bg-[#0a3d2e] hover:bg-emerald-850 text-white rounded-lg font-bold shadow transition-all duration-150 cursor-pointer active:scale-95"
              >
                বন্ধ করুন
              </button>
            </div>

          </div>
        </div>
      )}

      <SpeedInsights />
      <Analytics />
    </div>
  );
}

export default App;
