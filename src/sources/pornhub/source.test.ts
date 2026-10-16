
import { afterEach, describe, expect, it, vi } from 'vitest'
import { sourceRegistry } from '../registry'
import { pornhubSource } from './source'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('pornhub source', () => {
  it('is registered after YouTube so YouTube stays the default tab', () => {
    expect(sourceRegistry.available().map((s) => s.id)).toEqual([
      'youtube',
      'pornhub',
    ])
    expect(pornhubSource.label).toBe('Pornhub')
  })

  it('browses the local catalogue when no search query is provided', async () => {
    const all = await pornhubSource.browse!()

    expect(all.length).toBeGreaterThan(0)
    expect(await pornhubSource.search('')).toEqual(all)
  })

  it('searches the live API and maps returned video metadata', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          videos: [
            {
              video_id: '6ad12cec3b238',
              title: 'Sample video',
              duration: '4:24',
              default_thumb: 'https://example.com/thumb.jpg',
              publish_date: '2026-10-15 12:00:00',
              tags: [{ tag_name: 'sample-tag' }],
              categories: [{ category: 'sample-category' }],
            },
          ],
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    )

    vi.stubGlobal('fetch', fetchMock)

    const results = await pornhubSource.search('sample video')

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      'q=sample+video',
    )
    expect(results).toHaveLength(1)
    expect(results[0]).toMatchObject({
      id: '6ad12cec3b238',
      sourceId: 'pornhub',
      title: 'Sample video',
      thumbnail: 'https://example.com/thumb.jpg',
      subtitle: 'sample-category · sample-tag',
      durationSec: 264,
      publishedAt: '2026-10-15 12:00:00',
      webUrl: 'https://www.pornhub.org/embed/6ad12cec3b238',
    })
  })

  it('returns an empty list when the API returns no videos', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ videos: [] }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )

    await expect(pornhubSource.search('no-such-thing')).resolves.toEqual([])
  })

  it('reports an API error when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('Unavailable', { status: 503 })),
    )

    await expect(pornhubSource.search('sample')).rejects.toThrow(
      'Pornhub search failed (503).',
    )
  })

  it('plays through a plain embed built from the video id', async () => {
    const [video] = await pornhubSource.browse!()

    expect(await pornhubSource.getPlayback(video)).toEqual({
      kind: 'embed',
      url: `https://www.pornhub.org/embed/${video.id}`,
    })
  })

  it('refuses to build an embed for a malformed id', async () => {
    const [video] = await pornhubSource.browse!()

    await expect(
      pornhubSource.getPlayback({ ...video, id: '../evil' }),
    ).rejects.toThrow('Invalid Pornhub video key.')
  })
})
