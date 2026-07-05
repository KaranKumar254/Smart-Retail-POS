import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';



function SalesDonutChart({ data }) {
  return (
    <div className="card-panel p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-slate-900">Omnichannel split</h3>
        <p className="text-sm text-slate-500">Sales contribution by business channel</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={78} outerRadius={108} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ borderRadius: 18, borderColor: '#e2e8f0' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {data.map((item, index) => (
          <div key={item.name} className="rounded-2xl bg-slate-50 p-3">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span className="text-sm font-medium text-slate-700">{item.name}</span>
            </div>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}%</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SalesDonutChart;
