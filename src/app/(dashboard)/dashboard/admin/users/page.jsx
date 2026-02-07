'use client';

import React, { useState, useEffect } from 'react';
import { Users, Search, MoreVertical, Filter, Download, Lock, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '@/lib/api';
import { toast } from 'react-hot-toast';
import { exportUsersCSV } from '@/utils/exportUtils';
import LuxurySelect from '@/components/shared/LuxurySelect';

const roleColors = {
  admin: 'bg-purple-500/10 text-purple-500',
  agent: 'bg-blue-500/10 text-blue-500',
  management: 'bg-emerald-500/10 text-emerald-500',
  customer: 'bg-zinc-500/10 text-zinc-500',
};

const statusColors = {
  active: 'bg-emerald-500/10 text-emerald-500',
  inactive: 'bg-red-500/10 text-red-500',
};

const AdminUsersPage = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [activeMenu, setActiveMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUsers = React.useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await api.admin.getUsers({ 
        role: roleFilter === 'all' ? undefined : roleFilter,
        search: searchQuery || undefined,
        page,
        limit: 10
      });
      setUsers(response.data.users);
      setTotalPages(response.data.pagination.pages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
      setLoading(false);
    }
  }, [roleFilter, searchQuery]);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage, fetchUsers]);

  // Use a separate handler or effect that doesn't trigger sync warnings
  const handleFilterChange = (type, value) => {
    if (type === 'role') setRoleFilter(value);
    if (type === 'search') setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on filter change
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
      await api.admin.updateUserStatus(userId, newStatus);
      setUsers(users.map(u => u._id === userId ? { ...u, status: newStatus } : u));
      toast.success('User status updated successfully');
      setActiveMenu(null);
    } catch {
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This will deactivate their account.')) return;
    
    try {
      await api.admin.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully');
      setActiveMenu(null);
    } catch {
      toast.error('Failed to delete user');
    }
  };


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
          <h1 className="text-2xl sm:text-4xl font-bold text-zinc-100 flex items-center gap-3">
            <Users className="text-brand-gold w-6 h-6 sm:w-8 sm:h-8" />
            User Management
          </h1>
          <p className="text-zinc-400 mt-1 sm:mt-2 text-sm sm:text-lg">
            Manage user roles and permissions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportUsersCSV(users)}
            disabled={users.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-white/5 border border-white/10 text-zinc-300 rounded-xl font-bold hover:bg-white/10 transition-all disabled:opacity-50 text-xs sm:text-base"
          >
            <Download size={16} className="text-brand-gold" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 sm:gap-4">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search users..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-2.5 sm:py-3 outline-none focus:border-brand-gold/50 text-sm"
          />
        </div>
        <div className="flex items-center gap-3">
          <Filter size={16} className="text-zinc-400 shrink-0" />
          <div className="flex-1 sm:w-48">
            <LuxurySelect
              value={roleFilter}
              onChange={(val) => handleFilterChange('role', val)}
              options={[
                { label: 'All Roles', value: 'all' },
                { label: 'Customers', value: 'customer' },
                { label: 'Agents', value: 'agent' },
                { label: 'Management', value: 'management' },
                { label: 'Admins', value: 'admin' },
              ]}
              className="!py-2.5 sm:!py-3 rounded-xl text-sm"
            />
          </div>
        </div>
      </div>

      {/* Users List (Mobile Card View) */}
      <div className="lg:hidden space-y-4">
        {users.map((user) => {
          const isSelf = currentUser?.id === user._id || currentUser?._id === user._id;
          return (
            <div key={user._id} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-zinc-100">{user.name}</div>
                  <div className="text-xs text-zinc-500">{user.email}</div>
                </div>
                {!isSelf && (
                  <div className="relative">
                    <button 
                      onClick={() => setActiveMenu(activeMenu === user._id ? null : user._id)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    <AnimatePresence>
                      {activeMenu === user._id && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                          >
                            <div className="p-2">
                              <button
                                onClick={() => handleDeleteUser(user._id)}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                                Delete User
                              </button>
                            </div>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Role</div>
                  <LuxurySelect
                    value={user.role}
                    onChange={(val) => handleRoleChange(user._id, val)}
                    disabled={isSelf}
                    options={[
                      { label: 'Customer', value: 'customer' },
                      { label: 'Agent', value: 'agent' },
                      { label: 'Management', value: 'management' },
                      { label: 'Admin', value: 'admin' },
                    ]}
                    className={`!py-2 rounded-lg font-bold text-xs uppercase ${roleColors[user.role]} border-0`}
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase text-zinc-500 font-bold tracking-wider">Status</div>
                  <LuxurySelect
                    value={user.status}
                    onChange={(val) => handleStatusChange(user._id, val)}
                    disabled={isSelf}
                    options={[
                      { label: 'Active', value: 'active' },
                      { label: 'Inactive', value: 'inactive' },
                    ]}
                    className={`!py-2 rounded-lg font-bold text-xs uppercase ${statusColors[user.status]} border-0`}
                  />
                </div>
              </div>
              <div className="text-[10px] text-zinc-500 pt-2">
                Joined {new Date(user.createdAt).toLocaleDateString()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Users Table (Desktop View) */}
      <div className="hidden lg:block bg-white/5 border border-white/5 rounded-3xl min-h-[400px]">
        <div className="overflow-x-auto min-h-[400px]">
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
              {users.map((user) => {
                const isSelf = currentUser?.id === user._id || currentUser?._id === user._id;
                
                return (
                  <tr key={user._id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-bold text-zinc-100">{user.name}</div>
                      <div className="text-xs text-zinc-500">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value)}
                        disabled={isSelf}
                        className={`${roleColors[user.role]} px-3 py-1 rounded-full font-bold text-xs uppercase bg-transparent border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="customer">Customer</option>
                        <option value="agent">Agent</option>
                        <option value="management">Management</option>
                        <option value="admin">Admin</option>
                      </select>
                      {isSelf && <Lock size={12} className="text-zinc-600" title="Cannot change your own role" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <select
                        value={user.status}
                        onChange={(e) => handleStatusChange(user._id, e.target.value)}
                        disabled={isSelf}
                        className={`${statusColors[user.status]} px-3 py-1 rounded-full font-bold text-xs uppercase bg-transparent border-0 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      {isSelf && <Lock size={12} className="text-zinc-600" title="Cannot change your own status" />}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {!isSelf && (
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === user._id ? null : user._id)}
                          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <MoreVertical size={18} />
                        </button>

                        <AnimatePresence>
                          {activeMenu === user._id && (
                            <>
                              <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setActiveMenu(null)}
                              />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 mt-2 w-48 bg-zinc-900 border border-white/10 rounded-xl shadow-2xl z-20 overflow-hidden"
                              >
                                <div className="p-2">
                                  <button
                                    onClick={() => handleDeleteUser(user._id)}
                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                  >
                                    <Trash2 size={16} />
                                    Delete User
                                  </button>
                                </div>
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
            </tbody>
          </table>
        </div>
        {!loading && users.length === 0 && (
          <div className="p-12 text-center">
            <Users size={48} className="mx-auto text-zinc-700 mb-4" />
            <div className="text-zinc-400">No users found</div>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-xs text-zinc-500">
            Showing Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-zinc-400 disabled:opacity-50 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-zinc-400 disabled:opacity-50 hover:bg-white/10 transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminUsersPage;
