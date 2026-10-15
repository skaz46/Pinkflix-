import { Link } from 'react-router-dom'
import { BarChart3, Clock, Heart, ListVideo, PlayCircle } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { StatCard } from '../components/analytics/StatCard'
import { WatchActivityChart } from '../components/analytics/WatchActivityChart'
import { GenreDistributionChart } from '../components/analytics/GenreDistributionChart'
import { TopTitlesList } from '../components/analytics/TopTitlesList'
import { EmptyState } from '../components/common/EmptyState'
import { useAnalytics } from '../hooks/useAnalytics'
import { formatDuration } from '../utils/format'

export function Analytics() {
  const stats = useAnalytics()

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 pt-5 pb-6">
        <h1 className="text-[22px] font-bold text-ink-primary tracking-tight mb-1">Analytics</h1>
        <p className="text-[13.5px] text-ink-tertiary mb-6">Your viewing habits, calculated on-device</p>

        {!stats.hasActivity ? (
          <EmptyState
            icon={<BarChart3 size={24} />}
            title="No data yet"
            description="Play a few titles and this dashboard will fill in with your watch time, genres and top picks."
            action={
              <Link
                to="/search"
                className="focus-ring rounded-full bg-accent-500 hover:bg-accent-600 text-white text-[13.5px] font-semibold px-4 py-2 transition-colors"
              >
                Browse the catalog
              </Link>
            }
          />
        ) : (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <StatCard
                label="Total watch time"
                value={formatDuration(stats.totalWatchMinutes * 60)}
                icon={<Clock size={17} />}
              />
              <StatCard
                label="Titles watched"
                value={String(stats.titlesWatched)}
                icon={<PlayCircle size={17} />}
              />
              <StatCard
                label="Favorites saved"
                value={String(stats.favoritesCount)}
                icon={<Heart size={17} />}
              />
              <StatCard
                label="Collections"
                value={String(stats.collectionsCount)}
                icon={<ListVideo size={17} />}
              />
            </div>

            <WatchActivityChart data={stats.dailyActivity} />

            <div className="grid sm:grid-cols-2 gap-5">
              {stats.genres.length > 0 && <GenreDistributionChart data={stats.genres} />}
              {stats.topTitles.length > 0 && <TopTitlesList data={stats.topTitles} />}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
