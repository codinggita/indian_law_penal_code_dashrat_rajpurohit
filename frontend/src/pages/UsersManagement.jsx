import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import Table from '../components/Table';
import Button from '../components/Button';
import API from '../services/api';
import toast from 'react-hot-toast';

const UsersManagement = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/admin/users');
      setUsers(response.data.data ?? []);
    } catch (err) {
      toast.error('Failed to load system users database.');
    } finally {
      setLoading(false);
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
      await API.patch(actionEndpoint);
      toast.success(`User ${userRecord.name} was successfully ${isBanned ? 'unbanned' : 'banned'}!`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to update ban status.');
    }
  };

  const handleRoleChange = async (userId, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await API.patch(`/admin/users/${userId}/role`, { role: nextRole });
      toast.success(`Role updated successfully to ${nextRole}!`);
      fetchUsers();
    } catch (err) {
      toast.error('Failed to modify user role settings.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl max-w-md text-red-600 dark:text-red-400">
          ⚠️ <strong>Access Denied:</strong> This administrative portal requires active Admin role clearance levels.
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
        className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50 hover:bg-indigo-100 transition-colors uppercase"
      >
        {row.role}
      </button>
    ),
    (row) => (
      <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${row.isBanned ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
        {row.isBanned ? 'Banned' : 'Active'}
      </span>
    ),
    (row) => new Date(row.createdAt).toLocaleDateString(),
  ];

  const actions = (row) => (
    <Button
      variant={row.isBanned ? 'secondary' : 'danger'}
      onClick={() => handleBanToggle(row)}
      className="px-3 py-1.5 text-xs font-semibold rounded-lg"
    >
      {row.isBanned ? 'Unban User' : 'Ban User'}
    </Button>
  );

  return (
    <div className="flex-1 flex flex-col p-8 gap-6 overflow-y-auto">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 tracking-wide">
          🛡️ Admin User Control Center
        </h2>
        <p className="text-sm text-slate-400">Manage user authorization roles, review flags, and toggle bans</p>
      </div>

      <Table
        headers={headers}
        data={users}
        columns={columns}
        actions={actions}
        loading={loading}
      />
    </div>
  );
};

export default UsersManagement;
