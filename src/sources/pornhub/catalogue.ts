import type { SourceVideo } from '../types'

export const PORNHUB_SOURCE_ID = 'pornhub'

// Verified embed format: https://www.pornhub.org/embed/<viewkey>
export const PORNHUB_EMBED_BASE = 'https://www.pornhub.org/embed/'

/** One manually curated catalogue entry. Only `key` and `title` are required. */
export interface PornhubEntry {
  /** The viewkey from the embed URL, e.g. the part after /embed/. */
  key: string
  title: string
  /** Tags/categories. They are searchable and shown under the title. */
  tags?: string[]
  /** Optional image URL you are permitted to use. Omit if unavailable. */
  thumbnail?: string
  durationSec?: number
  /** ISO date, e.g. 2026-10-16. */
  publishedAt?: string
}

const KEY_PATTERN = /^[A-Za-z0-9]{6,32}$/

export const isValidViewkey = (key: string) => KEY_PATTERN.test(key)

export function embedUrl(key: string): string {
  if (!isValidViewkey(key)) throw new Error('Invalid Pornhub video key.')
  return `${PORNHUB_EMBED_BASE}${key}`
}

// Lower-case and strip accents so "Café" matches "cafe".
const fold = (text: string) =>
  text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase()

export function toSourceVideo(entry: PornhubEntry): SourceVideo {
  return {
    id: entry.key,
    sourceId: PORNHUB_SOURCE_ID,
    title: entry.title,
    thumbnail: entry.thumbnail,
    subtitle: entry.tags?.length ? entry.tags.slice(0, 3).join(' · ') : undefined,
    durationSec: entry.durationSec,
    publishedAt: entry.publishedAt,
    // The embed page itself opens in a browser, so it is the "open on site" link.
    webUrl: embedUrl(entry.key),
  }
}

// Entries with a malformed or repeated key are skipped rather than rendered.
function usable(entries: PornhubEntry[]): PornhubEntry[] {
  const seen = new Set<string>()
  return entries.filter((entry) => {
    if (!isValidViewkey(entry.key) || seen.has(entry.key)) return false
    seen.add(entry.key)
    return true
  })
}

export function browseEntries(entries: PornhubEntry[]): SourceVideo[] {
  return usable(entries).map(toSourceVideo)
}

/** Every search term must appear in the title or one of the tags. */
export function searchEntries(
  entries: PornhubEntry[],
  query: string,
): SourceVideo[] {
  const terms = fold(query).split(/\s+/).filter(Boolean)
  if (terms.length === 0) return []

  return usable(entries)
    .filter((entry) => {
      const text = fold(`${entry.title} ${(entry.tags ?? []).join(' ')}`)
      return terms.every((term) => text.includes(term))
    })
    .map(toSourceVideo)
}
