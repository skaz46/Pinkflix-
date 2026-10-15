import { Link } from 'react-router-dom'
import { Modal } from '../common/Modal'
import { Toggle } from '../common/Toggle'
import { useSettingsStore } from '../../store/useSettingsStore'

interface QuickSettingsModalProps {
  open: boolean
  onClose: () => void
}

export function QuickSettingsModal({ open, onClose }: QuickSettingsModalProps) {
  const settings = useSettingsStore()

  return (
    <Modal open={open} onClose={onClose} title="Quick Settings">
      <div className="flex flex-col divide-y divide-white/8">
        <Row
          label="Autoplay"
          description="Start playing automatically when you open a title"
          checked={settings.autoplay}
          onChange={(v) => settings.updateSetting('autoplay', v)}
        />
        <Row
          label="Reduce motion"
          description="Use simpler transitions across the app"
          checked={settings.reduceMotion}
          onChange={(v) => settings.updateSetting('reduceMotion', v)}
        />
        <Row
          label="Data saver"
          description="Prefer lower resolutions when available"
          checked={settings.dataSaver}
          onChange={(v) => settings.updateSetting('dataSaver', v)}
        />
      </div>
      <Link
        to="/settings"
        onClick={onClose}
        className="focus-ring mt-4 block text-center text-[13.5px] font-medium text-accent-400 hover:text-accent-300 py-2"
      >
        All settings
      </Link>
    </Modal>
  )
}

function Row({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5">
      <div className="min-w-0">
        <p className="text-[14px] font-medium text-ink-primary">{label}</p>
        <p className="text-[12px] text-ink-tertiary mt-0.5 leading-snug">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={label} />
    </div>
  )
}
