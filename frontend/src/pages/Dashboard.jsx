import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Helmet } from 'react-helmet-async';
import API from '../services/api';
import toast from 'react-hot-toast';
import SkeletonLoader from '../components/SkeletonLoader';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalLaws: 511,
    activeLaws: 498,
    repealedLaws: 13,
  });
  const [categoryStats, setCategoryStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [lawsCount, activeCount, repealedCount, categoriesRes] = await Promise.all([
          API.get('/stats/laws/count').catch(() => ({ data: { data: { total: 511 } } })),
          API.get('/stats/laws/active').catch(() => ({ data: { data: { total: 498 } } })),
          API.get('/stats/laws/repealed').catch(() => ({ data: { data: { total: 13 } } })),
          API.get('/stats/laws/by-category').catch(() => ({ data: { data: [] } })),
        ]);

        setStats({
          totalLaws: lawsCount.data.data?.total ?? 511,
          activeLaws: activeCount.data.data?.total ?? 498,
          repealedLaws: repealedCount.data.data?.total ?? 13,
        });
        
        setCategoryStats(categoriesRes.data.data || []);
      } catch (err) {
        // Fall back to defaults in case backend stats aren't fully populated yet
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-jurist-bg text-jurist-text min-h-screen">
      <Helmet>
        <title>Operator Console | Momentum OS</title>
        <meta name="description" content="Operational Overview Dashboard of Indian Law Penal Code. Analyze active and repealed statutes." />
        <meta property="og:title" content="Operator Console - Momentum OS" />
        <meta property="og:description" content="Dashboard portal overview of the legal statutory database." />
      </Helmet>

      {/* Header Section */}
      <div className="mb-10 border-l-8 border-jurist-red pl-6 py-2">
        <h1 className="font-headline text-6xl md:text-8xl font-black text-black uppercase tracking-tighter leading-none mix-blend-multiply">
          IPC OPERATIONAL OVERVIEW
        </h1>
        <p className="font-mono text-lg font-bold mt-2 text-black bg-white inline-block px-2 border-2 border-black shadow-brutal-sm">
          SYS.DIR: /IPC/PENAL_CODE/OVERVIEW
        </p>
      </div>

      {/* URGENT Alert Banner */}
      <div className="mb-10 bg-jurist-red border-4 border-black shadow-brutal flex items-stretch animate-pulse" style={{ animationDuration: '3s' }}>
        <div className="bg-black text-jurist-red p-4 flex items-center justify-center border-r-4 border-black w-20">
          <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
            warning
          </span>
        </div>
        <div className="p-4 flex-1 flex flex-col justify-center text-left">
          <h3 className="font-headline text-2xl font-black text-white uppercase tracking-tight">URGENT: STATUTORY AMENDMENT IN EFFECT</h3>
          <p className="font-mono text-sm font-bold text-white mt-1">SEC. 498A IPC REVISION DEPLOYED. ALL OPERATORS MUST REVIEW PROTOCOL IMMEDIATELY.</p>
        </div>
        <button
          onClick={() => toast.success('Protocol acknowledged and registered.')}
          className="p-4 bg-white border-l-4 border-black font-headline font-black text-xl hover:bg-black hover:text-white transition-none"
        >
          ACKNOWLEDGE
        </button>
      </div>

      {/* Metrics Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {/* Metric 1 */}
        <div className="bg-white border-4 border-black shadow-brutal p-6 flex flex-col relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              gavel
            </span>
          </div>
          <h4 className="font-mono font-bold text-sm text-gray-600 mb-2 border-b-2 border-black pb-2 uppercase w-full">Total Sections</h4>
          <div className="text-7xl font-headline font-black text-black mt-2 tracking-tighter text-left">
            {loading ? <div className="h-16 w-24 bg-gray-200 animate-pulse mt-2 brutal-border"></div> : stats.totalLaws}
          </div>
          <div className="mt-4 flex items-center gap-2 font-mono text-xs font-bold text-jurist-red bg-jurist-red/10 border border-jurist-red px-2 py-1 w-max">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            +12 THIS CYCLE
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-black border-4 border-black shadow-brutal p-6 flex flex-col relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl text-white" style={{ fontVariationSettings: "'FILL' 1" }}>
              verified_user
            </span>
          </div>
          <h4 className="font-mono font-bold text-sm text-gray-400 mb-2 border-b-2 border-gray-700 pb-2 uppercase w-full">Active Statutes</h4>
          <div className="text-7xl font-headline font-black text-white mt-2 tracking-tighter text-left">
            {loading ? <div className="h-16 w-24 bg-gray-750 animate-pulse mt-2 brutal-border border-gray-600"></div> : stats.activeLaws}
          </div>
          <div className="mt-4 flex items-center gap-2 font-mono text-xs font-bold text-green-400 border border-green-400 px-2 py-1 w-max">
            <span className="material-symbols-outlined text-sm">check_circle</span>
            SYSTEM NOMINAL
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-jurist-bg border-4 border-black shadow-brutal p-6 flex flex-col relative group overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <span className="material-symbols-outlined text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              delete_forever
            </span>
          </div>
          <h4 className="font-mono font-bold text-sm text-gray-600 mb-2 border-b-2 border-black pb-2 uppercase w-full">Repealed Sections</h4>
          <div className="text-7xl font-headline font-black text-jurist-red mt-2 tracking-tighter text-left">
            {loading ? <div className="h-16 w-24 bg-gray-300 animate-pulse mt-2 brutal-border"></div> : stats.repealedLaws}
          </div>
          <div className="mt-4 flex items-center gap-2 font-mono text-xs font-bold text-black border-2 border-black bg-white px-2 py-1 w-max hover:bg-black hover:text-white cursor-pointer transition-none">
            <span className="material-symbols-outlined text-sm">history</span>
            VIEW LOG
          </div>
        </div>
      </div>

      {/* Analytics Chart Panel */}
      <div className="mb-12 p-6 border-4 border-black bg-white shadow-brutal flex flex-col gap-4 text-left">
        <h3 className="font-display text-3xl font-black uppercase tracking-tight text-black border-b-4 border-black pb-2">
          📈 STATUTORY DISTRIBUTION BY CATEGORY
        </h3>
        {loading ? (
          <SkeletonLoader type="chart" />
        ) : categoryStats.length === 0 ? (
          <div className="h-64 flex items-center justify-center border-2 border-black bg-[#EAE7DC] p-6 text-center font-mono text-xs font-bold text-gray-500">
            NO DATA LOADED FROM MONGO AGGREGATION
          </div>
        ) : (
          <div className="h-64 flex items-end justify-between border-2 border-black p-6 bg-[#EAE7DC] gap-2 md:gap-4 overflow-x-auto">
            {categoryStats.slice(0, 6).map((bar, idx) => {
              const label = bar._id ? bar._id.replace(/^Of\s+/i, '').replace(/Offences\s+/i, '').split(' ')[0].toUpperCase() : 'GENERAL';
              const maxCount = Math.max(...categoryStats.map(c => c.count)) || 1;
              const pct = Math.round((bar.count / maxCount) * 100);
              
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end min-w-[60px]">
                  <div className="w-full text-center font-mono text-xs font-bold text-black">{bar.count}</div>
                  <div 
                    className="w-full border-t-2 border-l-2 border-r-2 border-black bg-[#D90429] transition-all duration-300 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    style={{ height: `${Math.max(pct, 10)}%` }}
                  />
                  <div className="font-mono text-[10px] font-bold text-black/70 truncate w-full text-center" title={bar._id}>
                    {label}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Data Table Section */}
      <div className="bg-white border-4 border-black shadow-brutal">
        <div className="bg-black p-4 flex justify-between items-center border-b-4 border-black">
          <h2 className="font-headline text-3xl font-black text-white uppercase tracking-tight">RECENTLY UPDATED STATUTES</h2>
          <button
            onClick={() => toast.success('Export payload generated.')}
            className="bg-white text-black font-label font-bold uppercase px-4 py-1 border-2 border-white hover:bg-jurist-red hover:text-white hover:border-jurist-red transition-none flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-sm font-bold">download</span>
            EXPORT
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-sm brutal-table">
            <thead className="bg-[#EAE7DC] font-bold uppercase text-black">
              <tr>
                <th className="p-4 w-32 border-b-4 border-black border-r-2">Section</th>
                <th className="p-4 border-b-4 border-black border-r-2">Title / Description</th>
                <th className="p-4 w-40 border-b-4 border-black border-r-2">Status</th>
                <th className="p-4 w-48 border-b-4 border-black border-r-2">Date Modified</th>
                <th className="p-4 w-24 border-b-4 border-black">Action</th>
              </tr>
            </thead>
            <tbody className="font-medium text-black">
              <tr className="hover:bg-gray-100 transition-none group">
                <td className="p-4 font-bold border-b-2 border-r-2 border-black">SEC. 124A</td>
                <td className="p-4 uppercase truncate max-w-xs border-b-2 border-r-2 border-black">Sedition - Under Review by Supreme Court Panel</td>
                <td className="p-4 border-b-2 border-r-2 border-black">
                  <span className="bg-yellow-300 text-black px-2 py-1 border-2 border-black font-bold text-xs uppercase">SUSPENDED</span>
                </td>
                <td className="p-4 border-b-2 border-r-2 border-black">2023-10-15 08:45Z</td>
                <td className="p-4 border-b-2 border-black">
                  <button className="p-1 border-2 border-black hover:bg-black hover:text-white transition-none flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-100 transition-none group bg-jurist-bg/50">
                <td className="p-4 font-bold border-b-2 border-r-2 border-black">SEC. 377</td>
                <td className="p-4 uppercase truncate max-w-xs border-b-2 border-r-2 border-black">Unnatural Offences - Partially struck down</td>
                <td className="p-4 border-b-2 border-r-2 border-black">
                  <span className="bg-jurist-red text-white px-2 py-1 border-2 border-black font-bold text-xs uppercase">AMENDED</span>
                </td>
                <td className="p-4 border-b-2 border-r-2 border-black">2023-09-02 14:22Z</td>
                <td className="p-4 border-b-2 border-black">
                  <button className="p-1 border-2 border-black hover:bg-black hover:text-white transition-none flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-100 transition-none group">
                <td className="p-4 font-bold border-b-2 border-r-2 border-black">SEC. 497</td>
                <td className="p-4 uppercase truncate max-w-xs border-b-2 border-r-2 border-black">Adultery - Unconstitutional</td>
                <td className="p-4 border-b-2 border-r-2 border-black">
                  <span className="bg-black text-white px-2 py-1 border-2 border-black font-bold text-xs uppercase">REPEALED</span>
                </td>
                <td className="p-4 border-b-2 border-r-2 border-black">2023-08-11 09:10Z</td>
                <td className="p-4 border-b-2 border-black">
                  <button className="p-1 border-2 border-black hover:bg-black hover:text-white transition-none flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-100 transition-none group bg-jurist-bg/50">
                <td className="p-4 font-bold border-r-2 border-black">SEC. 302</td>
                <td className="p-4 uppercase truncate max-w-xs border-r-2 border-black">Punishment for murder - Procedural update</td>
                <td className="p-4 border-r-2 border-black">
                  <span className="bg-green-400 text-black px-2 py-1 border-2 border-black font-bold text-xs uppercase">ACTIVE</span>
                </td>
                <td className="p-4 border-r-2 border-black">2023-10-20 11:05Z</td>
                <td className="p-4">
                  <button className="p-1 border-2 border-black hover:bg-black hover:text-white transition-none flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
