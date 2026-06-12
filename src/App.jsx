import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ErrorBanner from './components/ErrorBanner';
import VolunteerModal from './components/VolunteerModal';
import StatsAndCharts from './components/StatsAndCharts';
import VolunteersTable from './components/VolunteersTable';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';

const SHEET_ID = '1tAs1zh6RKEtZSL088KXKl9iZ1mD-Di8Zz88eDBZtRJs';
const SHEET_NAME = 'Form Responses 1';
const GOOGLE_SHEET_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}`;

function App() {
  // Global States
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBloodGroup, setSelectedBloodGroup] = useState('');
  const [selectedProfession, setSelectedProfession] = useState('');
  const [donorStatusFilter, setDonorStatusFilter] = useState(''); // '', 'donor', 'emergency', 'platelet'
  const [donationFilter, setDonationFilter] = useState(false); // true = only monthly donors

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Selected volunteer for detail modal
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  // Fetch data function
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
          // Pad rows to ensure index safety (length 42)
          while (cells.length < 42) {
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
    const monthlyDonors = allData.filter(r => r[33] && (r[33].includes('হ্যাঁ') || r[33].includes('আগ্রহী')) && !r[33].includes('না') && !r[33].includes('নই')).length;
    
    return {
      total,
      emergencyDonors,
      uniqueBloodGroups,
      uniqueProfessions,
      plateletDonors,
      monthlyDonors
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
      // Monthly donation filter
      if (donationFilter) {
        const isMonthlyDonor = r[33] && (r[33].includes('হ্যাঁ') || r[33].includes('আগ্রহী')) && !r[33].includes('না') && !r[33].includes('নই');
        if (!isMonthlyDonor) return false;
      }

      return true;
    });
  }, [allData, searchQuery, selectedBloodGroup, selectedProfession, donorStatusFilter, donationFilter]);

  // Pagination calculation
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset page number if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedBloodGroup, selectedProfession, donorStatusFilter, donationFilter]);

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
      <Header
        lastUpdated={lastUpdated}
        loading={loading}
        loadData={loadData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 w-full space-y-6 sm:space-y-8">
        
        {/* Error Banner */}
        <ErrorBanner error={error} />

        {/* Stats & Charts section (always visible) */}
        <StatsAndCharts
          stats={stats}
          loading={loading}
          bloodGroupCounts={bloodGroupCounts}
          topProfessions={topProfessions}
          selectedBloodGroup={selectedBloodGroup}
          toggleBloodGroup={toggleBloodGroup}
          donationFilter={donationFilter}
          setDonationFilter={setDonationFilter}
        />

        {/* Members datatable with filters (always visible) */}
        <VolunteersTable
          loading={loading}
          allData={allData}
          filteredData={filteredData}
          paginatedData={paginatedData}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedBloodGroup={selectedBloodGroup}
          setSelectedBloodGroup={setSelectedBloodGroup}
          selectedProfession={selectedProfession}
          setSelectedProfession={setSelectedProfession}
          donorStatusFilter={donorStatusFilter}
          setDonorStatusFilter={setDonorStatusFilter}
          donationFilter={donationFilter}
          setDonationFilter={setDonationFilter}
          professionsList={professionsList}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          setSelectedVolunteer={setSelectedVolunteer}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Detail Modal */}
      <VolunteerModal
        selectedVolunteer={selectedVolunteer}
        onClose={() => setSelectedVolunteer(null)}
      />

      <SpeedInsights />
      <Analytics />
    </div>
  );
}

export default App;
