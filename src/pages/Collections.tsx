import { useState } from 'react'
import { Plus, ListVideo } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { CollectionCard } from '../components/collections/CollectionCard'
import { CreateCollectionModal } from '../components/collections/CreateCollectionModal'
import { EmptyState } from '../components/common/EmptyState'
import { useLibraryStore } from '../store/useLibraryStore'
import { useToastStore } from '../store/useToastStore'

export function Collections() {
  const collections = useLibraryStore((s) => s.collections)
  const createCollection = useLibraryStore((s) => s.createCollection)
  const pushToast = useToastStore((s) => s.push)
  const [creating, setCreating] = useState(false)

  return (
    <PageTransition>
      <div className="px-4 sm:px-6 pt-5 pb-6">
        <div className="flex items-center justify-between mb-1">
          <h1 className="text-[22px] font-bold text-ink-primary tracking-tight">Collections</h1>
          <button
            onClick={() => setCreating(true)}
            aria-label="New collection"
            className="focus-ring w-9 h-9 rounded-full bg-accent-500 hover:bg-accent-600 flex items-center justify-center text-white transition-colors"
          >
            <Plus size={18} />
          </button>
        </div>
        <p className="text-[13.5px] text-ink-tertiary mb-6">
          {collections.length} {collections.length === 1 ? 'collection' : 'collections'}
        </p>

        {collections.length === 0 ? (
          <EmptyState
            icon={<ListVideo size={24} />}
            title="No collections yet"
            description="Group titles into playlists like 'Weekend Rewatch' or 'Deep Space Marathon'."
            action={
              <button
                onClick={() => setCreating(true)}
                className="focus-ring rounded-full bg-accent-500 hover:bg-accent-600 text-white text-[13.5px] font-semibold px-4 py-2 transition-colors"
              >
                Create a collection
              </button>
            }
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {collections.map((c) => (
              <CollectionCard key={c.id} collection={c} />
            ))}
          </div>
        )}
      </div>

      <CreateCollectionModal
        open={creating}
        onClose={() => setCreating(false)}
        onCreate={(name, description) => {
          createCollection(name, description)
          setCreating(false)
          pushToast({ title: 'Collection created', description: name, variant: 'success' })
        }}
      />
    </PageTransition>
  )
}
