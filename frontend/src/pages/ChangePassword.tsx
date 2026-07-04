import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { SkeletonProfile } from '../components/Skeletons';
import { Flame, History, CalendarDays, ArrowLeft } from 'lucide-react';
import type { UserProfileStats } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';

export default function ChangePassword() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profile, setProfile] = useState<UserProfileStats | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const newPassword = watch('new_password');

  useEffect(() => {
    document.title = 'NutriLens | Change Password';
    const fetchProfile = async () => {
      setLoadingProfile(true);
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (error: any) {
        console.error(error);
        showToast('Failed to load user profile details', 'error');
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  const onSubmit = async (data: any) => {
    setIsUpdating(true);
    try {
      await userService.changePassword(data);
      showToast('Password changed successfully!', 'success');
      navigate('/profile');
    } catch (error: any) {
      console.error(error);
      const errMsg = error.response?.data?.detail || 'Failed to update password credentials.';
      showToast(errMsg, 'error');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="max-w-7xl mx-auto w-full">
        <SkeletonProfile />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full animate-fade-in pb-12 text-[#111827]">
      <PageHeader 
        title="Change Password" 
        description="Update your security parameters and account password." 
      />

      <div className="flex flex-col md:flex-row gap-6 items-start w-full">
        {/* LEFT COLUMN: Profile Stats Card */}
        <div className="w-full md:w-[320px] flex-shrink-0 flex flex-col gap-6">
          <Card className="flex flex-col items-center gap-4 relative overflow-hidden p-6 text-left">
            {/* Top blue border */}
            <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600"></div>

          {/* Avatar sphere */}
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-extrabold text-xl border-2 border-white shadow-sm mt-3 uppercase">
            {profile?.name.substring(0, 2)}
          </div>

          {/* User metadata */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-sm font-bold text-slate-900 capitalize">{profile?.name}</h3>
            <span className="text-[10px] text-slate-550 font-semibold mt-0.5">{profile?.email}</span>
            <Badge variant="primary" className="mt-2">
              {profile?.role} Account
            </Badge>
          </div>

          <div className="w-full border-t border-slate-200"></div>

          {/* Statistics grid */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-200 flex flex-col items-center gap-1">
              <History className="w-4.5 h-4.5 text-slate-400" />
              <span className="text-[8px] text-slate-550 font-bold uppercase block leading-none">Total Logs</span>
              <span className="text-xs font-extrabold text-slate-900 mt-0.5">{profile?.total_predictions}</span>
            </div>

            <div className="bg-slate-50/50 p-3 rounded-2xl border border-slate-200 flex flex-col items-center gap-1">
              <Flame className="w-4.5 h-4.5 text-amber-500 animate-pulse" />
              <span className="text-[8px] text-slate-550 font-bold uppercase block leading-none">Cals Mapped</span>
              <span className="text-xs font-extrabold text-slate-900 mt-0.5">{profile?.total_calories_consumed ? Math.round(profile.total_calories_consumed).toLocaleString() : 0}</span>
            </div>
          </div>

          {/* Detailed metadata */}
          <div className="w-full flex flex-col gap-2.5 text-[10px] font-bold text-slate-550 bg-slate-50/50 p-3 rounded-2xl border border-slate-200">
            <div className="flex justify-between">
              <span>Account Status:</span>
              <span className="text-emerald-600 font-extrabold">Active</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Member Since:</span>
              <span className="text-slate-900 flex items-center gap-1 font-bold">
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                {profile?.member_since ? new Date(profile.member_since).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* RIGHT COLUMN: Settings Form Actions */}
      <Card className="flex-grow w-full text-left">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="text-slate-450 hover:text-slate-700 cursor-pointer">
            <ArrowLeft className="w-4.5 h-4.5" />
          </Link>
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Change Password</h4>
            <p className="text-[10px] text-slate-505 font-semibold mt-0.5">Configure authentication credentials and login keys.</p>
          </div>
        </div>
        
        <div className="border-t border-slate-200 my-4"></div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <Input
            id="old_password"
            type="password"
            label="Current Password"
            placeholder="••••••••"
            error={errors.old_password?.message}
            {...register('old_password', { required: 'Old password is required' })}
          />

          <Input
            id="new_password"
            type="password"
            label="New Password"
            placeholder="••••••••"
            error={errors.new_password?.message}
            {...register('new_password', { 
              required: 'New password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters'
              }
            })}
          />

          <Input
            id="confirm_password"
            type="password"
            label="Confirm New Password"
            placeholder="••••••••"
            error={errors.confirm_password?.message}
            {...register('confirm_password', { 
              required: 'Confirm password is required',
              validate: (val) => val === newPassword || 'Passwords do not match'
            })}
          />

          <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate('/profile')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={isUpdating}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Card>
      </div>
    </div>
  );
}
