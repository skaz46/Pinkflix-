import { describe, expect, it } from 'vitest'
import { sourceRegistry } from '../registry'
import { pornhubSource } from './source'

describe('pornhub source', () => {
  it('is registered after YouTube so YouTube stays the default tab', () => {
    expect(sourceRegistry.available().map((s) => s.id)).toEqual(['youtube', 'pornhub'])
    expect(pornhubSource.label).toBe('Pornhub')
  })

  it('browses and searches the local catalogue', async () => {
    const all = await pornhubSource.browse!()
    expect(all.length).toBeGreaterThan(0)
    expect(await pornhubSource.search('embed test')).toEqual(all.filter((v) => v.id === '6aceafb10f3fb'))
    expect(await pornhubSource.search('no-such-thing')).toEqual([])
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
    await expect(pornhubSource.getPlayback({ ...video, id: '../evil' })).rejects.toThrow(
      'Invalid Pornhub video key.',
    )
  })
})
