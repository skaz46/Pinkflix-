import { useState } from 'react'
import { Download, Moon, RotateCcw, Smartphone, Trash2 } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { Toggle } from '../components/common/Toggle'
import { Modal } from '../components/common/Modal'
import { useSettingsStore } from '../store/useSettingsStore'
import { useLibraryStore } from '../store/useLibraryStore'
import { useToastStore } from '../store/useToastStore'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import type { Resolution } from '../types'

const qualities: Resolution[] = ['720p', '1080p', '4K', '4K HDR']

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-[12.5px] font-semibold text-ink-tertiary uppercase tracking-wide mb-2 px-1">{title}</h2>
      <div className="glass rounded-2xl divide-y divide-white/8 overflow-hidden">{children}</div>
    </div>
  )
}

function SettingRow({
  label,
  description,
  control,
}: {
  label: string
  description?: string
  control: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-ink-primary">{label}</p>
        {description && <p className="text-[12px] text-ink-tertiary mt-0.5 leading-snug">{description}</p>}
      </div>
      {control}
    </div>
  )
}

export function Settings() {
  const settings = useSettingsStore()
  const resetAll = useLibraryStore((s) => s.resetAll)
  const pushToast = useToastStore((s) => s.push)
  const { canInstall, isInstalled, promptInstall } = useInstallPrompt()
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 pt-5 pb-10 max-w-2xl">
        <h1 className="text-[22px] font-bold text-ink-primary tracking-tight mb-6">Settings</h1>

        <div className="flex flex-col gap-6">
          <SectionCard title="Playback">
            <SettingRow
              label="Autoplay"
              description="Start playing automatically when you open a title"
              control={
                <Toggle
                  checked={settings.autoplay}
                  onChange={(v) => settings.updateSetting('autoplay', v)}
                  label="Autoplay"
                />
              }
            />
            <SettingRow
              label="Data saver"
              description="Prefer lower resolutions when available"
              control={
                <Toggle
                  checked={settings.dataSaver}
                  onChange={(v) => settings.updateSetting('dataSaver', v)}
                  label="Data saver"
                />
              }
            />
            <div className="px-4 py-3.5">
              <p className="text-[14px] font-medium text-ink-primary mb-2.5">Default quality</p>
              <div className="flex gap-2 flex-wrap">
                {qualities.map((q) => (
                  <button
                    key={q}
                    onClick={() => settings.updateSetting('defaultQuality', q)}
                    className={`focus-ring px-3 py-1.5 rounded-full text-[12.5px] font-medium transition-colors ${
                      settings.defaultQuality === q
                        ? 'bg-accent-500 text-white'
                        : 'bg-white/6 text-ink-secondary hover:bg-white/10'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Appearance">
            <SettingRow
              label="Dark mode"
              description="PinkFlix uses an AMOLED black theme, always"
              control={
                <div className="flex items-center gap-1.5 text-ink-tertiary">
                  <Moon size={15} />
                  <span className="text-[12.5px]">Always on</span>
                </div>
              }
            />
            <SettingRow
              label="Reduce motion"
              description="Use simpler transitions across the app"
              control={
                <Toggle
                  checked={settings.reduceMotion}
                  onChange={(v) => settings.updateSetting('reduceMotion', v)}
                  label="Reduce motion"
                />
              }
            />
          </SectionCard>

          <SectionCard title="Notifications">
            <SettingRow
              label="Recommendations & updates"
              description="Occasional nudges about new titles you might like"
              control={
                <Toggle
                  checked={settings.notifications}
                  onChange={(v) => settings.updateSetting('notifications', v)}
                  label="Notifications"
                />
              }
            />
          </SectionCard>

          <SectionCard title="App">
            <SettingRow
              label="Install PinkFlix"
              description={
                isInstalled
                  ? 'Already installed on this device'
                  : canInstall
                    ? 'Add to your home screen for the full-screen native experience'
                    : 'Use your browser\u2019s "Add to Home Screen" option'
              }
              control={
                isInstalled ? (
                  <Smartphone size={17} className="text-emerald-400" />
                ) : (
                  <button
                    onClick={promptInstall}
                    disabled={!canInstall}
                    className="focus-ring flex items-center gap-1.5 rounded-full bg-accent-500 hover:bg-accent-600 disabled:bg-white/8 disabled:text-ink-tertiary text-white text-[12.5px] font-semibold px-3.5 py-2 transition-colors"
                  >
                    <Download size={13} /> Install
                  </button>
                )
              }
            />
          </SectionCard>

          <SectionCard title="Data & Privacy">
            <div className="px-4 py-3.5">
              <p className="text-[13px] text-ink-secondary leading-relaxed mb-3">
                Favorites, history, collections and settings are stored only on this device using local storage.
                Nothing is uploaded anywhere.
              </p>
              <button
                onClick={() => setConfirmReset(true)}
                className="focus-ring flex items-center gap-1.5 text-[13px] font-medium text-red-400 hover:text-red-300"
              >
                <Trash2 size={14} /> Reset all data
              </button>
            </div>
          </SectionCard>

          <button
            onClick={() => {
              settings.resetSettings()
              pushToast({ title: 'Settings restored to defaults', variant: 'default' })
            }}
            className="focus-ring flex items-center justify-center gap-1.5 text-[13px] font-medium text-ink-tertiary hover:text-ink-primary py-2"
          >
            <RotateCcw size={13} /> Restore default settings
          </button>

          <p className="text-center text-[11.5px] text-ink-tertiary/70 pb-4">PinkFlix &middot; version 1.0.0</p>
        </div>
      </div>

      <Modal
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset all data?"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmReset(false)}
              className="focus-ring flex-1 rounded-2xl bg-white/8 hover:bg-white/12 text-ink-primary font-semibold text-[14.5px] py-3 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                resetAll()
                setConfirmReset(false)
                pushToast({ title: 'All data reset', variant: 'default' })
              }}
              className="focus-ring flex-1 rounded-2xl bg-red-500/90 hover:bg-red-500 text-white font-semibold text-[14.5px] py-3 transition-colors"
            >
              Reset
            </button>
          </div>
        }
      >
        <p className="text-[13.5px] text-ink-secondary leading-relaxed">
          This permanently clears favorites, watch history and collections stored on this device. This
          can&rsquo;t be undone.
        </p>
      </Modal>
    </PageTransition>
  )
}
