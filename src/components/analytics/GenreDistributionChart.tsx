import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { GenreSlice } from '../../hooks/useAnalytics'

interface GenreDistributionChartProps {
  data: GenreSlice[]
}

const palette = ['#FF3E8A', '#6C5CE7', '#00B4D8', '#F4A340', '#2ED573', '#FF6B6B']

export function GenreDistributionChart({ data }: GenreDistributionChartProps) {
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-[13px] font-semibold text-ink-primary mb-1 px-1">Genres you watch</h3>
      <p className="text-[11.5px] text-ink-tertiary px-1 mb-2">By titles watched</p>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="tag"
              width={100}
              tick={{ fill: '#A1A1A6', fontSize: 11.5 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                background: 'rgba(18,18,20,0.95)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 12,
                fontSize: 12,
                color: '#F5F5F7',
              }}
              formatter={(value) => [`${value} titles`, '']}
            />
            <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={16}>
              {data.map((_, i) => (
                <Cell key={i} fill={palette[i % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
