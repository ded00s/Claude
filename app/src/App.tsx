import { lazy, Suspense, useEffect, useState } from 'react'
import { AppShell, type ViewId } from '@/components/layout/AppShell'
import { CitizenView } from '@/views/CitizenView'

// The citizen dashboard is the default landing view and stays in the main bundle.
// The other two are split out — most visitors never open the staff analytics.
const SimulatorView = lazy(() =>
  import('@/views/SimulatorView').then((m) => ({ default: m.SimulatorView })),
)
const AdminView = lazy(() => import('@/views/AdminView').then((m) => ({ default: m.AdminView })))

const VALID: ViewId[] = ['citizen', 'simulator', 'admin']

function readHash(): ViewId {
  const raw = window.location.hash.replace('#', '') as ViewId
  return VALID.includes(raw) ? raw : 'citizen'
}

export default function App() {
  const [view, setView] = useState<ViewId>(readHash)

  // Views are addressable, so a link can point at the simulator or the analytics
  // view directly, and the browser back button behaves as a user expects.
  useEffect(() => {
    const onHashChange = () => setView(readHash())
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  const go = (next: ViewId) => {
    window.location.hash = next
    setView(next)
    // Moving between views should start the reading position at the top, but must
    // not fight a user who has reduced motion enabled.
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
  }

  return (
    <AppShell view={view} onViewChange={go}>
      <Suspense fallback={<ViewSkeleton />}>
        {view === 'citizen' ? <CitizenView onOpenSimulator={() => go('simulator')} /> : null}
        {view === 'simulator' ? <SimulatorView /> : null}
        {view === 'admin' ? <AdminView /> : null}
      </Suspense>
    </AppShell>
  )
}

/**
 * Reserves the same vertical space the real view will occupy, so switching views
 * does not shift the page underneath the user while a chunk loads.
 */
function ViewSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading view…</span>
      <div className="h-56 animate-pulse rounded-[var(--radius-card)] border border-border bg-surface" />
      <div className="h-96 animate-pulse rounded-[var(--radius-card)] border border-border bg-surface" />
    </div>
  )
}
