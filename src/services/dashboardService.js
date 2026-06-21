import api from '@/lib/api';

export const dashboardService = {
  getStatCards: async () => {
    const { data } = await api.get('/dashboard/stats');
    return data.statCards;
  },
  getRevenueTrend: async (months = 8) => {
    const { data } = await api.get('/dashboard/revenue', { params: { months } });
    return data.revenueData;
  },
  getSalesChannelSplit: async () => {
    const { data } = await api.get('/dashboard/sales-channel');
    return data.salesChannelData;
  },
  getReportHighlights: async () => {
    const { data } = await api.get('/dashboard/report-highlights');
    return data.reportHighlights;
  },
};
