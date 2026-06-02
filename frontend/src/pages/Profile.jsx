import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/uiSlice';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { theme } = useSelector((state) => state.ui);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    toast.success(`Theme switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode!`);
  };

  return (
    <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-wide">
          👤 My Account Settings
        </h2>
        <p className="text-sm text-slate-400">Configure your personal preferences, theme configurations, and profile details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card - User info */}
        <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl flex flex-col items-center text-center gap-4">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg uppercase">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div className="flex flex-col gap-1">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{user?.name}</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 uppercase inline-block">
              {user?.role}
            </span>
          </div>
          <div className="w-full border-t border-slate-100 dark:border-slate-800/40 my-2"></div>
          <p className="text-xs text-slate-400">Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}</p>
          <Button variant="danger" onClick={logout} className="w-full mt-2">
            Sign Out
          </Button>
        </div>

        {/* Right Cards - Settings fields */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Section: Profile Info */}
          <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-slate-400 font-semibold uppercase text-xs tracking-wider">Email Address</span>
                <span className="text-slate-800 dark:text-slate-200 font-medium">{user?.email}</span>
              </div>
              <div className="flex flex-col gap-1 text-sm">
                <span className="text-slate-400 font-semibold uppercase text-xs tracking-wider">Verification Status</span>
                <span className={`font-semibold ${user?.isVerified ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {user?.isVerified ? '✓ Verified' : '⚠ Verification Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Styling Preferences */}
          <div className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800/40 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Appearance Preferences
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Light / Dark Color Theme</span>
                <span className="text-xs text-slate-400">Toggle dark mode interface elements</span>
              </div>
              <Button variant="secondary" onClick={handleThemeToggle} className="text-sm font-semibold">
                {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
