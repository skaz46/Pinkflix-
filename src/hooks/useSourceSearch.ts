import { useEffect, useState } from 'react'
import type { SourceVideo, VideoSource } from '../sources/types'

const DEBOUNCE_MS = 400

interface SearchState {
  sourceId: string
  results: SourceVideo[]
  loading: boolean
  error: string
}

const IDLE = { results: [] as SourceVideo[], loading: false, error: '' }

/**
 * Debounced search against one video source.
 * - An empty query clears results.
 * - A changed query/source aborts the in-flight request and ignores its result.
 * - With no source (e.g. the local catalogue tab) the last state is kept untouched.
 */
export function useSourceSearch(
  source: VideoSource | undefined,
  query: string,
) {
  const [state, setState] = useState<SearchState | null>(null)

  useEffect(() => {
    if (!source) return

    const term = query.trim()

    if (!term) {
      setState(null)
      return
    }

    const controller = new AbortController()

    const timer = setTimeout(async () => {
      setState((prev) => ({
        sourceId: source.id,
        results: prev?.sourceId === source.id ? prev.results : [],
        loading: true,
        error: '',
      }))

      try {
        const results = await source.search(term, controller.signal)

        if (!controller.signal.aborted) {
          setState({ sourceId: source.id, results, loading: false, error: '' })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setState({
            sourceId: source.id,
            results: [],
            loading: false,
            error:
              error instanceof Error
                ? error.message
                : `Something went wrong while searching ${source.label}.`,
          })
        }
      }
    }, DEBOUNCE_MS)

    return () => {
      controller.abort()
      clearTimeout(timer)
    }
  }, [source, query])

  // Never show another source's results under the active source.
  return state && state.sourceId === source?.id ? state : IDLE
}
