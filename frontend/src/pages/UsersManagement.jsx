import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useAuth } from '../hooks/useAuth';
import Table from '../components/Table';
import Button from '../components/Button';
import SkeletonLoader from '../components/SkeletonLoader';
import API from '../services/api';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  updateUserSuccess,
} from '../store/userSlice';

const UsersManagement = () => {
  const { isAdmin } = useAuth();
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.user);

  const fetchUsers = async () => {
    dispatch(getUsersStart());
    try {
      const response = await API.get('/admin/users');
      dispatch(getUsersSuccess(response.data.data ?? []));
    } catch (err) {
      dispatch(getUsersFailure('Failed to load system users database.'));
      toast.error('Failed to load system users database.');
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const handleBanToggle = async (userRecord) => {
    const isBanned = userRecord.isBanned;
    const actionEndpoint = `/admin/users/${userRecord._id}/${isBanned ? 'unban' : 'ban'}`;
    try {
      const response = await API.patch(actionEndpoint);
      // Fulfill real-time UI updates via Redux update action
      dispatch(updateUserSuccess(response.data.data));
      toast.success(`User ${userRecord.name} was successfully ${isBanned ? 'unbanned' : 'banned'}!`);
    } catch (err) {
      toast.error('Failed to update ban status.');
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const response = await API.patch(`/admin/users/${userId}/role`, { role: nextRole });
      dispatch(updateUserSuccess(response.data.data));
      toast.success(`Role updated successfully to ${nextRole}!`);
    } catch (err) {
      toast.error('Failed to modify user role settings.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-8 bg-sandy dark:bg-black">
        <Helmet>
          <title>Access Denied | Momentum OS</title>
        </Helmet>
        <div className="p-8 text-center bg-crimson/15 border-2 border-black dark:border-white rounded-none max-w-md text-black dark:text-white shadow-brutalist-md dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.85)]">
          ⚠️ <strong className="font-mono uppercase">Access Denied:</strong> This administrative portal requires active Admin role clearance levels.
        </div>
      </div>
    );
  }

  const headers = ['Name', 'Email Address', 'Role Privilege', 'Status', 'Registration Date'];
  const columns = [
    'name',
    'email',
    (row) => (
      <button
        onClick={() => handleRoleChange(row._id, row.role)}
        className="px-2.5 py-1 text-xs font-mono font-bold rounded-none border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white hover:bg-crimson hover:text-white dark:hover:bg-crimson transition-colors uppercase shadow-brutalist-sm"
      >
        {row.role}
      </button>
    ),
    (row) => (
      <span className={`px-2 py-0.5 rounded-none border border-black dark:border-white text-xs font-mono font-bold uppercase ${row.isBanned ? 'bg-crimson text-white' : 'bg-white text-black'}`}>
        {row.isBanned ? 'Banned' : 'Active'}
      </span>
    ),
    (row) => <span className="font-mono text-xs font-bold">{new Date(row.createdAt).toLocaleDateString()}</span>,
  ];

  const actions = (row) => (
    <Button
      variant={row.isBanned ? 'secondary' : 'danger'}
      onClick={() => handleBanToggle(row)}
      className="px-3 py-1 text-xs font-bold rounded-none"
    >
      {row.isBanned ? 'Unban User' : 'Ban User'}
    </Button>
  );

  return (
    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto bg-sandy dark:bg-black text-black dark:text-white">
      <Helmet>
        <title>Operator Control Center | Momentum OS</title>
        <meta name="description" content="Administrative control center to manage system operators, privileges, and authorization bans." />
        <meta property="og:title" content="Operator Control Center - Momentum OS" />
        <meta property="og:description" content="Admin panel for operator credentials and access states." />
      </Helmet>
      <div className="flex flex-col gap-1.5 text-left">
        <h2 className="font-display text-4xl uppercase tracking-wider text-black dark:text-white">
          🛡️ Admin User Control Center
        </h2>
        <p className="font-mono text-xs uppercase tracking-widest text-black/60 dark:text-white/60">Manage user authorization roles, review flags, and toggle bans</p>
      </div>

      {loading ? (
        <SkeletonLoader type="table" count={5} />
      ) : (
        <Table
          headers={headers}
          data={users}
          columns={columns}
          actions={actions}
          loading={loading}
        />
      )}
    </div>
  );
};

export default UsersManagement;
