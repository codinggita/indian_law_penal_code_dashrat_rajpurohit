import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authStart, authSuccess, authFailure } from '../store/authSlice';
import API from '../services/api';
import Input from '../components/Input';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      dispatch(authStart());
      try {
        const response = await API.post('/auth/login', values);
        dispatch(authSuccess({ token: response.data.data.token, user: response.data.data.user }));
        toast.success(`Welcome back, ${response.data.data.user.name}!`);
        navigate('/dashboard');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Login failed. Please check your credentials.';
        dispatch(authFailure(errorMsg));
        toast.error(errorMsg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleQuickAdminLogin = async () => {
    dispatch(authStart());
    const credentials = { email: 'admin@example.com', password: 'password123' };
    try {
      const response = await API.post('/auth/login', credentials);
      dispatch(authSuccess({ token: response.data.data.token, user: response.data.data.user }));
      toast.success(`Logged in as Admin, welcome ${response.data.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.data?.message?.includes('credentials')) {
        // User doesn't exist, create on the fly
        try {
          const regRes = await API.post('/auth/register', {
            name: 'Admin Test',
            email: 'admin@example.com',
            password: 'password123'
          });
          // Promote to admin
          await API.patch(`/admin/users/${regRes.data.data.user.id}/role`, { role: 'admin' }, {
            headers: { Authorization: `Bearer ${regRes.data.data.token}` }
          });
          dispatch(authSuccess({ token: regRes.data.data.token, user: { ...regRes.data.data.user, role: 'admin' } }));
          toast.success(`Admin registered and logged in successfully!`);
          navigate('/dashboard');
        } catch (regErr) {
          dispatch(authFailure(regErr.response?.data?.message || 'Admin login failed'));
          toast.error('Failed to create Admin account.');
        }
      } else {
        dispatch(authFailure(err.response?.data?.message || 'Admin login failed'));
        toast.error('Failed to access Admin account.');
      }
    }
  };

  const handleQuickGuestLogin = async () => {
    dispatch(authStart());
    const credentials = { email: 'guest@example.com', password: 'password123' };
    try {
      const response = await API.post('/auth/login', credentials);
      dispatch(authSuccess({ token: response.data.data.token, user: response.data.data.user }));
      toast.success(`Logged in as Guest, welcome ${response.data.data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      if (err.response?.status === 401 || err.response?.data?.message?.includes('credentials')) {
        // Guest doesn't exist, register silently
        try {
          const regRes = await API.post('/auth/register', {
            name: 'Guest Operator',
            email: 'guest@example.com',
            password: 'password123'
          });
          dispatch(authSuccess({ token: regRes.data.data.token, user: regRes.data.data.user }));
          toast.success(`Registered and logged in as Guest! Welcome, Guest Operator!`);
          navigate('/dashboard');
        } catch (regErr) {
          dispatch(authFailure(regErr.response?.data?.message || 'Demo access failed'));
          toast.error('Failed to create guest account.');
        }
      } else {
        dispatch(authFailure(err.response?.data?.message || 'Demo access failed'));
        toast.error('Failed to access guest account.');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body antialiased selection:bg-primary selection:text-white">
      <Helmet>
        <title>Identification & Access | Momentum OS</title>
        <meta name="description" content="Provide your legal operator credentials to authenticate session with the Indian Penal Code portal." />
        <meta property="og:title" content="Operator Identification - Momentum OS" />
        <meta property="og:description" content="Secure access authentication gateway." />
      </Helmet>
      {/* Left Side: Visual / Brand */}
      <div className="hidden md:flex flex-col w-1/2 relative brutal-border-thick border-r-0 overflow-hidden bg-ink text-bgBase">
        {/* Abstract Industrial Imagery Container */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center mix-blend-luminosity opacity-40 grayscale"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAv_cXdwO-p1kJQQ_GCysuO_vv45s5L2eocoF49_jsiruwHkF0H9McNEPfO9w5F2AV8UOYxdcBJ40gA4GTeUZyVacPbUHlYLEixj0kuvZaqPRoiXEeTF-SVIjboG5A9Do9eD46sHMJGY0d8r39VsB2jy8Ubg2eU3z6PLi3gosaktV6vaS48aAHJn1FjbguQXHTHtz6YVsDGc5HomMSl-eAY4r4rx_ppK3Uf5F_44pFDxRv03yu7Cj82-88mB2rlECvNyac03JOw89M')",
            }}
          />
          {/* Overlay pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50 mix-blend-overlay pointer-events-none" />
        </div>
        {/* Content Overlay */}
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div>
            <h1 className="font-headline font-black text-2xl tracking-tighter text-primary uppercase">
              IPC PORTAL v4.0.12 // ENCRYPTED CHANNEL
            </h1>
            <div className="w-16 h-1 bg-primary mt-4 brutal-border" />
          </div>
          <div className="space-y-6">
            <h2 className="font-display font-black text-6xl md:text-8xl leading-none tracking-tighter uppercase break-words">
              The Law
              <br />
              <span className="text-primary">Never Sleeps.</span>
            </h2>
            <p className="font-body text-xl max-w-md border-l-4 border-primary pl-4 py-2 uppercase font-bold tracking-tight">
              Indian Penal Code Protocol Active. Awaiting Operator Input.
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm font-label uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-primary rounded-none inline-block brutal-border" /> System Online
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-white rounded-none inline-block brutal-border" /> Secure Node Alpha
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Identification Form */}
      <div className="flex-1 flex flex-col bg-bgBase bg-grid relative p-6 md:p-12 lg:p-20 min-h-screen overflow-y-auto">
        {/* Mobile Header (Hidden on md) */}
        <div className="md:hidden mb-12 flex justify-between items-center brutal-border-thick p-4 bg-white shadow-brutal">
          <h1 className="font-headline font-black text-xl tracking-tighter text-primary uppercase">IPC PORTAL</h1>
          <span className="material-symbols-outlined text-3xl">enhanced_encryption</span>
        </div>
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 mb-4 bg-ink text-bgBase px-4 py-1 brutal-border font-label font-bold uppercase text-sm tracking-widest shadow-brutal">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                terminal
              </span>
              Terminal Access
            </div>
            <h2 className="font-headline font-black text-5xl uppercase tracking-tighter text-ink">Identification</h2>
            <p className="font-body text-ink mt-2 font-medium">Please provide your legal credentials to interface with the core.</p>
          </div>

          {/* Quick Access Credentials Cards */}
          <div className="mb-8 p-4 brutal-border bg-white shadow-brutal text-left">
            <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-primary mb-3">// QUICK BYPASS CREDENTIALS</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleQuickAdminLogin}
                className="brutal-border p-3 flex flex-col items-start gap-1 bg-[#D90429] text-white hover:bg-black transition-colors shadow-brutalist-sm text-left active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">admin_panel_settings</span>
                  <span className="font-headline font-black text-xs uppercase tracking-tight">ADMIN MODE</span>
                </div>
                <span className="font-mono text-[9px] opacity-85 leading-tight uppercase font-bold">Clearance Level 5. Full system CRUD.</span>
              </button>

              <button
                type="button"
                onClick={handleQuickGuestLogin}
                className="brutal-border p-3 flex flex-col items-start gap-1 bg-black text-white hover:bg-[#D90429] transition-colors shadow-brutalist-sm text-left active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
              >
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">gavel</span>
                  <span className="font-headline font-black text-xs uppercase tracking-tight">GUEST MODE</span>
                </div>
                <span className="font-mono text-[9px] opacity-85 leading-tight uppercase font-bold">Clearance Level 1. Read-only access.</span>
              </button>
            </div>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-8">
            <Input
              label="Legal Credentials [USER_ID]"
              name="email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.email}
              touched={formik.touched.email}
              placeholder="Enter designated identifier"
              icon="badge"
              required
            />

            <Input
              label="Security Token [ACCESS_KEY]"
              name="password"
              type="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.password}
              touched={formik.touched.password}
              placeholder="••••••••••••"
              icon="key"
              required
            />

            <div className="flex justify-end items-center pt-0">
              <Link
                to="/forgot-password"
                className="font-label text-sm font-bold uppercase text-primary hover:text-ink transition-colors underline decoration-2 underline-offset-4"
              >
                Reset Access?
              </Link>
            </div>

            <button
              disabled={formik.isSubmitting}
              className="w-full py-4 brutal-btn text-xl flex justify-center items-center gap-3 group mt-8 disabled:opacity-50"
              type="submit"
            >
              {formik.isSubmitting ? 'Authenticating...' : 'Authenticate Session'}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">login</span>
            </button>
          </form>

          <div className="mt-12">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t-4 border-ink" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-bgBase font-label font-bold uppercase tracking-widest text-ink">External Authentication</span>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-1 gap-4">
              <button className="w-full py-3 px-4 brutal-btn-outline flex justify-center items-center gap-3" type="button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                GOOGLE CENTRAL
              </button>
              <button className="w-full py-3 px-4 brutal-btn-outline flex justify-center items-center gap-3" type="button">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.379.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z"
                    fillRule="evenodd"
                  />
                </svg>
                GITHUB REPOSITORY
              </button>
            </div>
          </div>
          <div className="mt-12 text-center">
            <p className="font-body text-ink text-sm font-medium">
              NEW OPERATOR?{' '}
              <Link to="/register" className="font-label font-bold uppercase underline decoration-2 hover:text-primary transition-colors">
                Register Account
              </Link>
            </p>
          </div>
        </div>
        {/* Bottom right decorative element */}
        <div className="absolute bottom-4 right-4 hidden lg:flex flex-col items-end opacity-50 select-none pointer-events-none text-ink">
          <span className="material-symbols-outlined text-4xl mb-2">grid_4x4</span>
          <span className="font-mono text-xs tracking-widest font-bold">SEC-GRID-110A</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
