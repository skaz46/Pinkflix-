import { useMemo } from 'react'
import type { FilterState, SortOption, VideoItem } from '../types'
import { applyFilters, searchCatalog, sortCatalog } from '../utils/catalogQuery'
import { useDebouncedValue } from './useDebouncedValue'
import { useLibraryStore } from '../store/useLibraryStore'

interface UseCatalogQueryArgs {
  items: VideoItem[]
  query: string
  filters: FilterState
  sort: SortOption
}

export function useCatalogQuery({ items, query, filters, sort }: UseCatalogQueryArgs) {
  const debouncedQuery = useDebouncedValue(query, 120)
  const favorites = useLibraryStore((s) => s.favorites)

  const scores = useMemo(() => searchCatalog(items, debouncedQuery), [items, debouncedQuery])

  const results = useMemo(() => {
    const matched = debouncedQuery.trim() ? items.filter((i) => scores.has(i.id)) : items
    const filtered = applyFilters(matched, filters, favorites)
    return sortCatalog(filtered, sort, scores)
  }, [items, debouncedQuery, scores, filters, favorites, sort])

  return { results, isSearching: query !== debouncedQuery }
}
