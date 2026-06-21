import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatCurrency } from '@/lib/utils';

function RevenueAreaChart({ data }) {
  return (
    <div className="card-panel p-5">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Monthly revenue</h3>
          <p className="text-sm text-slate-500">Performance against monthly target</p>
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3478f6" stopOpacity={0.45} />
                <stop offset="95%" stopColor="#3478f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#e2e8f0" vertical={false} strokeDasharray="3 3" />
            <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis tickFormatter={(v) => `₹${v / 1000}k`} tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} contentStyle={{ borderRadius: 18, borderColor: '#e2e8f0' }} />
            <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} fill="transparent" />
            <Area type="monotone" dataKey="revenue" stroke="#3478f6" strokeWidth={3} fill="url(#colorRevenue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueAreaChart;
