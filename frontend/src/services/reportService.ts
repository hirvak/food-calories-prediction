import api from './api';

const triggerDownload = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const reportService = {
  async downloadUserPDF(): Promise<void> {
    const response = await api.get('/reports/pdf', { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    triggerDownload(blob, 'nutrition_report.pdf');
  },

  async downloadUserExcel(): Promise<void> {
    const response = await api.get('/reports/excel', { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    triggerDownload(blob, 'nutrition_report.xlsx');
  },

  async downloadAdminPDF(): Promise<void> {
    const response = await api.get('/reports/admin/pdf', { responseType: 'blob' });
    const blob = new Blob([response.data], { type: 'application/pdf' });
    triggerDownload(blob, 'platform_report.pdf');
  },

  async downloadAdminExcel(): Promise<void> {
  const response = await api.get("/reports/admin/excel", {
    responseType: "blob",
  });

  const blob = new Blob([response.data], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  triggerDownload(blob, "platform_report.xlsx");
  }
};
