import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { loadAllFonts } from './utils/fontLoader.js'

const Home = lazy(() => import('./pages/Home.jsx'))
const ThumbnailCreator = lazy(() => import('./pages/ThumbnailCreator.jsx'))
const StatisticFrameCreator = lazy(() => import('./pages/StatisticFrameCreator.jsx'))
const DuotoneCreator = lazy(() => import('./pages/DuotoneCreator.jsx'))

function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center gap-4 text-center px-4">
        <h1 className="text-6xl font-bold m-0" style={{ color: 'var(--text-primary)' }}>404</h1>
        <p className="text-lg m-0" style={{ color: 'var(--text-secondary)' }}>
          Page not found
        </p>
        <p className="text-sm m-0" style={{ color: 'var(--text-tertiary)' }}>
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="mt-2 px-5 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
          style={{
            backgroundColor: 'var(--color-primary-500)',
            color: '#fff',
          }}
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}

function LoadingFallback() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin"
          style={{ borderColor: 'var(--border-color)', borderTopColor: 'transparent' }}
        />
        <p style={{ color: 'var(--text-tertiary)' }} className="text-sm">Loading...</p>
      </div>
    </div>
  )
}

export default function App() {
  // Preload fonts on app init so they're ready when user navigates to a creator page
  useEffect(() => {
    loadAllFonts().catch((err) => {
      console.warn('Font preloading failed (fonts will load on demand):', err)
    })
  }, [])

  return (
    <>
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/thumbnail-creator" element={<ThumbnailCreator />} />
            <Route path="/statistic-frame-creator" element={<StatisticFrameCreator />} />
            <Route path="/duotone-creator" element={<DuotoneCreator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
