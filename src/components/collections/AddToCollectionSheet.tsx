import { useState } from 'react'
import { Check, Plus } from 'lucide-react'
import { Modal } from '../common/Modal'
import { CreateCollectionModal } from './CreateCollectionModal'
import { useLibraryStore } from '../../store/useLibraryStore'
import { useToastStore } from '../../store/useToastStore'

interface AddToCollectionSheetProps {
  open: boolean
  onClose: () => void
  videoId: string
}

export function AddToCollectionSheet({ open, onClose, videoId }: AddToCollectionSheetProps) {
  const collections = useLibraryStore((s) => s.collections)
  const addToCollection = useLibraryStore((s) => s.addToCollection)
  const removeFromCollection = useLibraryStore((s) => s.removeFromCollection)
  const createCollection = useLibraryStore((s) => s.createCollection)
  const pushToast = useToastStore((s) => s.push)
  const [creating, setCreating] = useState(false)

  function toggle(collectionId: string, inCollection: boolean) {
    if (inCollection) {
      removeFromCollection(collectionId, videoId)
    } else {
      addToCollection(collectionId, videoId)
      pushToast({ title: 'Added to collection', variant: 'success' })
    }
  }

  return (
    <>
      <Modal open={open && !creating} onClose={onClose} title="Add to Collection">
        <div className="flex flex-col gap-1.5">
          {collections.length === 0 && (
            <p className="text-[13.5px] text-ink-tertiary py-4 text-center">
              You don&rsquo;t have any collections yet.
            </p>
          )}
          {collections.map((c) => {
            const inCollection = c.videoIds.includes(videoId)
            return (
              <button
                key={c.id}
                onClick={() => toggle(c.id, inCollection)}
                className="focus-ring flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors duration-150 text-left"
              >
                <div
                  className="w-9 h-9 rounded-lg shrink-0"
                  style={{ background: `linear-gradient(135deg, ${c.gradient[0]}, ${c.gradient[1]})` }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium text-ink-primary line-clamp-1">{c.name}</p>
                  <p className="text-[11.5px] text-ink-tertiary">{c.videoIds.length} titles</p>
                </div>
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                    inCollection ? 'bg-accent-500' : 'bg-white/10'
                  }`}
                >
                  {inCollection && <Check size={13} className="text-white" />}
                </div>
              </button>
            )
          })}
          <button
            onClick={() => setCreating(true)}
            className="focus-ring flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-white/5 transition-colors duration-150 text-left mt-1"
          >
            <div className="w-9 h-9 rounded-lg shrink-0 border border-dashed border-white/20 flex items-center justify-center">
              <Plus size={16} className="text-ink-tertiary" />
            </div>
            <p className="text-[13.5px] font-medium text-accent-400">New collection</p>
          </button>
        </div>
      </Modal>

      <CreateCollectionModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreate={(name, description) => {
          const id = createCollection(name, description)
          addToCollection(id, videoId)
          setCreating(false)
          pushToast({ title: 'Collection created', description: name, variant: 'success' })
        }}
      />
    </>
  )
}
