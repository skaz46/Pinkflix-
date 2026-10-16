/**
 * Shared contract for every video source (YouTube, a private site adapter, …).
 * UI code should depend on these types only, never on a specific source.
 */

export interface SourceVideo {
  /** Id that is unique within its source. */
  id: string
  sourceId: string
  title: string
  description?: string
  thumbnail?: string
  /** Channel, studio or similar secondary line. */
  subtitle?: string
  publishedAt?: string
  durationSec?: number
  /** Human-facing page for "open on site" fallbacks. */
  webUrl?: string
}

/**
 * How a video can be played. Sources return only what they are permitted to use.
 * - embed:    an iframe URL the source allows embedding
 * - direct:   an authorised MP4 or HLS stream played with <video>
 * - external: playback is not possible in-app; open the page instead
 */
export type Playback =
  | { kind: 'embed'; url: string }
  | { kind: 'direct'; url: string; format: 'mp4' | 'hls' }
  | { kind: 'external'; url: string }

export interface VideoSource {
  id: string
  label: string
  /** True when the source is configured and enabled. Must not touch the network. */
  isAvailable: () => boolean
  search: (query: string, signal?: AbortSignal) => Promise<SourceVideo[]>
  getPlayback: (video: SourceVideo) => Promise<Playback>
}
