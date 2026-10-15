import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, ListVideo, Pencil, Trash2 } from 'lucide-react'
import { PageTransition } from '../components/layout/PageTransition'
import { VideoCard } from '../components/video/VideoCard'
import { EmptyState } from '../components/common/EmptyState'
import { Modal } from '../components/common/Modal'
import { catalogById } from '../data/catalog'
import { useLibraryStore } from '../store/useLibraryStore'
import { useToastStore } from '../store/useToastStore'
import { formatDate } from '../utils/format'

export function CollectionDetail() {
  const { collectionId } = useParams<{ collectionId: string }>()
  const navigate = useNavigate()
  const collections = useLibraryStore((s) => s.collections)
  const deleteCollection = useLibraryStore((s) => s.deleteCollection)
  const renameCollection = useLibraryStore((s) => s.renameCollection)
  const pushToast = useToastStore((s) => s.push)

  const collection = collections.find((c) => c.id === collectionId)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(collection?.name ?? '')
  const [description, setDescription] = useState(collection?.description ?? '')

  const items = useMemo(
    () =>
      (collection?.videoIds ?? [])
        .map((id) => catalogById.get(id))
        .filter((x): x is NonNullable<typeof x> => Boolean(x)),
    [collection],
  )

  if (!collection) {
    return (
      <PageTransition>
        <div className="px-4 sm:px-6 pt-16">
          <EmptyState
            icon={<ListVideo size={24} />}
            title="Collection not found"
            description="It may have been deleted."
            action={
              <Link to="/collections" className="focus-ring text-accent-400 text-[13.5px] font-semibold">
                Back to Collections
              </Link>
            }
          />
        </div>
      </PageTransition>
    )
  }

  const [from, to] = collection.gradient

  return (
    <PageTransition>
      <div className="relative mx-4 sm:mx-6 mt-3 rounded-3xl overflow-hidden shadow-card ring-1 ring-white/10 p-6 sm:p-8">
        <div className="absolute inset-0" style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }} />
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative">
          <button
            onClick={() => navigate('/collections')}
            className="focus-ring w-9 h-9 rounded-full glass flex items-center justify-center text-white mb-5"
            aria-label="Back"
          >
            <ArrowLeft size={17} />
          </button>
          <h1 className="text-[26px] sm:text-[32px] font-bold text-white tracking-tight">{collection.name}</h1>
          <p className="text-[13.5px] text-white/80 mt-2 max-w-md">{collection.description}</p>
          <p className="text-[12px] text-white/60 mt-3">
            {items.length} {items.length === 1 ? 'title' : 'titles'} &middot; Created {formatDate(collection.createdAt)}
          </p>
          <div className="flex gap-2 mt-5">
            <button
              onClick={() => setEditing(true)}
              className="focus-ring flex items-center gap-1.5 rounded-full glass px-3.5 py-2 text-[13px] font-medium text-white"
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="focus-ring flex items-center gap-1.5 rounded-full glass px-3.5 py-2 text-[13px] font-medium text-white"
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 py-6">
        {items.length === 0 ? (
          <EmptyState
            icon={<ListVideo size={24} />}
            title="This collection is empty"
            description="Open any title and choose 'Add to Collection' to start filling it in."
            action={
              <Link
                to="/search"
                className="focus-ring rounded-full bg-accent-500 hover:bg-accent-600 text-white text-[13.5px] font-semibold px-4 py-2 transition-colors"
              >
                Browse the catalog
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-3 gap-y-6">
            {items.map((item, i) => (
              <VideoCard key={item.id} item={item} index={i} />
            ))}
          </div>
        )}
      </div>

      <Modal
        open={editing}
        onClose={() => setEditing(false)}
        title="Edit Collection"
        footer={
          <button
            onClick={() => {
              renameCollection(collection.id, name.trim() || collection.name, description.trim())
              setEditing(false)
              pushToast({ title: 'Collection updated', variant: 'success' })
            }}
            className="focus-ring w-full rounded-2xl bg-accent-500 hover:bg-accent-600 text-white font-semibold text-[14.5px] py-3 transition-colors"
          >
            Save changes
          </button>
        }
      >
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[12.5px] font-medium text-ink-secondary mb-1.5 block">Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="focus-ring w-full glass rounded-xl px-3.5 py-2.5 text-[14px] text-ink-primary outline-none"
            />
          </div>
          <div>
            <label className="text-[12.5px] font-medium text-ink-secondary mb-1.5 block">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="focus-ring w-full glass rounded-xl px-3.5 py-2.5 text-[14px] text-ink-primary outline-none resize-none"
            />
          </div>
        </div>
      </Modal>

      <Modal
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        title="Delete collection?"
        footer={
          <div className="flex gap-2">
            <button
              onClick={() => setConfirmDelete(false)}
              className="focus-ring flex-1 rounded-2xl bg-white/8 hover:bg-white/12 text-ink-primary font-semibold text-[14.5px] py-3 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                deleteCollection(collection.id)
                pushToast({ title: 'Collection deleted', variant: 'default' })
                navigate('/collections')
              }}
              className="focus-ring flex-1 rounded-2xl bg-red-500/90 hover:bg-red-500 text-white font-semibold text-[14.5px] py-3 transition-colors"
            >
              Delete
            </button>
          </div>
        }
      >
        <p className="text-[13.5px] text-ink-secondary leading-relaxed">
          This will remove &ldquo;{collection.name}&rdquo; and its list of titles. The titles themselves won&rsquo;t be
          deleted from the catalog.
        </p>
      </Modal>
    </PageTransition>
  )
}
