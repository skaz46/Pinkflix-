import { useEffect, useMemo, useState } from 'react'
import { SlidersHorizontal, SearchX } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { SearchBar } from '../components/search/SearchBar'
import { SortMenu } from '../components/search/SortMenu'
import { FilterDrawer } from '../components/search/FilterDrawer'
import { VideoCard } from '../components/video/VideoCard'
import { GridSkeleton } from '../components/video/VideoCardSkeleton'
import { EmptyState } from '../components/common/EmptyState'
import { catalog } from '../data/catalog'
import { useCatalogQuery } from '../hooks/useCatalogQuery'
import { defaultFilters, countActiveFilters } from '../utils/catalogQuery'
import type { FilterState, SortOption, Tag } from '../types'

const availableTags = Array.from(new Set(catalog.flatMap((c) => c.tags))).sort() as Tag[]

export function Search() {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<SortOption>('relevance')
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setInitialLoading(false), 420)
    return () => clearTimeout(t)
  }, [])

  const { results } = useCatalogQuery({ items: catalog, query, filters, sort })
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 pt-4 pb-6">
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          <button
            onClick={() => setDrawerOpen(true)}
            aria-label="Filters"
            className="focus-ring relative w-[46px] h-[46px] rounded-2xl glass flex items-center justify-center shrink-0"
          >
            <SlidersHorizontal size={18} className="text-ink-primary" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-[18px] h-[18px] min-w-[18px] px-1 rounded-full bg-accent-500 text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

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
              {results.length} {results.length === 1 ? 'title' : 'titles'}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6">
              {results.map((item, i) => (
                <VideoCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </>
        )}
      </div>

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        filters={filters}
        onChange={setFilters}
        availableTags={availableTags}
        resultCount={results.length}
      />
    </PageTransition>
  )
}
