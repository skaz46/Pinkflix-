import {
  Clapperboard,
  Siren,
  Mic2,
  Camera,
  Rocket,
  Sparkles,
  Heart,
  Swords,
  Music,
  Smile,
  Video,
  KeyRound,
  Wand2,
  Feather,
  type LucideIcon,
} from 'lucide-react'
import type { Tag } from '../types'

export const tagIconMap: Record<Tag, LucideIcon> = {
  Drama: Clapperboard,
  Thriller: Siren,
  'Concert Film': Mic2,
  Documentary: Camera,
  'Sci-Fi': Rocket,
  Anime: Sparkles,
  Romance: Heart,
  Action: Swords,
  Music: Music,
  Comedy: Smile,
  'Behind the Scenes': Video,
  Mystery: KeyRound,
  Fantasy: Wand2,
  Indie: Feather,
}

export function primaryTagIcon(tags: Tag[]): LucideIcon {
  return tagIconMap[tags[0]] ?? Clapperboard
}
