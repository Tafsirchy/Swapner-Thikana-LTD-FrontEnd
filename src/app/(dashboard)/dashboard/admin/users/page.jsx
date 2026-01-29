'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Filter, Download } from 'lucide-react';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { exportUsersCSV } from '@/utils/exportUtils';

const roleColors = {
  admin: 'bg-purple-500/10 text-purple-500',
  agent: 'bg-blue-500/10 text-blue-500',
  management: 'bg-emerald-500/10 text-emerald-500',
  customer: 'bg-zinc-500/10 text-zinc-500',
};

const statusColors = {
  active: 'bg-emerald-500/10 text-emerald-500',
  inactive: 'bg-red-500/10 text-red-500',
 suspended: 'bg-yellow-500/10 text-yellow-500',
};

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getUsers();
      setUsers(data.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.admin.updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated successfully');
    } catch {
      toast.error('Failed to update user role');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      const isActive = newStatus === 'active';
      await api.admin.updateUserStatus(userId, isActive);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      toast.success('User status updated successfully');
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-20 bg-white/5 rounded-2xl animate-pulse border border-white/5"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <Users size={32} className="text-brand-gold" />
            User Management
          </h1>
          <p className="text-zinc-400 mt-1">
            Manage user roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportUsersCSV(users)}
            disabled={users.length === 0}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-zinc-300 rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <Download size={18} className="text-brand-gold" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-brand-gold/50"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-zinc-400" />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-zinc-100 outline-none focus:border-brand-gold/50 cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="customer">Customers</option>
            <option value="agent">Agents</option>
            <option value="management">Management</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-zinc-400">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">User</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Role</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Status</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Joined</th>
                <th className="px-6 py-4 font-bold uppercase tracking-wider text-xs">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-zinc-100">{user.name}</div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      className={`${roleColors[user.role]} px-3 py-1 rounded-full font-bold text-xs uppercase bg-transparent border-0 cursor-pointer`}
                    >
                      <option value="customer">Customer</option>
                      <option value="agent">Agent</option>
                      <option value="management">Management</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.status}
                      onChange={(e) => handleStatusChange(user._id, e.target.value)}
                      className={`${statusColors[user.status]} px-3 py-1 rounded-full font-bold text-xs uppercase bg-transparent border-0 cursor-pointer`}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          No users found matching your criteria
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;
