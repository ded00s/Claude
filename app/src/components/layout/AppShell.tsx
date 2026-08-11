import { useEffect, useRef, useState, type ReactNode } from 'react'
import {
  BarChart3,
  Calculator,
  ChevronDown,
  LayoutDashboard,
  Menu,
  Moon,
  Sun,
  X,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { useTheme } from '@/hooks/useTheme'
import { Logo } from './Logo'
import { DemoBanner } from './DemoBanner'
import { CITIZEN } from '@/data/citizen'

export type ViewId = 'citizen' | 'simulator' | 'admin'

const NAV: Array<{ id: ViewId; label: string; icon: typeof LayoutDashboard; audience: string }> = [
  { id: 'citizen', label: 'My pension', icon: LayoutDashboard, audience: 'Citizen' },
  { id: 'simulator', label: 'What if?', icon: Calculator, audience: 'Citizen' },
  { id: 'admin', label: 'Fund analytics', icon: BarChart3, audience: 'Staff' },
]

export function AppShell({
  view,
  onViewChange,
  children,
}: {
  view: ViewId
  onViewChange: (v: ViewId) => void
  children: ReactNode
}) {
  const { theme, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close the mobile drawer on Escape, and restore focus to the trigger.
  const triggerRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [mobileOpen])

  const go = (id: ViewId) => {
    onViewChange(id)
    setMobileOpen(false)
  }

  return (
    <div className="min-h-dvh bg-bg">
      <a href="#main" className="skip-link rounded bg-primary px-4 py-2 text-on-primary">
        Skip to main content
      </a>

      <DemoBanner />

      <header className="sticky top-0 z-40 border-b border-border bg-surface/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-4 px-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <Logo />
            <div className="min-w-0 leading-tight">
              <p className="truncate text-sm font-semibold text-fg">My Future Pension</p>
              <p className="hidden truncate text-xs text-fg-muted sm:block">
                Pension Fund of the Republic of Uzbekistan
              </p>
            </div>
          </div>

          {/* Desktop navigation */}
          <nav aria-label="Main" className="ml-4 hidden lg:block">
            <ul className="flex items-center gap-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <NavButton item={item} active={view === item.id} onClick={() => go(item.id)} />
                </li>
              ))}
            </ul>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[var(--radius-control)] text-fg-muted transition-colors duration-150 hover:bg-surface-inset hover:text-fg"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <div className="hidden items-center gap-2.5 border-l border-border pl-3 sm:flex">
              <div
                aria-hidden="true"
                className="grid h-9 w-9 place-items-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-fg"
              >
                DP
              </div>
              <div className="leading-tight">
                <p className="text-xs font-medium text-fg">{CITIZEN.displayName}</p>
                <p className="tabular text-2xs text-fg-subtle">{CITIZEN.pinfl}</p>
              </div>
            </div>

            <button
              ref={triggerRef}
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-[var(--radius-control)] text-fg-muted transition-colors duration-150 hover:bg-surface-inset hover:text-fg lg:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {mobileOpen ? (
          <nav
            id="mobile-nav"
            aria-label="Main"
            className="animate-fade border-t border-border bg-surface px-4 py-3 lg:hidden"
          >
            <ul className="space-y-1">
              {NAV.map((item) => (
                <li key={item.id}>
                  <NavButton
                    item={item}
                    active={view === item.id}
                    onClick={() => go(item.id)}
                    full
                  />
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <main id="main" tabIndex={-1} className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>

      <footer className="mt-8 border-t border-border bg-surface">
        <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6">
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div className="max-w-md">
              <div className="flex items-center gap-2.5">
                <Logo size={24} />
                <p className="text-sm font-semibold text-fg">My Future Pension</p>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-fg-muted">
                An unofficial design concept for the digital transformation of the Pension Fund of
                the Republic of Uzbekistan. Not affiliated with, endorsed by, or operated by any
                state body. All data shown is fictional.
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-x-10 gap-y-3 text-xs sm:grid-cols-3">
              <div>
                <dt className="font-medium text-fg">Model</dt>
                <dd className="mt-1 text-fg-muted">Illustrative, not statutory</dd>
              </div>
              <div>
                <dt className="font-medium text-fg">Data</dt>
                <dd className="mt-1 text-fg-muted">Synthetic demonstration set</dd>
              </div>
              <div>
                <dt className="font-medium text-fg">Accessibility</dt>
                <dd className="mt-1 text-fg-muted">Targets WCAG 2.1 AA</dd>
              </div>
            </dl>
          </div>
        </div>
      </footer>
    </div>
  )
}

function NavButton({
  item,
  active,
  onClick,
  full,
}: {
  item: (typeof NAV)[number]
  active: boolean
  onClick: () => void
  full?: boolean
}) {
  const Icon = item.icon
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-control)] px-3 py-2 text-sm font-medium',
        'transition-colors duration-150 ease-out',
        full && 'w-full justify-start',
        active
          ? 'bg-primary-soft text-primary-soft-fg'
          : 'text-fg-muted hover:bg-surface-inset hover:text-fg',
      )}
    >
      <Icon size={16} aria-hidden="true" />
      {item.label}
      {item.audience === 'Staff' ? (
        <span className="ml-1 rounded bg-surface-inset px-1.5 py-0.5 text-2xs font-medium text-fg-subtle">
          Staff
        </span>
      ) : null}
      {full ? <ChevronDown size={14} className="ml-auto -rotate-90 opacity-40" aria-hidden="true" /> : null}
    </button>
  )
}
