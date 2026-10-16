import { describe, expect, it, vi } from 'vitest'
import { createRegistry } from './registry'
import type { VideoSource } from './types'

vi.mock('../services/youtube', () => ({
  searchYouTube: vi.fn(async () => [
    {
      id: 'abc 123',
      title: 'Title',
      description: 'Desc',
      thumbnail: '',
      channelTitle: 'Channel',
      publishedAt: '2026-01-01T00:00:00Z',
    },
  ]),
}))

const { youtubeSource, toSourceVideo } = await import('./youtube')

function fake(id: string, available: boolean): VideoSource {
  return {
    id,
    label: id,
    isAvailable: () => available,
    search: async () => [],
    getPlayback: async () => ({ kind: 'external', url: 'https://example.com' }),
  }
}

describe('registry', () => {
  it('lists only available sources and looks them up by id', () => {
    const registry = createRegistry([fake('a', true), fake('b', false)])
    expect(registry.all().map((s) => s.id)).toEqual(['a', 'b'])
    expect(registry.available().map((s) => s.id)).toEqual(['a'])
    expect(registry.get('b')?.id).toBe('b')
    expect(registry.get('missing')).toBeUndefined()
  })
})

describe('youtube source wrapper', () => {
  it('maps YouTube results to SourceVideo', async () => {
    const [video] = await youtubeSource.search('anything')
    expect(video).toMatchObject({
      id: 'abc 123',
      sourceId: 'youtube',
      title: 'Title',
      subtitle: 'Channel',
      thumbnail: undefined,
      webUrl: 'https://www.youtube.com/watch?v=abc%20123',
    })
  })

  it('returns the same nocookie embed URL the existing overlay uses', async () => {
    const playback = await youtubeSource.getPlayback(
      toSourceVideo({ id: 'xyz', title: '', description: '', thumbnail: '', channelTitle: '', publishedAt: '' }),
    )
    expect(playback).toEqual({
      kind: 'embed',
      url: 'https://www.youtube-nocookie.com/embed/xyz?autoplay=1&playsinline=1&rel=0',
    })
  })
})
