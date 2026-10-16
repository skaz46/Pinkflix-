import type { PornhubEntry } from './catalogue'

/**
 * Manually curated Pornhub catalogue. This is NOT automatic discovery: only the
 * videos listed here exist in PinkFlix.
 *
 * To add a video, copy its embed URL (https://www.pornhub.org/embed/<viewkey>)
 * and append an entry with that <viewkey> as `key`:
 *
 *   { key: '6aceafb10f3fb', title: 'Some title', tags: ['tag one', 'tag two'] },
 *
 * `thumbnail`, `durationSec` and `publishedAt` are optional.
 */
export const PORNHUB_ENTRIES: PornhubEntry[] = [
  { key: '6aceafb10f3fb', title: 'Pornhub Embed Test', tags: ['test', 'embed'] },
]
