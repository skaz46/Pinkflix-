import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { VideoCard } from '../components/video/VideoCard'
import { EmptyState } from '../components/common/EmptyState'
import { catalogById } from '../data/catalog'
import { useLibraryStore } from '../store/useLibraryStore'

export function Favorites() {
  const favorites = useLibraryStore((s) => s.favorites)

  const items = useMemo(
    () => favorites.map((id) => catalogById.get(id)).filter((x): x is NonNullable<typeof x> => Boolean(x)),
    [favorites],
  )

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 pt-5 pb-6">
        <h1 className="text-[22px] font-bold text-ink-primary tracking-tight mb-1">Favorites</h1>
        <p className="text-[13.5px] text-ink-tertiary mb-6">
          {items.length} {items.length === 1 ? 'title' : 'titles'} you&rsquo;ve saved
        </p>

        {items.length === 0 ? (
          <EmptyState
            icon={<Heart size={24} />}
            title="No favorites yet"
            description="Tap the heart on any title to save it here for quick access later."
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6">
            {items.map((item, i) => (
              <VideoCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>
    </PageTransition>
  )
}
