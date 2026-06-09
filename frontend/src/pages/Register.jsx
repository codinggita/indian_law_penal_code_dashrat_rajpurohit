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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-white/10 dark:bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col gap-6">
        <div className="text-center flex flex-col gap-2">
          <h2 className="text-3xl font-extrabold text-white tracking-wide">🏛️ Register Portal</h2>
          <p className="text-sm text-slate-300">Create an account to explore legal dashboard databases</p>
        </div>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Full Name"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.name}
            touched={formik.touched.name}
            placeholder="John Doe"
            required
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.email}
            touched={formik.touched.email}
            placeholder="johndoe@email.com"
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
          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.errors.confirmPassword}
            touched={formik.touched.confirmPassword}
            placeholder="••••••••"
            required
          />

          <Button type="submit" variant="primary" disabled={formik.isSubmitting} className="mt-2">
            {formik.isSubmitting ? 'Registering...' : 'Register'}
          </Button>
        </form>

        <div className="text-center text-sm text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
