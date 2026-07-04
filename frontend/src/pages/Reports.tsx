import { useState, useEffect } from 'react';
import { reportService } from '../services/reportService';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { FileText, Download, ShieldCheck } from 'lucide-react';

export default function Reports() {
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    document.title = 'NutriLens | Reports';
  }, []);

  const isAdmin = user?.role === 'admin';

  // Loading states
  const [downloadingUserPdf, setDownloadingUserPdf] = useState(false);
  const [downloadingUserExcel, setDownloadingUserExcel] = useState(false);
  const [downloadingAdminPdf, setDownloadingAdminPdf] = useState(false);
  const [downloadingAdminExcel, setDownloadingAdminExcel] = useState(false);

  const handleUserPDF = async () => {
    setDownloadingUserPdf(true);
    try {
      await reportService.downloadUserPDF();
      showToast('Personal PDF report downloaded successfully', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Failed to export PDF report', 'error');
    } finally {
      setDownloadingUserPdf(false);
    }
  };

  const handleUserExcel = async () => {
    setDownloadingUserExcel(true);
    try {
      await reportService.downloadUserExcel();
      showToast('Personal Excel workbook exported successfully', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Failed to export Excel workbook', 'error');
    } finally {
      setDownloadingUserExcel(false);
    }
  };

  const handleAdminPDF = async () => {
    setDownloadingAdminPdf(true);
    try {
      await reportService.downloadAdminPDF();
      showToast('System PDF report downloaded successfully', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Failed to export Admin PDF report', 'error');
    } finally {
      setDownloadingAdminPdf(false);
    }
  };

  const handleAdminExcel = async () => {
    setDownloadingAdminExcel(true);
    try {
      await reportService.downloadAdminExcel();
      showToast('System Excel workbook exported successfully', 'success');
    } catch (error: any) {
      console.error(error);
      showToast('Failed to export Admin Excel workbook', 'error');
    } finally {
      setDownloadingAdminExcel(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full animate-fade-in text-[#4B5563] max-w-7xl mx-auto pb-12">
      <PageHeader 
        title="Reports & Analytics Export" 
        description="Generate, download and audit system-wide or personal nutrition metrics" 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full items-start">
        {/* Personal Reports Card */}
        <Card className="flex flex-col gap-6 text-left">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-[#111827]">Personal Reports</h3>
          </div>

          <div className="border-t border-slate-200"></div>

          <p className="text-sm text-[#4B5563]">
            Export a comprehensive summary of your food diary items, portions weight logs, calories consumption trend, and macronutrients ratios for the week.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <Button
              variant="secondary"
              size="md"
              loading={downloadingUserPdf}
              onClick={handleUserPDF}
              className="flex items-center gap-2 justify-center font-bold"
            >
              <Download className="w-4 h-4" />
              <span>Export PDF</span>
            </Button>
            <Button
              variant="secondary"
              size="md"
              loading={downloadingUserExcel}
              onClick={handleUserExcel}
              className="flex items-center gap-2 justify-center font-bold"
            >
              <Download className="w-4 h-4" />
              <span>Export Excel</span>
            </Button>
          </div>
        </Card>

        {/* Admin Reports Card (Only visible to admin role) */}
        {isAdmin ? (
          <Card className="flex flex-col gap-6 text-left border-indigo-200 bg-gradient-to-br from-white to-indigo-50/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <h3 className="text-lg font-semibold text-[#111827]">System Admin Reports</h3>
            </div>

            <div className="border-t border-slate-200"></div>

            <p className="text-sm text-[#4B5563]">
              Generate global platform analytics records. These audit reports export user account statistics, scanning frequencies, accuracy metrics, and database volumes.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <Button
                variant="primary"
                size="md"
                loading={downloadingAdminPdf}
                onClick={handleAdminPDF}
                className="flex items-center gap-2 justify-center font-bold bg-indigo-600 hover:bg-indigo-750 shadow-indigo-600/10"
              >
                <Download className="w-4 h-4" />
                <span>Admin PDF</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                loading={downloadingAdminExcel}
                onClick={handleAdminExcel}
                className="flex items-center gap-2 justify-center font-bold bg-indigo-600 hover:bg-indigo-750 shadow-indigo-600/10"
              >
                <Download className="w-4 h-4" />
                <span>Admin Excel</span>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="flex flex-col gap-4 items-center text-center justify-center p-8 border border-dashed border-slate-200 bg-white/50 text-[#6B7280]">
            <ShieldCheck className="w-8 h-8 text-slate-350" />
            <h3 className="text-base font-semibold text-[#111827]">Admin Privilege Required</h3>
            <p className="text-xs text-[#6B7280] max-w-xs leading-relaxed">
              System performance audit summaries and user management reports are only available for authorized administrators.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
