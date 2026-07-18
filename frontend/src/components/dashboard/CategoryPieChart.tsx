import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartCard } from './ChartCard';
import { EmptyState } from './EmptyState';
import type { ChartDataPoint } from '../../utils/chartData';

interface CategoryPieChartProps {
  data: ChartDataPoint[];
}

interface TooltipPayload {
  payload: ChartDataPoint;
}

function PieTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-slate-900">{item.label}</p>
      <p className="text-xs text-slate-500">
        {item.count} submissions · {item.percentage}%
      </p>
    </div>
  );
}

export function CategoryPieChart({ data }: CategoryPieChartProps) {
  if (data.length === 0) {
    return (
      <ChartCard
        title="Category Distribution"
        description="Share of feedback by category"
      >
        <EmptyState
          title="No category data yet"
          description="Submit feedback to see category distribution."
        />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Category Distribution"
      description="Share of feedback by category"
    >
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="label"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              stroke="#ffffff"
              strokeWidth={2}
            >
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip content={<PieTooltip />} />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="text-xs text-slate-600">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
