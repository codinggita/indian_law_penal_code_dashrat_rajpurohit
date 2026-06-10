import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../store/uiSlice';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, logout } = useAuth();
  const { theme } = useSelector((state) => state.ui);

  const handleThemeToggle = () => {
    dispatch(toggleTheme());
    toast.success(`Theme switched to ${theme === 'light' ? 'Dark' : 'Light'} Mode!`);
  };

  return (
    <div className="flex-1 flex flex-col p-8 gap-8 overflow-y-auto max-w-4xl mx-auto w-full bg-sandy dark:bg-black text-black dark:text-white">
      <Helmet>
        <title>Account Settings | Momentum OS</title>
        <meta name="description" content="View your operator credentials and modify your display themes and environment preferences." />
        <meta property="og:title" content="Operator Settings - Momentum OS" />
        <meta property="og:description" content="User credentials and styling configurations." />
      </Helmet>
      <div className="flex flex-col gap-1.5">
        <h2 className="font-display text-4xl uppercase tracking-wider text-black dark:text-white">
          👤 MY ACCOUNT SETTINGS
        </h2>
        <p className="font-mono text-xs uppercase tracking-widest text-black/60 dark:text-white/60">Configure your personal preferences, theme configurations, and profile details</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Card - User info */}
        <div className="p-6 rounded-none border-2 border-black dark:border-white bg-[#D8D4C7] dark:bg-zinc-950 shadow-brutalist-lg dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.85)] flex flex-col items-center text-center gap-4">
          <div className="h-24 w-24 rounded-none border-2 border-black dark:border-white bg-white dark:bg-black text-black dark:text-white font-display text-4xl flex items-center justify-center shadow-brutalist-sm dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.85)] uppercase">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div className="flex flex-col gap-1.5">
            <h3 className="font-display text-2xl uppercase tracking-wider text-black dark:text-white">{user?.name}</h3>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-none bg-crimson text-white border border-black uppercase inline-block">
              JURIST STATUS: {user?.role}
            </span>
          </div>
          <div className="w-full border-t-2 border-black dark:border-white my-2"></div>
          <p className="font-mono text-[10px] uppercase font-bold text-black/60 dark:text-white/60">ENLISTED SINCE {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2026'}</p>
          <Button variant="danger" onClick={logout} className="w-full mt-2">
            SIGN OUT SESSION
          </Button>
        </div>

        {/* Right Cards - Settings fields */}
        <div className="md:col-span-2 flex flex-col gap-6">
          {/* Section: Profile Info */}
          <div className="p-6 rounded-none border-2 border-black dark:border-white bg-[#D8D4C7] dark:bg-zinc-950 shadow-brutalist-lg dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.85)] flex flex-col gap-4">
            <h3 className="font-display text-2xl uppercase tracking-wider text-black dark:text-white underline decoration-crimson decoration-2 underline-offset-4">
              PERSONAL INFORMATION
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 text-sm bg-white dark:bg-black p-3 border border-black dark:border-white">
                <span className="text-black/60 dark:text-white/60 font-mono font-bold uppercase text-[10px] tracking-wider">EMAIL ADDRESS</span>
                <span className="text-black dark:text-white font-semibold">{user?.email}</span>
              </div>
              <div className="flex flex-col gap-1 text-sm bg-white dark:bg-black p-3 border border-black dark:border-white">
                <span className="text-black/60 dark:text-white/60 font-mono font-bold uppercase text-[10px] tracking-wider">VERIFICATION STATUS</span>
                <span className={`font-semibold ${user?.isVerified ? 'text-emerald-500' : 'text-crimson'}`}>
                  {user?.isVerified ? '✓ VERIFIED' : '⚠ VERIFICATION PENDING'}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Styling Preferences */}
          <div className="p-6 rounded-none border-2 border-black dark:border-white bg-[#D8D4C7] dark:bg-zinc-950 shadow-brutalist-lg dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.85)] flex flex-col gap-4">
            <h3 className="font-display text-2xl uppercase tracking-wider text-black dark:text-white underline decoration-crimson decoration-2 underline-offset-4">
              ENVIRONMENT PREFERENCES
            </h3>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs font-bold text-black/60 dark:text-white/60 uppercase">SELECT RUNTIME VISUAL INTERFACE</span>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-2">
                <button
                  onClick={() => theme === 'dark' && handleThemeToggle()}
                  className={`flex-1 p-4 border-2 rounded-none font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutalist-sm ${
                    theme === 'light'
                      ? 'border-crimson bg-white text-black shadow-brutalist-sm'
                      : 'border-black dark:border-white bg-zinc-900 text-white/50'
                  }`}
                >
                  LIGHT ENVIRONMENT
                </button>
                <button
                  onClick={() => theme === 'light' && handleThemeToggle()}
                  className={`flex-1 p-4 border-2 rounded-none font-mono text-xs font-bold uppercase tracking-wider transition-all duration-150 transform hover:-translate-x-[1px] hover:-translate-y-[1px] hover:shadow-brutalist-sm ${
                    theme === 'dark'
                      ? 'border-crimson bg-black text-white shadow-brutalist-sm dark:shadow-[2px_2px_0px_0px_rgba(255,255,255,0.85)]'
                      : 'border-black dark:border-white bg-zinc-200 dark:bg-zinc-900 text-black/50 dark:text-white/50'
                  }`}
                >
                  DARK ENVIRONMENT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
