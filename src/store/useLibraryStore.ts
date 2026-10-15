import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Collection, HistoryEntry } from '../types'
import { seedCollections, seedFavorites, seedHistory } from '../data/seed'

interface LibraryState {
  favorites: string[]
  history: HistoryEntry[]
  collections: Collection[]

  isFavorite: (videoId: string) => boolean
  toggleFavorite: (videoId: string) => void

  recordProgress: (videoId: string, progress: number) => void
  removeHistoryEntry: (videoId: string) => void
  clearHistory: () => void

  createCollection: (name: string, description: string) => string
  deleteCollection: (collectionId: string) => void
  renameCollection: (collectionId: string, name: string, description: string) => void
  addToCollection: (collectionId: string, videoId: string) => void
  removeFromCollection: (collectionId: string, videoId: string) => void

  resetAll: () => void
}

export const useLibraryStore = create<LibraryState>()(
  persist(
    (set, get) => ({
      favorites: seedFavorites,
      history: seedHistory,
      collections: seedCollections,

      isFavorite: (videoId) => get().favorites.includes(videoId),

      toggleFavorite: (videoId) =>
        set((state) => ({
          favorites: state.favorites.includes(videoId)
            ? state.favorites.filter((id) => id !== videoId)
            : [videoId, ...state.favorites],
        })),

      recordProgress: (videoId, progress) =>
        set((state) => ({
          history: [
            { videoId, watchedAt: new Date().toISOString(), progress },
            ...state.history.filter((h) => h.videoId !== videoId),
          ],
        })),

      removeHistoryEntry: (videoId) =>
        set((state) => ({ history: state.history.filter((h) => h.videoId !== videoId) })),

      clearHistory: () => set({ history: [] }),

      createCollection: (name, description) => {
        const id = `c-${Date.now().toString(36)}`
        const palette: [string, string][] = [
          ['#FF3E8A', '#4A0E28'],
          ['#6C5CE7', '#1B1035'],
          ['#00B4D8', '#032B3D'],
          ['#F4A340', '#3D2308'],
          ['#2ED573', '#0B2E1B'],
        ]
        const gradient = palette[Math.floor(Math.random() * palette.length)]
        set((state) => ({
          collections: [
            {
              id,
              name,
              description,
              videoIds: [],
              gradient,
              createdAt: new Date().toISOString(),
            },
            ...state.collections,
          ],
        }))
        return id
      },

      deleteCollection: (collectionId) =>
        set((state) => ({ collections: state.collections.filter((c) => c.id !== collectionId) })),

      renameCollection: (collectionId, name, description) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId ? { ...c, name, description } : c,
          ),
        })),

      addToCollection: (collectionId, videoId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId && !c.videoIds.includes(videoId)
              ? { ...c, videoIds: [...c.videoIds, videoId] }
              : c,
          ),
        })),

      removeFromCollection: (collectionId, videoId) =>
        set((state) => ({
          collections: state.collections.map((c) =>
            c.id === collectionId
              ? { ...c, videoIds: c.videoIds.filter((id) => id !== videoId) }
              : c,
          ),
        })),

      resetAll: () =>
        set({
          favorites: [],
          history: [],
          collections: [],
        }),
    }),
    { name: 'pinkflix-library' },
  ),
)
