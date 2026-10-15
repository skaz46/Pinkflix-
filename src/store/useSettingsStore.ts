import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AppSettings } from '../types'

interface SettingsState extends AppSettings {
  updateSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => void
  resetSettings: () => void
}

const defaults: AppSettings = {
  autoplay: true,
  reduceMotion: false,
  dataSaver: false,
  defaultQuality: '1080p',
  notifications: true,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...defaults,
      updateSetting: (key, value) => set({ [key]: value } as Partial<AppSettings>),
      resetSettings: () => set(defaults),
    }),
    { name: 'pinkflix-settings' },
  ),
)
