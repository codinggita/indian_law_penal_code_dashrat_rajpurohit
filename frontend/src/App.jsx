import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { Provider, useSelector, useDispatch } from 'react-redux';
import store from './store';
import { useAuth } from './hooks/useAuth';
import { toggleSidebar } from './store/uiSlice';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LawsListing from './pages/LawsListing';
import UsersManagement from './pages/UsersManagement';
import Profile from './pages/Profile';
import { Toaster } from 'react-hot-toast';

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
    { label: '📊 Dashboard Overview', path: '/dashboard' },
    { label: '⚖️ Penal Code Statutes', path: '/laws' },
    { label: '👤 Account Settings', path: '/profile' },
  ];

  if (isAdmin) {
    links.push({ label: '🛡️ User Controls (Admin)', path: '/users' });
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#0b0f19] text-slate-800 dark:text-slate-200 transition-colors duration-300">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 border-r border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl transition-transform duration-300 transform md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200/60 dark:border-slate-800/40">
          <span className="text-lg font-bold tracking-wider text-slate-800 dark:text-white uppercase flex items-center gap-2">
            🏛️ IPC Portal
          </span>
          <button onClick={() => dispatch(toggleSidebar())} className="md:hidden text-slate-400 hover:text-slate-600">
            ✕
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {links.map((link, idx) => {
            const active = location.pathname === link.path;
            return (
              <Link
                key={idx}
                to={link.path}
                className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 ${
                  active
                    ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 flex items-center justify-between px-8 border-b border-slate-200/60 dark:border-slate-800/40 bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl">
          <button onClick={() => dispatch(toggleSidebar())} className="text-slate-500 hover:text-slate-700 dark:hover:text-white transition-colors">
            ☰
          </button>

          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Welcome, <strong className="text-slate-750 dark:text-white">{user?.name}</strong>
            </span>
            <button
              onClick={logout}
              className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* Content Wrapper */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

// Root Router mapping
const AppContent = () => {
  return (
    <Routes>
      {/* Public Pages */}
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
  );
};

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" reverseOrder={false} />
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
