import { useState } from 'react'
import { Modal } from '../common/Modal'

interface CreateCollectionModalProps {
  open: boolean
  onClose: () => void
  onCreate: (name: string, description: string) => void
}

export function CreateCollectionModal({ open, onClose, onCreate }: CreateCollectionModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  function handleCreate() {
    if (!name.trim()) return
    onCreate(name.trim(), description.trim())
    setName('')
    setDescription('')
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New Collection"
      footer={
        <button
          onClick={handleCreate}
          disabled={!name.trim()}
          className="focus-ring w-full rounded-2xl bg-accent-500 hover:bg-accent-600 disabled:bg-white/10 disabled:text-ink-tertiary text-white font-semibold text-[14.5px] py-3 transition-colors duration-200"
        >
          Create collection
        </button>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-[12.5px] font-medium text-ink-secondary mb-1.5 block">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Rainy Day Watchlist"
            className="focus-ring w-full glass rounded-xl px-3.5 py-2.5 text-[14px] text-ink-primary placeholder:text-ink-tertiary outline-none"
            autoFocus
          />
        </div>
        <div>
          <label className="text-[12.5px] font-medium text-ink-secondary mb-1.5 block">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What ties these titles together?"
            rows={3}
            className="focus-ring w-full glass rounded-xl px-3.5 py-2.5 text-[14px] text-ink-primary placeholder:text-ink-tertiary outline-none resize-none"
          />
        </div>
      </div>
    </Modal>
  )
}
