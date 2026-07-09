
import { statCards, revenueData, salesChannelData, reportHighlights } from '@/mock/data';

const isOffline = (err) => !err.response || err.code === 'ERR_NETWORK' || err.code === 'ECONNREFUSED';

export const dashboardService = {
  getStatCards: async () => {
    try {
      const { data } = await api.get('/dashboard/stats');
      return data.statCards;
    } catch (err) {
      if (isOffline(err)) return statCards;
      throw err;
    }
  },
  getRevenueTrend: async (months = 8) => {
    try {
      const { data } = await api.get('/dashboard/revenue', { params: { months } });
      return data.revenueData;
    } catch (err) {
      if (isOffline(err)) return revenueData;
      throw err;
    }
  },
  getSalesChannelSplit: async () => {
    try {
      const { data } = await api.get('/dashboard/sales-channel');
      return data.salesChannelData;
    } catch (err) {
      if (isOffline(err)) return salesChannelData;
      throw err;
    }
  },
  getReportHighlights: async () => {
    try {
      const { data } = await api.get('/dashboard/report-highlights');
      return data.reportHighlights;
    } catch (err) {
      if (isOffline(err)) return reportHighlights;
      throw err;
    }
  },
};
