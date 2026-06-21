import { motion } from 'framer-motion';
import { formatCurrency, formatNumber } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

function StatsCard({ item }) {
  const displayValue = item.title.toLowerCase().includes('revenue') || item.title.toLowerCase().includes('sales')
    ? formatCurrency(item.value)
    : formatNumber(item.value);

  return (
    <motion.div whileHover={{ y: -4 }} className="card-panel p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{item.title}</p>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">{displayValue}</h3>
        </div>
        <Badge tone={item.tone}>{item.change}</Badge>
      </div>
      <div className="h-2 rounded-full bg-slate-100">
        <div className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500" style={{ width: `${Math.min(95, Math.max(24, item.value % 100))}%` }} />
      </div>
    </motion.div>
  );
}

export default StatsCard;
