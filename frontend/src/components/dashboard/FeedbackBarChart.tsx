import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_AXIS_COLOR, CHART_GRID_COLOR } from '../../constants/chartColors';
import type { ChartDataPoint } from '../../utils/chartData';
import { ChartCard } from './ChartCard';
import { EmptyState } from './EmptyState';

interface FeedbackBarChartProps {
  data: ChartDataPoint[];
}

interface TooltipPayload {
  payload: ChartDataPoint;
}

function BarTooltip({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) {
  if (!active || !payload?.length) {
    return null;
  }

  const item = payload[0].payload;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-3 py-2 shadow-lg">
      <p className="text-sm font-medium text-slate-900">{item.label}</p>
      <p className="text-xs text-slate-500">{item.count} submissions</p>
    </div>
  );
}

export function FeedbackBarChart({ data }: FeedbackBarChartProps) {
  const hasData = data.some((item) => item.count > 0);

  if (!hasData) {
    return (
      <ChartCard
        title="Feedback by Category"
        description="Total submissions per category"
      >
        <EmptyState
          title="No feedback counts yet"
          description="Feedback submissions will appear here as bar chart data."
        />
      </ChartCard>
    );
  }

  return (
    <ChartCard
      title="Feedback by Category"
      description="Total submissions per category"
    >
      <div className="h-72 w-full sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={CHART_GRID_COLOR} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: CHART_AXIS_COLOR, fontSize: 12 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<BarTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.08)' }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
              {data.map((entry) => (
                <Cell key={entry.category} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
