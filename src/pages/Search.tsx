
import { useCallback, useEffect, useMemo, useState } from 'react'
import { LoaderCircle, SearchX, SlidersHorizontal } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SearchBar } from '../components/search/SearchBar'
import { SortMenu } from '../components/search/SortMenu'
import { FilterDrawer } from '../components/search/FilterDrawer'
import { VideoCard } from '../components/video/VideoCard'
import { SourceVideoCard } from '../components/video/SourceVideoCard'
import { SourcePlayerOverlay } from '../components/video/SourcePlayerOverlay'
import { GridSkeleton } from '../components/video/VideoCardSkeleton'
import { EmptyState } from '../components/common/EmptyState'
import { catalog } from '../data/catalog'
import { useCatalogQuery } from '../hooks/useCatalogQuery'
import { defaultFilters, countActiveFilters } from '../utils/catalogQuery'
import { useSourceSearch } from '../hooks/useSourceSearch'
import { sourceRegistry } from '../sources/registry'
import type { SourceVideo } from '../sources/types'
import type { FilterState, SortOption, Tag } from '../types'

const availableTags = Array.from(
  new Set(catalog.flatMap((c) => c.tags)),
).sort() as Tag[]

// Search mode is a video source id (from the registry) or the local catalogue.
const CATALOG_MODE = 'catalog'

export function Search() {
  const [query, setQuery] = useState('')
  const sources = sourceRegistry.available()
  const [mode, setMode] = useState<string>(
    () => sources[0]?.id ?? CATALOG_MODE,
  )
  const activeSource = sources.find((source) => source.id === mode)
  const [sort, setSort] = useState<SortOption>('relevance')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  const [selectedVideo, setSelectedVideo] = useState<SourceVideo | null>(null)
  const {
    results: sourceResults,
    loading: sourceLoading,
    error: sourceError,
  } = useSourceSearch(activeSource, query)

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 420)
    return () => clearTimeout(timer)
  }, [])

  const { results } = useCatalogQuery({
    items: catalog,
    query,
    filters,
    sort,
  })

  const activeFilterCount = useMemo(
    () => countActiveFilters(filters),
    [filters],
  )

  const closePlayer = useCallback(() => {
    setSelectedVideo(null)
  }, [])

  function switchMode(nextMode: string) {
    setMode(nextMode)
    setDrawerOpen(false)
  }

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 pt-4 pb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex-1 min-w-0">
            <SearchBar
              value={query}
              onChange={setQuery}
              placeholder={
                activeSource
                  ? `Search ${activeSource.label} videos…`
                  : 'Search titles, tags, studios…'
              }
            />
          </div>

          {!activeSource && (
            <button
              onClick={() => setDrawerOpen(true)}
              aria-label="Filters"
              className="focus-ring relative w-[46px] h-[46px] rounded-2xl glass flex items-center justify-center shrink-0"
            >
              <SlidersHorizontal size={18} className="text-ink-primary" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-[18px] h-[18px] rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-5">
          {sources.map((source) => (
            <button
              key={source.id}
              onClick={() => switchMode(source.id)}
              className={`focus-ring rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
                activeSource?.id === source.id
                  ? 'bg-accent-500 text-white'
                  : 'bg-white/6 text-ink-secondary hover:bg-white/10'
              }`}
            >
              {source.label}
            </button>
          ))}

          <button
            onClick={() => switchMode(CATALOG_MODE)}
            className={`focus-ring rounded-full px-4 py-2 text-[12.5px] font-semibold transition-colors ${
              !activeSource
                ? 'bg-accent-500 text-white'
                : 'bg-white/6 text-ink-secondary hover:bg-white/10'
            }`}
          >
            My PinkFlix
          </button>
        </div>

        {activeSource ? (
          <section>
            {!query.trim() ? (
              <div className="py-14 text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-2xl glass flex items-center justify-center">
                  <SearchX size={24} className="text-accent-400" />
                </div>
                <h2 className="text-base font-semibold text-ink-primary">
                  What do you want to watch?
                </h2>
                <p className="mt-2 text-sm text-ink-tertiary">
                  Search {activeSource.label} and play videos right here in PinkFlix.
                </p>
              </div>
            ) : sourceLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <LoaderCircle
                  size={28}
                  className="animate-spin text-accent-400"
                />
                <p className="text-sm text-ink-tertiary">
                  Searching {activeSource.label}…
                </p>
              </div>
            ) : sourceError ? (
              <div className="py-10 text-center">
                <SearchX
                  size={28}
                  className="mx-auto mb-3 text-accent-400"
                />
                <h2 className="font-semibold text-ink-primary">
                  {activeSource.label} search failed
                </h2>
                <p className="mt-2 text-sm text-ink-tertiary break-words">
                  {sourceError}
                </p>
                <button
                  onClick={() => setQuery((value) => `${value} `)}
                  className="mt-4 rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white"
                >
                  Try again
                </button>
              </div>
            ) : sourceResults.length === 0 ? (
              <EmptyState
                icon={<SearchX size={24} />}
                title="No videos found"
                description="Try a different search term."
                action={
                  <button
                    onClick={() => setQuery('')}
                    className="focus-ring rounded-full bg-accent-500 text-white text-[13.5px] font-semibold px-4 py-2"
                  >
                    Clear search
                  </button>
                }
              />
            ) : (
              <>
                <p className="text-[12.5px] text-ink-tertiary mb-3">
                  {sourceResults.length} {activeSource.label} results
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6">
                  {sourceResults.map((video) => (
                    <SourceVideoCard
                      key={video.id}
                      video={video}
                      sourceLabel={activeSource.label}
                      onPlay={setSelectedVideo}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        ) : (
          <section>
            <div className="mb-5">
              <SortMenu value={sort} onChange={setSort} />
            </div>

            {initialLoading ? (
              <GridSkeleton count={10} />
            ) : results.length === 0 ? (
              <EmptyState
                icon={<SearchX size={24} />}
                title="No matches found"
                description="Try a different search term, or reset your filters to see more titles."
                action={
                  <button
                    onClick={() => {
                      setQuery('')
                      setFilters(defaultFilters)
                    }}
                    className="focus-ring rounded-full bg-accent-500 hover:bg-accent-600 text-white text-[13.5px] font-semibold px-4 py-2 transition-colors"
                  >
                    Clear search &amp; filters
                  </button>
                }
              />
            ) : (
              <>
                <p className="text-[12.5px] text-ink-tertiary mb-3">
                  {results.length}{' '}
                  {results.length === 1 ? 'title' : 'titles'}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6">
                  {results.map((item, index) => (
                    <VideoCard
                      key={item.id}
                      item={item}
                      index={index}
                    />
                  ))}
                </div>
              </>
            )}
          </section>
        )}
      </div>

      {!activeSource && (
        <FilterDrawer
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          filters={filters}
          onChange={setFilters}
          availableTags={availableTags}
          resultCount={results.length}
        />
      )}

      {selectedVideo && (
        <SourcePlayerOverlay
          key={`${selectedVideo.sourceId}:${selectedVideo.id}`}
          video={selectedVideo}
          source={sourceRegistry.get(selectedVideo.sourceId)}
          onClose={closePlayer}
        />
      )}
    </PageTransition>
  )
}
