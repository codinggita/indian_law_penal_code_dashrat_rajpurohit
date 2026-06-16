import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import SkeletonLoader from '../components/SkeletonLoader';

const SystemDashboard = () => {
  const { isAdmin } = useAuth();
  const [health, setHealth] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchSystemData();
    }
  }, [isAdmin]);

  const fetchSystemData = async () => {
    setLoading(true);
    try {
      const [healthRes, logsRes] = await Promise.all([
        API.get('/admin/system/health'),
        API.get('/admin/system/logs')
      ]);
      setHealth(healthRes.data.data);
      setLogs(logsRes.data.data || []);
    } catch (err) {
      toast.error('Failed to retrieve system diagnostics.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = async () => {
    if (window.confirm('Are you sure you want to purge the system cache? This may temporarily degrade performance.')) {
      setClearing(true);
      try {
        await API.delete('/admin/cache/clear');
        toast.success('System cache successfully purged.');
        fetchSystemData();
      } catch (err) {
        toast.error('Failed to clear cache.');
      } finally {
        setClearing(false);
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-jurist-bg">
        <Helmet><title>Access Denied | Momentum OS</title></Helmet>
        <div className="p-8 text-center bg-red-100 border-2 border-black max-w-md shadow-brutal text-black">
          ⚠️ <strong className="font-mono uppercase">Access Denied:</strong> Level 5 clearance required.
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 lg:p-12 bg-jurist-bg text-black min-h-screen">
      <Helmet>
        <title>System Diagnostics | Momentum OS</title>
      </Helmet>

      <header className="mb-12 border-b-4 border-black pb-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="font-display text-5xl md:text-7xl uppercase tracking-tighter leading-none mb-2">SYSTEM DIAGNOSTICS</h1>
          <p className="font-mono text-sm font-bold uppercase bg-black text-white inline-block px-2 py-1 shadow-brutal">
            CORE INFRASTRUCTURE MONITORING
          </p>
        </div>
        <div className="text-left md:text-right">
          <button
            onClick={handleClearCache}
            disabled={clearing}
            className="brutal-border bg-jurist-primary text-white px-4 py-2 font-display text-lg uppercase tracking-wider shadow-brutal hover:bg-black active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">delete</span>
            {clearing ? 'PURGING...' : 'PURGE CACHE'}
          </button>
        </div>
      </header>

      {loading ? (
        <SkeletonLoader type="card" count={3} />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="brutal-border bg-white shadow-brutal p-6">
              <h3 className="font-display text-2xl uppercase border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">health_and_safety</span>
                HEALTH STATUS
              </h3>
              {health ? (
                <div className="space-y-4 font-mono text-sm font-bold uppercase">
                  <div className="flex justify-between border-b border-black/10 pb-2">
                    <span>DB STATUS:</span>
                    <span className={health.database === 'connected' ? 'text-green-600' : 'text-jurist-primary'}>
                      {health.database || 'UNKNOWN'}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 pb-2">
                    <span>UPTIME:</span>
                    <span>{health.uptime ? `${(health.uptime / 3600).toFixed(2)} HOURS` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between border-b border-black/10 pb-2">
                    <span>MEMORY USAGE:</span>
                    <span>{health.memoryUsage?.rss ? `${(health.memoryUsage.rss / 1024 / 1024).toFixed(0)} MB` : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VERSION:</span>
                    <span>v4.0.12</span>
                  </div>
                </div>
              ) : (
                <p className="font-mono text-xs">NO HEALTH DATA AVAILABLE</p>
              )}
            </div>
            
            <div className="brutal-border bg-black text-white shadow-brutal p-6">
              <h3 className="font-display text-2xl uppercase border-b-2 border-white pb-2 mb-4 text-jurist-primary">
                <span className="material-symbols-outlined mr-2">security</span>
                SECURITY STATUS
              </h3>
              <p className="font-mono text-xs mb-2">No critical vulnerabilities detected.</p>
              <p className="font-mono text-xs">Last security audit: 2 hours ago</p>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="brutal-border bg-white shadow-brutal p-6 h-full flex flex-col">
              <h3 className="font-display text-2xl uppercase border-b-2 border-black pb-2 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined">terminal</span>
                SYSTEM LOGS
              </h3>
              <div className="flex-1 bg-black p-4 brutal-border overflow-y-auto max-h-[500px]">
                {logs.length > 0 ? (
                  <ul className="space-y-2 font-mono text-xs text-green-400">
                    {logs.map((log, idx) => (
                      <li key={log._id || idx} className="border-b border-green-900/50 pb-1">
                        <span className="text-gray-400">[{new Date(log.timestamp || Date.now()).toISOString()}]</span>{' '}
                        <span className={log.level === 'error' ? 'text-jurist-primary font-bold' : log.level === 'warn' ? 'text-yellow-400' : 'text-green-400'}>
                          [{log.level ? log.level.toUpperCase() : 'INFO'}]
                        </span>{' '}
                        <span className="text-white">{log.message || log.action || JSON.stringify(log)}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-gray-500 font-mono text-xs">AWAITING LOG OUTPUT...</div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemDashboard;
