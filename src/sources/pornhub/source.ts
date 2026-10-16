import type { VideoSource } from '../types'
import {
  PORNHUB_SOURCE_ID,
  browseEntries,
  embedUrl,
  searchEntries,
} from './catalogue'
import { PORNHUB_ENTRIES } from './entries'

// Local catalogue source. A live-search adapter could later replace these
// functions without touching the UI.
export const pornhubSource: VideoSource = {
  id: PORNHUB_SOURCE_ID,
  label: 'Pornhub',
  isAvailable: () => true,
  browse: async () => browseEntries(PORNHUB_ENTRIES),
  search: async (query) => searchEntries(PORNHUB_ENTRIES, query),
  getPlayback: async (video) => ({ kind: 'embed', url: embedUrl(video.id) }),
}
