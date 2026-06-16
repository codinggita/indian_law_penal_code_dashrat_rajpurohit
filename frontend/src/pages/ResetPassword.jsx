import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import Input from '../components/Input';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const formik = useFormik({
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      password: Yup.string().min(6, 'Password must be at least 6 characters').required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm new password'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await API.post('/auth/reset-password', {
          token,
          newPassword: values.password
        });
        toast.success('Security credential updated successfully.');
        navigate('/login');
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to update credential. Token may be invalid or expired.';
        toast.error(errorMsg);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row font-body antialiased selection:bg-primary selection:text-white">
      <Helmet>
        <title>Override Credential | Momentum OS</title>
      </Helmet>
      
      <div className="hidden md:flex flex-col w-1/2 relative brutal-border-thick border-r-0 overflow-hidden bg-ink text-bgBase">
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center mix-blend-luminosity opacity-40 grayscale"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAv_cXdwO-p1kJQQ_GCysuO_vv45s5L2eocoF49_jsiruwHkF0H9McNEPfO9w5F2AV8UOYxdcBJ40gA4GTeUZyVacPbUHlYLEixj0kuvZaqPRoiXEeTF-SVIjboG5A9Do9eD46sHMJGY0d8r39VsB2jy8Ubg2eU3z6PLi3gosaktV6vaS48aAHJn1FjbguQXHTHtz6YVsDGc5HomMSl-eAY4r4rx_ppK3Uf5F_44pFDxRv03yu7Cj82-88mB2rlECvNyac03JOw89M')",
            }}
          />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMiIvPgo8cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxIiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMSIvPgo8L3N2Zz4=')] opacity-50 mix-blend-overlay pointer-events-none" />
        </div>
        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div>
            <h1 className="font-headline font-black text-2xl tracking-tighter text-primary uppercase">
              IPC PORTAL v4.0.12 // ENCRYPTED CHANNEL
            </h1>
            <div className="w-16 h-1 bg-primary mt-4 brutal-border" />
          </div>
          <div className="space-y-6">
            <h2 className="font-display font-black text-6xl md:text-8xl leading-none tracking-tighter uppercase break-words">
              New
              <br />
              <span className="text-primary">Clearance.</span>
            </h2>
            <p className="font-body text-xl max-w-md border-l-4 border-primary pl-4 py-2 uppercase font-bold tracking-tight">
              Establish new security keys for administrative or operative access.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-bgBase bg-grid relative p-6 md:p-12 lg:p-20 min-h-screen overflow-y-auto">
        <div className="md:hidden mb-12 flex justify-between items-center brutal-border-thick p-4 bg-white shadow-brutal">
          <h1 className="font-headline font-black text-xl tracking-tighter text-primary uppercase">IPC PORTAL</h1>
          <span className="material-symbols-outlined text-3xl">enhanced_encryption</span>
        </div>
        <div className="w-full max-w-md mx-auto my-auto py-8">
          <div className="mb-10">
            <div className="inline-flex items-center gap-3 mb-4 bg-ink text-bgBase px-4 py-1 brutal-border font-label font-bold uppercase text-sm tracking-widest shadow-brutal">
              <span className="material-symbols-outlined text-primary text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                password
              </span>
              Security Protocol
            </div>
            <h2 className="font-headline font-black text-5xl uppercase tracking-tighter text-ink">Establish New Keys</h2>
          </div>

          {!token ? (
            <div className="brutal-border bg-yellow-300 p-4 shadow-brutal">
              <h3 className="font-mono text-sm font-bold uppercase text-black flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span> Missing Security Token
              </h3>
              <p className="font-body text-sm mt-2 text-black">
                A valid token is required to reset your password. Please check the link in your email.
              </p>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-8">
              <Input
                label="New Security Key [PASSWORD]"
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
                label="Confirm Security Key"
                name="confirmPassword"
                type="password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.errors.confirmPassword}
                touched={formik.touched.confirmPassword}
                placeholder="••••••••••••"
                icon="key"
                required
              />

              <button
                disabled={formik.isSubmitting}
                className="w-full py-4 brutal-btn text-xl flex justify-center items-center gap-3 group mt-8 disabled:opacity-50"
                type="submit"
              >
                {formik.isSubmitting ? 'Processing...' : 'Confirm Override'}
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">verified_user</span>
              </button>
            </form>
          )}

          <div className="mt-12 text-center">
            <p className="font-body text-ink text-sm font-medium">
              REMEMBER YOUR CREDENTIALS?{' '}
              <Link to="/login" className="font-label font-bold uppercase underline decoration-2 hover:text-primary transition-colors">
                Return to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
