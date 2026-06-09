import React, { useEffect, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import store from './store';
import { useAuth } from './hooks/useAuth';
import { toggleSidebar } from './store/uiSlice';
import ErrorBoundary from './components/ErrorBoundary';
import { Toaster } from 'react-hot-toast';

// Lazy loading components for split routing
const Landing = React.lazy(() => import('./pages/Landing'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const LawsListing = React.lazy(() => import('./pages/LawsListing'));
const UsersManagement = React.lazy(() => import('./pages/UsersManagement'));
const Profile = React.lazy(() => import('./pages/Profile'));
const CaseFiles = React.lazy(() => import('./pages/CaseFiles'));
const TeamDirectory = React.lazy(() => import('./pages/TeamDirectory'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const LawDetail = React.lazy(() => import('./pages/LawDetail'));
const Analytics = React.lazy(() => import('./pages/Analytics'));

// MUI theme configuration aligning with neo-brutalist Tailwind tokens
const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#D90429', // Crimson
    },
    background: {
      default: '#EAE7DC', // Sandy beige
      paper: '#FFFFFF',
    },
    text: {
      primary: '#000000',
    },
  },
  typography: {
    fontFamily: '"Public Sans", Inter, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #000000',
          boxShadow: '4px 4px 0px 0px #000000',
          textTransform: 'uppercase',
          fontWeight: 900,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '2px solid #000000',
        },
      },
    },
  },
});

// Lazy route fallback indicator
const LazyFallback = () => (
  <div className="min-h-screen bg-jurist-bg bg-grid flex flex-col items-center justify-center font-mono text-xs font-bold uppercase text-black">
    <div className="inline-flex h-8 w-8 animate-spin rounded-full border-4 border-jurist-primary border-t-transparent mb-4"></div>
    INITIALIZING SECURE MODULE...
  </div>
);

// Route Guard: Authentication check
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Layout Wrapper with responsive Sidebar and Navbar
const AppLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const { sidebarOpen } = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  const location = useLocation();

  const links = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
    { label: 'Penal Code', path: '/laws', icon: 'gavel' },
    { label: 'Case Files', path: '/case-files', icon: 'folder_shared' },
    { label: 'Analytics & Reports', path: '/analytics', icon: 'bar_chart' },
    { label: 'Team Directory', path: '/team', icon: 'groups' },
    { label: 'Onboarding Tour', path: '/onboarding', icon: 'explore' },
    { label: 'Account Settings', path: '/profile', icon: 'settings' },
  ];

  if (isAdmin) {
    links.push({ label: 'User Controls', path: '/users', icon: 'shield_person' });
  }

  return (
    <div className="min-h-screen flex bg-jurist-bg text-black selection:bg-jurist-primary selection:text-white">
      {/* SideNavBar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 pt-20 flex flex-col bg-[#EAE7DC] dark:bg-black border-r-2 border-black dark:border-white transition-transform duration-300 transform md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header Operator Info */}
        <div className="p-6 border-b-4 border-black text-left">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 border-2 border-black bg-jurist-red shadow-brutal flex items-center justify-center overflow-hidden">
              <img
                alt="User Profile Avatar"
                className="w-full h-full object-cover grayscale mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKpMsvtJUcc5Q1xGKIXPfYpVp7D_HVTUZMKf_9k_7-9AF2NH4b-vd9BSXKJbo4Xe1o5WuLz_PgzH2LLAzq16K8rJYzPZEFfVbrkF9CXDuWJ9A-kyuLLm-7kgYQ2xfGUpZ52QsofZgF5lp9Kl6A2ykbWZqp_b8dT2PKA5ylKQtFRe57Ho0m9Y1lob0JeYcPayueDZGQ7EkgafAmpwxKZYbrIDJYRKTRwSNFK9413qoR5ptui1AOHdns6ShLmzH-eHHXq4YUBB5a4JE"
              />
            </div>
            <div>
              <h2 className="text-lg font-headline font-black text-[#D90429] leading-tight truncate max-w-[130px]" title={user?.name || 'OPERATOR'}>
                {user?.name ? user.name.toUpperCase() : 'OPERATOR'}
              </h2>
              <p className="font-mono text-[9px] font-bold tracking-tight">
                {user?.role === 'admin' ? 'CLEARANCE LEVEL 5' : 'CLEARANCE LEVEL 1'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full border-2 border-black bg-black text-white font-label font-bold uppercase py-2 shadow-brutal-sm hover:bg-jurist-red hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-none text-xs"
          >
            TERMINATE SESSION
          </button>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex-1 overflow-y-auto mt-4 font-label font-bold uppercase text-left">
          {links.map((link, idx) => {
            const active = location.pathname === link.path;
            
            if (link.disabled) {
              return (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3 border-b border-black/10 text-black/40 cursor-not-allowed select-none"
                >
                  <span className="material-symbols-outlined text-base">{link.icon}</span>
                  <span className="text-xs">{link.label}</span>
                </div>
              );
            }

            return (
              <Link
                key={idx}
                to={link.path}
                className={`flex items-center gap-3 p-3 border-b border-black dark:border-white transition-none ${
                  active
                    ? 'bg-[#D90429] text-white border-2 border-black -ml-2 w-[calc(100%+8px)] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative z-10'
                    : 'text-black dark:text-white hover:bg-black hover:text-white'
                }`}
              >
                <span className="material-symbols-outlined text-base" style={active ? { fontVariationSettings: "'FILL' 1" } : {}}>
                  {link.icon}
                </span>
                <span className="text-xs">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Tabs */}
        <div className="border-t-4 border-black mt-auto font-label font-bold uppercase text-left">
          <div className="flex items-center gap-3 p-3 border-b border-black text-black/60 text-xs">
            <span className="material-symbols-outlined text-base">terminal</span>
            <span>SYSTEM ACTIVE</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow md:ml-64 flex flex-col min-h-screen overflow-x-hidden bg-jurist-bg">
        {/* TopNavBar */}
        <header className="fixed top-0 right-0 left-0 md:left-64 h-[72px] z-30 flex justify-between items-center px-6 bg-[#EAE7DC] border-b-2 border-black shadow-[0px_4px_0px_0px_rgba(0,0,0,1)] dark:bg-black dark:border-white">
          <div className="flex items-center gap-4">
            <button
              onClick={() => dispatch(toggleSidebar())}
              className="md:hidden p-2 border-2 border-black bg-[#EAE7DC] shadow-brutal-sm hover:bg-[#D90429] hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center justify-center font-bold text-xs"
            >
              MENU
            </button>
            <span className="text-sm md:text-lg font-headline font-black text-black dark:text-white uppercase tracking-tighter truncate max-w-[280px] sm:max-w-none">
              MOMENTUM OS v4.0.12 // ENCRYPTED CHANNEL
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={logout}
              className="hidden sm:flex px-3 py-1 bg-[#D90429] text-white border-2 border-black font-headline font-bold text-xs tracking-wider uppercase shadow-brutal-sm hover:-translate-x-[1px] hover:-translate-y-[1px] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              SIGN OUT
            </button>
          </div>
        </header>

        {/* Canvas wrapper with margin for top nav header */}
        <main className="flex-grow pt-[72px] flex flex-col overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

// Root Router mapping with Suspense wrapping
const AppContent = () => {
  const { theme } = useSelector((state) => state.ui);

  // Synchronize CSS class for dark mode on startup and state changes
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Suspense fallback={<LazyFallback />}>
      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Pages */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Dashboard />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laws"
          element={
            <ProtectedRoute>
              <AppLayout>
                <LawsListing />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/laws/:id"
          element={
            <ProtectedRoute>
              <AppLayout>
                <LawDetail />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Analytics />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/case-files"
          element={
            <ProtectedRoute>
              <AppLayout>
                <CaseFiles />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/team"
          element={
            <ProtectedRoute>
              <AppLayout>
                <TeamDirectory />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Onboarding />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <AppLayout>
                <UsersManagement />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Profile />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        {/* Fallback redirects */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <Provider store={store}>
          <MuiThemeProvider theme={muiTheme}>
            <BrowserRouter>
              <Toaster position="top-right" reverseOrder={false} />
              <AppContent />
            </BrowserRouter>
          </MuiThemeProvider>
        </Provider>
      </HelmetProvider>
    </ErrorBoundary>
  );
};

export default App;
