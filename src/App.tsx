import { lazy, Suspense, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'

import { Sidebar } from './components/layout/Sidebar'
import { BottomNav } from './components/layout/BottomNav'
import { TopBar } from './components/layout/TopBar'
import { ToastContainer } from './components/common/ToastContainer'
import { QuickSettingsModal } from './components/settings/QuickSettingsModal'
import { GridSkeleton } from './components/video/VideoCardSkeleton'

// Home ships eagerly since it's the initial route; everything else is
// code-split so the first paint stays as small as possible.
import { Home } from './pages/Home'

const Search = lazy(() => import('./pages/Search').then((m) => ({ default: m.Search })))
const Favorites = lazy(() => import('./pages/Favorites').then((m) => ({ default: m.Favorites })))
const Collections = lazy(() => import('./pages/Collections').then((m) => ({ default: m.Collections })))
const CollectionDetail = lazy(() =>
  import('./pages/CollectionDetail').then((m) => ({ default: m.CollectionDetail })),
)
const History = lazy(() => import('./pages/History').then((m) => ({ default: m.History })))
const Analytics = lazy(() => import('./pages/Analytics').then((m) => ({ default: m.Analytics })))
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })))
const More = lazy(() => import('./pages/More').then((m) => ({ default: m.More })))
const TitleDetail = lazy(() => import('./pages/TitleDetail').then((m) => ({ default: m.TitleDetail })))
const NotFound = lazy(() => import('./pages/NotFound').then((m) => ({ default: m.NotFound })))

function RouteFallback() {
  return (
    <div className="px-4 sm:px-6 pt-5">
      <GridSkeleton count={8} />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const [quickSettingsOpen, setQuickSettingsOpen] = useState(false)

  return (
    <div className="min-h-dvh bg-black flex">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <TopBar onOpenQuickSettings={() => setQuickSettingsOpen(true)} />

        <main className="flex-1 pb-28 lg:pb-10">
          <Suspense fallback={<RouteFallback />}>
            <AnimatePresence mode="wait" initial={false}>
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Home />} />
                <Route path="/search" element={<Search />} />
                <Route path="/favorites" element={<Favorites />} />
                <Route path="/collections" element={<Collections />} />
                <Route path="/collections/:collectionId" element={<CollectionDetail />} />
                <Route path="/history" element={<History />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/more" element={<More />} />
                <Route path="/title/:videoId" element={<TitleDetail />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </Suspense>
        </main>
      </div>

      <BottomNav />
      <ToastContainer />
      <QuickSettingsModal open={quickSettingsOpen} onClose={() => setQuickSettingsOpen(false)} />
    </div>
  )
}
