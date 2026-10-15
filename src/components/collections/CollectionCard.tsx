import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ListVideo } from 'lucide-react'
import type { Collection } from '../../types'

export function CollectionCard({ collection }: { collection: Collection }) {
  const [from, to] = collection.gradient
  return (
    <Link to={`/collections/${collection.id}`} className="group block focus-ring rounded-2xl">
      <motion.div
        whileHover={{ y: -4 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-card ring-1 ring-white/10 group-hover:ring-accent-500/40 transition-shadow duration-300"
        style={{ background: `linear-gradient(150deg, ${from} 0%, ${to} 100%)` }}
      >
        <ListVideo className="absolute -right-4 -bottom-6 w-28 h-28 text-white/10" strokeWidth={1} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute bottom-3 left-3.5 right-3.5">
          <h3 className="text-[15px] font-semibold text-white leading-tight line-clamp-1">{collection.name}</h3>
          <p className="text-[12px] text-white/70 mt-0.5">
            {collection.videoIds.length} {collection.videoIds.length === 1 ? 'title' : 'titles'}
          </p>
        </div>
      </motion.div>
    </Link>
  )
}
