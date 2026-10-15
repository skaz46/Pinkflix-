import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import type { DailyActivity } from '../../hooks/useAnalytics'

interface WatchActivityChartProps {
  data: DailyActivity[]
}

export function WatchActivityChart({ data }: WatchActivityChartProps) {
  return (
    <div className="glass rounded-2xl p-4 pb-2">
      <h3 className="text-[13px] font-semibold text-ink-primary mb-1 px-1">Watch activity</h3>
      <p className="text-[11.5px] text-ink-tertiary px-1 mb-2">Minutes watched, last 14 days</p>
      <div className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="watchGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF3E8A" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#FF3E8A" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              tick={{ fill: '#6E6E73', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={1}
            />
            <Tooltip
              contentStyle={{
                background: 'rgba(18,18,20,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                fontSize: 12,
                color: '#F5F5F7',
              }}
              labelStyle={{ color: '#A1A1A6' }}
              formatter={(value) => [`${value} min`, 'Watched']}
            />
            <Area
              type="monotone"
              dataKey="minutes"
              stroke="#FF3E8A"
              strokeWidth={2}
              fill="url(#watchGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
