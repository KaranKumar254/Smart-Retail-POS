import { cn } from '@/lib/utils';

function DataTable({ columns, data, className = '' }) {
  return (
    <div className={cn('overflow-hidden rounded-[28px] border border-slate-200/70 bg-white shadow-soft', className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-100 text-left text-sm">
          <thead className="bg-slate-50/70 text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-5 py-4 font-semibold">{column.title}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {data.map((row, index) => (
              <tr key={row._id || row.id || index} className="hover:bg-slate-50/60">
                {columns.map((column) => (
                  <td key={column.key} className="px-5 py-4 align-middle">
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
