import { BarChart3, Clapperboard, Heart, History, Home, ListVideo, Search, Settings } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const primaryNav: NavItem[] = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/favorites', label: 'Favorites', icon: Heart },
  { to: '/collections', label: 'Collections', icon: ListVideo },
]

export const secondaryNav: NavItem[] = [
  { to: '/history', label: 'History', icon: History },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export const allNav: NavItem[] = [...primaryNav, ...secondaryNav]

export const brand = {
  name: 'PinkFlix',
  icon: Clapperboard,
}
