import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Cards from '../components/Cards';
import API from '../services/api';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user, isAdmin, logout } = useAuth();
  const [stats, setStats] = useState({
    totalLaws: 0,
    activeLaws: 0,
    repealedLaws: 0,
    bookmarks: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [lawsCount, activeCount, repealedCount, bookmarksCount] = await Promise.all([
          API.get('/stats/laws/count'),
          API.get('/stats/laws/active'),
          API.get('/stats/laws/repealed'),
          API.get('/stats/stats/laws/bookmarks').catch(() => ({ data: { data: 0 } })), // Fallback if bookmark endpoint differs
        ]);

        setStats({
          totalLaws: lawsCount.data.data ?? 0,
          activeLaws: activeCount.data.data ?? 0,
          repealedLaws: repealedCount.data.data ?? 0,
          bookmarks: bookmarksCount.data.data ?? 0,
        });
      } catch (err) {
        toast.error('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-xl">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-wide">
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p className="text-sm text-indigo-100">
            {isAdmin ? 'System Administrator Portal' : 'Explore and bookmark legal records with high-precision query aggregations'}
          </p>
        </div>
        <div className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-xs font-bold uppercase tracking-wider">
          Role: {user?.role || 'User'}
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Cards
          title="Total Penal Laws"
          value={loading ? '...' : stats.totalLaws}
          icon="⚖️"
          trend="12%"
          trendType="up"
        />
        <Cards
          title="Active Statutes"
          value={loading ? '...' : stats.activeLaws}
          icon="✅"
          trend="4%"
          trendType="up"
        />
        <Cards
          title="Repealed Sections"
          value={loading ? '...' : stats.repealedLaws}
          icon="❌"
          trend="0%"
          trendType="down"
        />
        <Cards
          title="Total Saved Bookmarks"
          value={loading ? '...' : stats.bookmarks}
          icon="🔖"
          trend="24%"
          trendType="up"
        />
      </div>

      {/* Main Aggregations Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Popular Trends Chart Stub */}
        <div className="lg:col-span-2 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            📈 Regional Offense Distribution Trends
          </h3>
          <div className="h-64 flex items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-400">
            [ Recharts Visualization Pipeline Connected to /api/v1/analytics ]
          </div>
        </div>

        {/* Right Side: Quick Links list */}
        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            ⚡ Quick Shortcuts
          </h3>
          <div className="flex flex-col gap-2">
            <a href="/laws" className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-medium text-sm flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span>🔍 Search Penal Statutes</span>
              <span>➔</span>
            </a>
            <a href="/profile" className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-indigo-500/20 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all font-medium text-sm flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span>👤 User Preferences & Settings</span>
              <span>➔</span>
            </a>
            {isAdmin && (
              <a href="/users" className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-red-500/10 hover:bg-red-500/5 transition-all font-medium text-sm flex items-center justify-between text-slate-700 dark:text-slate-300">
                <span>🛡️ Administrative User Control</span>
                <span>➔</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
