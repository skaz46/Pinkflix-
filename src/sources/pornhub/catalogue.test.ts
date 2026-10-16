import { describe, expect, it } from 'vitest'
import {
  browseEntries,
  embedUrl,
  isValidViewkey,
  searchEntries,
  toSourceVideo,
} from './catalogue'
import type { PornhubEntry } from './catalogue'
import { PORNHUB_ENTRIES } from './entries'

const sample: PornhubEntry[] = [
  { key: 'aaaa1111bbbb', title: 'Café Morning', tags: ['coffee', 'Morning Show'] },
  { key: 'cccc2222dddd', title: 'Evening Walk', tags: ['walk', 'outdoors'] },
  { key: 'bad key!', title: 'Broken key' },
  { key: 'aaaa1111bbbb', title: 'Duplicate key' },
]

describe('bundled entries', () => {
  it('all have valid, unique keys and titles', () => {
    const keys = PORNHUB_ENTRIES.map((e) => e.key)
    expect(keys.every(isValidViewkey)).toBe(true)
    expect(new Set(keys).size).toBe(keys.length)
    expect(PORNHUB_ENTRIES.every((e) => e.title.trim().length > 0)).toBe(true)
  })

  it('still contains the verified test embed', () => {
    expect(embedUrl('6aceafb10f3fb')).toBe('https://www.pornhub.org/embed/6aceafb10f3fb')
    expect(PORNHUB_ENTRIES.some((e) => e.key === '6aceafb10f3fb')).toBe(true)
  })
})

describe('embedUrl / isValidViewkey', () => {
  it('rejects malformed keys instead of building a URL', () => {
    for (const key of ['', 'a/b', '../x', 'has space', 'x'.repeat(40)]) {
      expect(isValidViewkey(key)).toBe(false)
      expect(() => embedUrl(key)).toThrow('Invalid Pornhub video key.')
    }
  })
})

describe('toSourceVideo', () => {
  it('maps an entry to the shared model without inventing a thumbnail', () => {
    expect(toSourceVideo(sample[0])).toEqual({
      id: 'aaaa1111bbbb',
      sourceId: 'pornhub',
      title: 'Café Morning',
      thumbnail: undefined,
      subtitle: 'coffee · Morning Show',
      durationSec: undefined,
      publishedAt: undefined,
      webUrl: 'https://www.pornhub.org/embed/aaaa1111bbbb',
    })
  })
})

describe('local search and browse', () => {
  it('browse lists usable entries, skipping bad and duplicate keys', () => {
    expect(browseEntries(sample).map((v) => v.id)).toEqual(['aaaa1111bbbb', 'cccc2222dddd'])
  })

  it('matches titles and tags, ignoring case and accents', () => {
    expect(searchEntries(sample, 'CAFE').map((v) => v.id)).toEqual(['aaaa1111bbbb'])
    expect(searchEntries(sample, 'outdoors').map((v) => v.id)).toEqual(['cccc2222dddd'])
  })

  it('requires every term to match', () => {
    expect(searchEntries(sample, 'morning show')).toHaveLength(1)
    expect(searchEntries(sample, 'morning walk')).toHaveLength(0)
  })

  it('returns nothing for empty or unrelated queries', () => {
    for (const q of ['', '   ', 'zzz']) expect(searchEntries(sample, q)).toEqual([])
  })
})
