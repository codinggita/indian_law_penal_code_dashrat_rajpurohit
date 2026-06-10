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

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
      email: Yup.string().email('Invalid email address').required('Email is required'),
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      dispatch(authStart());
      try {
        const { confirmPassword, ...registerPayload } = values;
        const response = await API.post('/auth/register', registerPayload);
        dispatch(authSuccess({ token: response.data.data.token, user: response.data.data.user }));
        toast.success(`Account created successfully! Welcome, ${response.data.data.user.name}!`);
        navigate('/dashboard');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Registration failed. Please try again.';
        dispatch(authFailure(errorMsg));
        toast.error(errorMsg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body antialiased selection:bg-primary selection:text-white">
      <Helmet>
        <title>Operator Enlistment | Momentum OS</title>
        <meta name="description" content="Register an official operator account on the Momentum Penal Code Registry system." />
        <meta property="og:title" content="Operator Enlistment - Momentum OS" />
        <meta property="og:description" content="Create operator credentials for data queries." />
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
              The Machine
              <br />
              <span className="text-primary">Never Stops.</span>
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
              <span className="w-3 h-3 bg-white rounded-none inline-block brutal-border" /> Secure Enlistment Node
            </span>
          </div>
        </div>
      </div>

      {/* Right Side: Enlistment Form */}
      <div className="flex-1 flex flex-col justify-center bg-bgBase bg-grid relative p-6 md:p-12 lg:p-24 h-screen overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden mb-12 flex justify-between items-center brutal-border-thick p-4 bg-white shadow-brutal">
          <h1 className="font-headline font-black text-xl tracking-tighter text-primary uppercase">IPC PORTAL</h1>
          <span className="material-symbols-outlined text-3xl">enhanced_encryption</span>
        </div>
        <div className="w-full max-w-md mx-auto py-8">
          <div className="mb-8">
            <div className="inline-flex items-center gap-3 mb-4 bg-ink text-bgBase px-4 py-1 brutal-border font-label font-bold uppercase text-sm tracking-widest shadow-brutal">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                terminal
              </span>
              Enlistment Registry
            </div>
            <h2 className="font-headline font-black text-5xl uppercase tracking-tighter text-ink">Operator Enlistment</h2>
            <p className="font-body text-ink mt-2 font-medium">Create your official credentials to participate in statutory query operations.</p>
          </div>
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <Input
              label="Legal Full Name [NAME]"
              name="name"
              type="text"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.name}
              touched={formik.touched.name}
              placeholder="Enter designated full name"
              icon="person"
              required
            />

            <Input
              label="Operator Identifier [USER_ID / EMAIL]"
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

            <Input
              label="Verify Security Token [VERIFY_ACCESS_KEY]"
              name="confirmPassword"
              type="password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.errors.confirmPassword}
              touched={formik.touched.confirmPassword}
              placeholder="••••••••••••"
              icon="lock"
              required
            />

            <button
              disabled={formik.isSubmitting}
              className="w-full py-4 brutal-btn text-xl flex justify-center items-center gap-3 group mt-8 disabled:opacity-50"
              type="submit"
            >
              {formik.isSubmitting ? 'Enlisting...' : 'Enlist Account'}
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">login</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="font-body text-ink text-sm font-medium">
              ALREADY REGISTERED?{' '}
              <Link to="/login" className="font-label font-bold uppercase underline decoration-2 hover:text-primary transition-colors">
                Login Here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
