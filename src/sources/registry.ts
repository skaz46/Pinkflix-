import type { VideoSource } from './types'
import { youtubeSource } from './youtube'

export function createRegistry(all: VideoSource[]) {
  return {
    /** Every registered source, regardless of availability. */
    all: () => all,
    /** Only sources that are configured and enabled. */
    available: () => all.filter((source) => source.isAvailable()),
    get: (id: string) => all.find((source) => source.id === id),
  }
}

// Future sources are added to this list; they stay hidden until isAvailable() is true.
export const sourceRegistry = createRegistry([youtubeSource])
