import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { HeroBanner } from '../components/video/HeroBanner'
import { Row } from '../components/video/Row'
import { EmptyState } from '../components/common/EmptyState'
import { catalog } from '../data/catalog'
import { useContinueWatching } from '../hooks/useHistoryDerived'
import { useRecommendations } from '../hooks/useRecommendations'

export function Home() {
  const continueWatching = useContinueWatching(10)
  const recommendations = useRecommendations(10)

  const featured = useMemo(() => {
    const recent = [...catalog].sort((a, b) => +new Date(b.addedDate) - +new Date(a.addedDate)).slice(0, 6)
    return recent.sort((a, b) => b.rating - a.rating)[0]
  }, [])

  const newest = useMemo(
    () => [...catalog].sort((a, b) => +new Date(b.addedDate) - +new Date(a.addedDate)).slice(0, 12),
    [],
  )
  const topRated = useMemo(() => [...catalog].sort((a, b) => b.rating - a.rating).slice(0, 12), [])
  const concertFilms = useMemo(() => catalog.filter((c) => c.tags.includes('Concert Film')), [])
  const sciFi = useMemo(() => catalog.filter((c) => c.tags.includes('Sci-Fi')), [])

  return (
    <PageTransition>
      <div className="pb-6">
        <HeroBanner item={featured} />

        <div className="mt-8">
          <Row
            title="Continue Watching"
            items={continueWatching.map((c) => c.item)}
            progressFor={(id) => continueWatching.find((c) => c.item.id === id)?.progress}
            emptyHint={
              <EmptyState
                icon={<Compass size={24} />}
                title="Nothing in progress"
                description="Titles you start watching will show up here so you can pick up where you left off."
                action={
                  <Link
                    to="/search"
                    className="focus-ring rounded-full bg-accent-500 hover:bg-accent-600 text-white text-[13.5px] font-semibold px-4 py-2 transition-colors"
                  >
                    Browse the catalog
                  </Link>
                }
              />
            }
          />

          <Row
            title="Recommended for you"
            items={recommendations}
            seeAllHref="/search"
          />

          <Row title="Recently Added" items={newest} seeAllHref="/search" />
          <Row title="Top Rated" items={topRated} seeAllHref="/search" />
          <Row title="Stage Lights: Concert Films" items={concertFilms} seeAllHref="/search" />
          <Row title="Science Fiction" items={sciFi} seeAllHref="/search" />
        </div>
      </div>
    </PageTransition>
  )
}
