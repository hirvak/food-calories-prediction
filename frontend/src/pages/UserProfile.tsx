import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import { useToast } from '../context/ToastContext';
import { SkeletonProfile } from '../components/Skeletons';
import { UserRoundPen, KeyRound } from 'lucide-react';
import type { UserProfileStats } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';

export default function UserProfile() {
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfileStats | null>(null);


  useEffect(() => {
    document.title = 'NutriLens | Profile';
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await userService.getProfile();
        setProfile(data);
      } catch (error: any) {
        console.error(error);
        showToast('Failed to load user profile details', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [showToast]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto w-full">
        <SkeletonProfile />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto w-full animate-fade-in pb-12 text-[#111827]">
      <PageHeader 
        title="Profile" 
        description="Monitor your account statistics and update settings." 
      />

      <div className="flex flex-col md:flex-row gap-6 items-start w-full">
        {/* LEFT COLUMN: User Metadata summary card */}
        <div className="w-full md:w-[30%] flex-shrink-0 flex flex-col gap-6">
          <Card className="flex flex-col items-center gap-4 relative overflow-hidden p-6 text-left">
          {/* Top blue outline border */}
          <div className="absolute top-0 inset-x-0 h-1.5 bg-blue-600"></div>

          {/* Avatar sphere */}
          <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2563EB] flex items-center justify-center font-extrabold text-xl border-2 border-white shadow-sm mt-3 uppercase">
            {profile?.name.substring(0, 2)}
          </div>

          {/* User metadata */}
          <div className="flex flex-col items-center text-center">
            <h3 className="text-xl font-extrabold text-[#111827] capitalize tracking-tight">{profile?.name}</h3>
            <span className="text-sm text-slate-500 font-medium mt-0.5">{profile?.email}</span>
            <Badge variant="primary" className="mt-2 text-[10px] px-2.5 py-0.5 uppercase font-bold tracking-wider opacity-90 scale-95">
              {profile?.role}
            </Badge>
          </div>

          <div className="w-full border-t border-slate-200"></div>

          {/* Statistics grid */}
          <div className="w-full grid grid-cols-2 gap-3">
            <div className="bg-slate-50/40 p-3.5 rounded-2xl border border-slate-200 flex flex-col items-center gap-1.5 flex-1">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide leading-none">Total Logs</span>
              <span className="text-lg font-extrabold text-[#111827] mt-0.5">{profile?.total_predictions}</span>
            </div>

            <div className="bg-slate-50/40 p-3.5 rounded-2xl border border-slate-200 flex flex-col items-center gap-1.5 flex-1">
              <span className="text-[10px] font-bold text-[#6B7280] uppercase tracking-wide leading-none">Cals Mapped</span>
              <span className="text-lg font-extrabold text-[#111827] mt-0.5">{profile?.total_calories_consumed ? Math.round(profile.total_calories_consumed).toLocaleString() : 0}</span>
            </div>
          </div>

          {/* Detailed metadata */}
          <div className="w-full grid grid-cols-2 gap-3 text-left bg-slate-50/40 p-3.5 rounded-2xl border border-slate-200 text-xs font-semibold text-[#4B5563]">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wide">Status</span>
              <span className="text-sm font-extrabold text-emerald-600">Active</span>
            </div>
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] text-[#6B7280] uppercase tracking-wide">Joined</span>
              <span className="text-sm font-extrabold text-[#111827] truncate">
                {profile?.member_since ? new Date(profile.member_since).toLocaleDateString() : 'N/A'}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* RIGHT COLUMN: Settings Dashboard Actions */}
      <Card className="w-full md:w-[70%] text-left p-6 flex flex-col gap-6">
        <div>
          <h2 className="text-[22px] font-semibold text-[#111827] tracking-tight">Account Settings</h2>
          <p className="text-sm text-[#6B7280] mt-1">Modify your login credentials and profile metadata.</p>
        </div>
        
        <div className="border-t border-slate-200"></div>

        <div className="flex flex-col gap-4">
          {/* Action Row 1: Profile metadata update */}
          <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-200 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <UserRoundPen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#111827]">Edit Name & Email</span>
                <span className="text-xs text-[#6B7280] mt-1">Update account profile information</span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/profile/update')}
            >
              Update Profile
            </Button>
          </div>

          {/* Action Row 2: Password change */}
          <div className="flex items-center justify-between p-6 rounded-2xl border border-slate-200 hover:bg-slate-50/50 transition-colors">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#2563EB] flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-[15px] font-semibold text-[#111827]">Change Password</span>
                <span className="text-xs text-[#6B7280] mt-1">Configure security parameters</span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/profile/change-password')}
            >
              Update Password
            </Button>
          </div>

        </div>
      </Card>
      </div>
    </div>
  );
}
