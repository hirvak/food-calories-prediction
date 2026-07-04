import { useState, useEffect } from 'react';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { SkeletonCard } from '../components/Skeletons';
import { Trash2, ShieldAlert, User, Search, ArrowLeft, ArrowRight, Lock, Filter, Users, AlertTriangle } from 'lucide-react';
import type { User as UserType } from '../types';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export default function UserManagement() {
  const { showToast } = useToast();
  const { user: currentUser } = useAuth();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'user' | 'admin'>('all');
  const [sortBy, setSortBy] = useState<'id_asc' | 'id_desc' | 'name_asc' | 'name_desc'>('id_asc');
  const [pageSize, setPageSize] = useState(6);

  // Deletion Modal
  const [deleteTargetUserId, setDeleteTargetUserId] = useState<number | null>(null);
  const [deleteTargetUserName, setDeleteTargetUserName] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await userService.getAdminUsers(1, 100);
      setUsers(data.users || []);
    } catch (error: any) {
      console.error(error);
      showToast('Failed to load user records list', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = 'NutriLens | User Management';
    fetchUsers();
  }, [showToast]);

  const handleDeleteTrigger = (id: number, name: string) => {
    setDeleteTargetUserId(id);
    setDeleteTargetUserName(name);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTargetUserId) return;
    const id = deleteTargetUserId;
    setDeleteTargetUserId(null);
    setDeletingId(id);
    try {
      await userService.deleteUser(id);
      showToast('User record deleted successfully', 'success');
      fetchUsers();
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.detail || 'Failed to delete user.';
      showToast(errMsg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  // Client-Side Search and Filter Logic
  const filteredUsers = users
    .filter((u) => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()))
    .filter((u) => {
      if (roleFilter === 'admin') return u.role === 'admin';
      if (roleFilter === 'user') return u.role === 'user';
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'id_desc') return b.id - a.id;
      if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
      if (sortBy === 'name_desc') return b.name.localeCompare(a.name);
      return a.id - b.id; // default: id_asc
    });

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  
  // Clamp page if out of bounds
  const activePage = Math.min(currentPage, totalPages);
  
  const displayedUsers = filteredUsers.slice((activePage - 1) * pageSize, activePage * pageSize);

  const totalPageAdmins = filteredUsers.filter((u) => u.role === 'admin').length;
  const totalPageUsers = filteredUsers.filter((u) => u.role === 'user').length;

  if (loading) {
    return (
      <div className="flex flex-col gap-6 max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full animate-fade-in pb-12">
      <PageHeader 
        title="Users" 
        description="Audit, monitor, and configure registered user accounts." 
      />

      {/* 1. Standardized Filter Bar */}
      <div className="bg-white p-4.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search accounts name / email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm font-semibold border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 bg-slate-50/50 focus:bg-white transition-all duration-200"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Role Filter */}
          <div className="flex items-center gap-2 text-xs font-bold text-[#6B7280]">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold text-[#111827] cursor-pointer"
            >
              <option value="all">All Roles</option>
              <option value="user">Normal Users</option>
              <option value="admin">Administrators</option>
            </select>
          </div>

          {/* Sorter */}
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value as any);
              setCurrentPage(1);
            }}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold text-[#111827] cursor-pointer"
          >
            <option value="id_asc">ID: Low to High</option>
            <option value="id_desc">ID: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>

          {/* Page Size */}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="h-9 px-3.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-xs font-bold text-[#111827] cursor-pointer"
          >
            <option value={6}>6 per page</option>
            <option value={12}>12 per page</option>
            <option value={24}>24 per page</option>
            <option value={48}>48 per page</option>
          </select>
        </div>
      </div>

      {/* Results Count Banner */}
      <div className="flex justify-between items-center text-xs font-bold text-[#6B7280]">
        {filteredUsers.length > 0 ? (
          <span>
            Showing {Math.min(filteredUsers.length, (activePage - 1) * pageSize + 1)}–{Math.min(filteredUsers.length, activePage * pageSize)} of {filteredUsers.length} {filteredUsers.length === 1 ? 'result' : 'results'}
          </span>
        ) : (
          <span>No results found</span>
        )}
        {filteredUsers.length > 0 && (
          <div className="flex gap-4 text-xs font-bold">
            <span>Admins: {totalPageAdmins}</span>
            <span>Users: {totalPageUsers}</span>
          </div>
        )}
      </div>

      {/* 2. Grid Cards List */}
      {displayedUsers.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayedUsers.map((item) => {
              const isSelf = currentUser?.id === item.id;
              const isOtherAdmin = item.role === 'admin' && !isSelf;

              return (
                <div 
                  key={item.id} 
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm flex flex-col justify-between overflow-hidden relative hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex flex-col gap-3">
                    {/* Header: role badge */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-semibold text-[#6B7280]">USER ID: #{item.id}</span>
                      
                      {item.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-105">
                          <ShieldAlert className="w-3.5 h-3.5" /> Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-105">
                          <User className="w-3.5 h-3.5" /> User
                        </span>
                      )}
                    </div>

                    <div className="border-t border-slate-200 my-1"></div>

                    {/* Avatar, name, email info */}
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 text-[#4B5563] flex items-center justify-center font-bold text-xs uppercase">
                        {item.name.substring(0, 2)}
                      </div>
                      <div className="min-w-0 text-left">
                        <h4 className="text-base font-semibold text-[#111827] truncate capitalize leading-none">{item.name}</h4>
                        <p className="text-xs text-[#6B7280] truncate mt-1 font-medium">{item.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Delete / Lock row */}
                  <div className="flex justify-end mt-3 border-t border-slate-100 pt-2.5">
                    {isSelf ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                        <Lock className="w-3 h-3" /> You
                      </span>
                    ) : isOtherAdmin ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg" title="Admins cannot delete other administrators">
                        <Lock className="w-3 h-3" /> Locked
                      </span>
                    ) : (
                      <button
                        onClick={() => handleDeleteTrigger(item.id, item.name)}
                        disabled={deletingId === item.id}
                        className="py-1.5 px-3 rounded-lg border border-rose-100 text-rose-500 hover:bg-rose-50 hover:border-rose-200 text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1.5 focus:outline-none"
                      >
                        {deletingId === item.id ? (
                          <div className="w-3 h-3 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5" /> Delete User
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 mt-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={activePage === 1}
                className="flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </Button>

              <div className="text-xs font-bold text-[#4B5563]">
                Page {activePage} of {totalPages}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={activePage === totalPages}
                className="flex items-center gap-1"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="flex flex-col items-center justify-center py-16 px-6 text-center gap-4 bg-white border border-slate-200/80 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-450">
            <Users className="w-6 h-6 text-slate-400" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <h3 className="text-sm font-bold text-[#111827]">No matching users found</h3>
            <p className="text-xs text-[#6B7280]">Try a different keyword or clear your filters.</p>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTargetUserId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-sm w-full shadow-premium flex flex-col gap-4 text-center">
            <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto" />
            <h3 className="font-extrabold text-slate-800 text-base">Delete User Account?</h3>
            <p className="text-xs text-slate-400 font-semibold">
              Are you sure you want to delete <span className="font-bold text-slate-700 capitalize">"{deleteTargetUserName}"</span>? All prediction logs associated with this user will be removed.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setDeleteTargetUserId(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-650 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 text-white font-semibold text-xs hover:bg-rose-700 transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
