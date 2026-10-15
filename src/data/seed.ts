import type { Collection, HistoryEntry } from '../types'

function daysAgoIso(days: number, hour = 20): string {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(hour, Math.floor(Math.random() * 59), 0, 0)
  return d.toISOString()
}

export const seedFavorites: string[] = ['v10', 'v17', 'v22', 'v06', 'v36']

export const seedHistory: HistoryEntry[] = [
  { videoId: 'v17', watchedAt: daysAgoIso(0, 21), progress: 0.42 },
  { videoId: 'v10', watchedAt: daysAgoIso(0, 9), progress: 0.91 },
  { videoId: 'v06', watchedAt: daysAgoIso(1, 22), progress: 1 },
  { videoId: 'v22', watchedAt: daysAgoIso(1, 13), progress: 0.68 },
  { videoId: 'v28', watchedAt: daysAgoIso(2, 20), progress: 1 },
  { videoId: 'v36', watchedAt: daysAgoIso(2, 18), progress: 0.25 },
  { videoId: 'v13', watchedAt: daysAgoIso(3, 19), progress: 1 },
  { videoId: 'v33', watchedAt: daysAgoIso(4, 21), progress: 1 },
  { videoId: 'v24', watchedAt: daysAgoIso(4, 12), progress: 0.55 },
  { videoId: 'v01', watchedAt: daysAgoIso(5, 20), progress: 1 },
  { videoId: 'v19', watchedAt: daysAgoIso(6, 23), progress: 1 },
  { videoId: 'v11', watchedAt: daysAgoIso(7, 10), progress: 1 },
  { videoId: 'v30', watchedAt: daysAgoIso(8, 21), progress: 0.15 },
  { videoId: 'v07', watchedAt: daysAgoIso(9, 20), progress: 1 },
  { videoId: 'v26', watchedAt: daysAgoIso(10, 22), progress: 1 },
  { videoId: 'v17', watchedAt: daysAgoIso(11, 19), progress: 1 },
  { videoId: 'v14', watchedAt: daysAgoIso(12, 20), progress: 1 },
  { videoId: 'v08', watchedAt: daysAgoIso(13, 21), progress: 1 },
]

export const seedCollections: Collection[] = [
  {
    id: 'c01',
    name: 'Stage Lights',
    description: 'Concert films and behind-the-scenes footage for when you need the arena feeling at home.',
    videoIds: ['v10', 'v11', 'v12'],
    gradient: ['#FF3E8A', '#4A0E28'],
    createdAt: daysAgoIso(30, 12),
  },
  {
    id: 'c02',
    name: 'Deep Space Marathon',
    description: 'Slow-burn science fiction for a dark room and a full evening.',
    videoIds: ['v17', 'v19', 'v20', 'v21'],
    gradient: ['#6C5CE7', '#1B1035'],
    createdAt: daysAgoIso(18, 12),
  },
  {
    id: 'c03',
    name: 'Weekend Rewatch',
    description: 'Comfort picks that hold up on a second or third viewing.',
    videoIds: ['v01', 'v28', 'v33'],
    gradient: ['#F4A340', '#3D2308'],
    createdAt: daysAgoIso(6, 12),
  },
]
