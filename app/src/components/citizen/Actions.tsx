import {
  BookOpen,
  Calculator,
  Download,
  FileSearch,
  FileWarning,
  History,
  MessageSquare,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardBody, CardHeader } from '@/components/ui/Card'
import { cn } from '@/lib/cn'

interface Action {
  id: string
  icon: LucideIcon
  label: string
  description: string
  /** Primary actions get visual weight; the rest stay quiet. */
  emphasis?: boolean
}

const ACTIONS: Action[] = [
  {
    id: 'history',
    icon: History,
    label: 'View contribution history',
    description: 'Every payment recorded against your name, by month and employer.',
  },
  {
    id: 'employment',
    icon: FileSearch,
    label: 'Check employment record',
    description: 'Confirm the periods and employers held on file are correct.',
  },
  {
    id: 'statement',
    icon: Download,
    label: 'Download pension statement',
    description: 'An official PDF summary of your record and current projection.',
    emphasis: true,
  },
  {
    id: 'report',
    icon: FileWarning,
    label: 'Report incorrect information',
    description: 'Raise a correction if a period or employer is missing or wrong.',
    emphasis: true,
  },
  {
    id: 'calculate',
    icon: Calculator,
    label: 'Calculate pension',
    description: 'Model salary, service and retirement age against your projection.',
  },
  {
    id: 'learn',
    icon: BookOpen,
    label: 'Learn how pension is calculated',
    description: 'A plain-language walkthrough of each component of your pension.',
  },
  {
    id: 'contact',
    icon: MessageSquare,
    label: 'Contact the Pension Fund',
    description: 'Reach a regional office by message, telephone or appointment.',
  },
]

export function Actions({ onCalculate }: { onCalculate?: () => void }) {
  return (
    <Card as="section">
      <CardHeader
        as="h2"
        id="actions-heading"
        title="What you can do"
        description="Every service related to your pension record, in one place."
      />

      <CardBody className="pt-4">
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ACTIONS.map((action) => {
            const Icon = action.icon
            return (
              <li key={action.id}>
                <button
                  type="button"
                  onClick={action.id === 'calculate' ? onCalculate : undefined}
                  className={cn(
                    'group flex h-full w-full cursor-pointer items-start gap-3 rounded-[var(--radius-control)] border p-4 text-left',
                    'transition-[border-color,background-color,transform] duration-150 ease-out',
                    'hover:-translate-y-px active:translate-y-0',
                    action.emphasis
                      ? 'border-primary/25 bg-primary-soft/40 hover:border-primary/50'
                      : 'border-border bg-surface hover:border-border-strong hover:bg-surface-inset',
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-[var(--radius-control)]',
                      action.emphasis
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-inset text-fg-muted group-hover:text-primary',
                    )}
                  >
                    <Icon size={17} />
                  </span>

                  <span className="min-w-0">
                    <span className="block text-sm font-medium text-fg">{action.label}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-fg-muted">
                      {action.description}
                    </span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </CardBody>
    </Card>
  )
}
