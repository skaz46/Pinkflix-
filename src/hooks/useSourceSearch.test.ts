import { describe, expect, it, vi } from 'vitest'
import { pickSearchRunner } from './useSourceSearch'
import type { VideoSource } from '../sources/types'

function source(withBrowse: boolean): VideoSource {
  return {
    id: 's',
    label: 'S',
    isAvailable: () => true,
    search: vi.fn(async () => []),
    ...(withBrowse ? { browse: vi.fn(async () => []) } : {}),
    getPlayback: async () => ({ kind: 'external', url: 'https://example.com' }),
  }
}

describe('pickSearchRunner', () => {
  const signal = new AbortController().signal

  it('searches whenever there is typed text', () => {
    const s = source(true)
    pickSearchRunner(s, 'cats')!(signal)
    expect(s.search).toHaveBeenCalledWith('cats', signal)
    expect(s.browse).not.toHaveBeenCalled()
  })

  it('does nothing for an empty box on search-only sources (YouTube behaviour)', () => {
    expect(pickSearchRunner(source(false), '')).toBeNull()
  })

  it('browses for an empty box on catalogue sources', () => {
    const s = source(true)
    pickSearchRunner(s, '')!(signal)
    expect(s.browse).toHaveBeenCalledWith(signal)
    expect(s.search).not.toHaveBeenCalled()
  })
})
