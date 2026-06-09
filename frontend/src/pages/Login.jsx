import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { authStart, authSuccess, authFailure } from '../store/authSlice';
import API from '../services/api';
import Input from '../components/Input';
import Button from '../components/Button';
import toast from 'react-hot-toast';

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">🏛️ Indian Law Portal</h2>
          <p className="text-sm text-slate-300">Sign in to access penal code records and bookmarks</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            placeholder="enter your email"
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.password}
            touched={formik.touched.password}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" disabled={formik.isSubmitting} className="mt-2">
            {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-400">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
