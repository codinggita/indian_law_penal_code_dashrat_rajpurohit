import { useSelector, useDispatch } from 'react-redux';
import { logout as logoutAction } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutAction());
  };

  const isAdmin = user?.role === 'admin';

  return {
    user,
    token,
    isAuthenticated,
    loading,
    error,
    isAdmin,
    logout,
  };
};
