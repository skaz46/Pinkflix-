import { Link } from 'react-router-dom'
import type { TopTitle } from '../../hooks/useAnalytics'

interface TopTitlesListProps {
  data: TopTitle[]
}

export function TopTitlesList({ data }: TopTitlesListProps) {
  return (
    <div className="glass rounded-2xl p-4">
      <h3 className="text-[13px] font-semibold text-ink-primary mb-3 px-1">Most watched</h3>
      <div className="flex flex-col gap-1">
        {data.map((t, i) => (
          <Link
            key={t.id}
            to={`/title/${t.id}`}
            className="focus-ring flex items-center gap-3 px-1 py-2 rounded-xl hover:bg-white/5 transition-colors duration-150"
          >
            <span className="text-[13px] font-semibold text-ink-tertiary w-4 tabular-nums">{i + 1}</span>
            <div
              className="w-10 h-7 rounded-lg shrink-0"
              style={{ background: `linear-gradient(135deg, ${t.gradient[0]}, ${t.gradient[1]})` }}
            />
            <span className="text-[13.5px] text-ink-primary flex-1 line-clamp-1">{t.title}</span>
            <span className="text-[12px] text-ink-tertiary tabular-nums">{t.minutes}m</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
