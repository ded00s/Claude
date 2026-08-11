/**
 * DEMONSTRATION DATA — entirely fictional.
 *
 * This profile does not describe a real person and the employment record is
 * invented. Figures are shaped to be plausible for Uzbekistan so the interface
 * can be evaluated realistically, but nothing here originates from the Pension
 * Fund of the Republic of Uzbekistan or any other register.
 */

import type { ScenarioInput } from '@/lib/pension'

export const CURRENT_YEAR = 2026

export interface EmploymentEvent {
  id: string
  from: number
  to: number | null
  employer: string
  role: string
  region: string
  /** Average monthly salary over the period, in so'm. */
  monthlySalary: number
  /** Total contributions recorded for the period, in so'm. */
  contributed: number
  kind: 'employment' | 'gap' | 'milestone'
  note?: string
}

export const CITIZEN = {
  /** Fictional identifier, formatted like a JSHSHIR but not a valid one. */
  pinfl: '••••  ••••  ••••  4271',
  displayName: 'Demonstration profile',
  currentAge: 42,
  birthYear: CURRENT_YEAR - 42,
  region: 'Tashkent City',
  monthlySalary: 8_400_000,
  yearsContributed: 18,
  /** Months inside the recorded window with no contributions. */
  gapMonths: 14,
  /** Total months spanned by the record, gaps included. */
  totalRecordedMonths: 18 * 12 + 14,
  /** Equals the sum of `contributed` across EMPLOYMENT_HISTORY — the two must agree. */
  accumulatedCapital: 96_350_400,
  statutoryRetirementAge: 60,
  lastContribution: 'March 2026',
} as const

export const EMPLOYMENT_HISTORY: EmploymentEvent[] = [
  {
    id: 'e1',
    from: 2006,
    to: 2010,
    employer: 'O’zbekiston Temir Yo’llari',
    role: 'Junior systems engineer',
    region: 'Tashkent City',
    monthlySalary: 890_000,
    contributed: 5_126_400,
    kind: 'employment',
  },
  {
    id: 'm1',
    from: 2008,
    to: 2008,
    employer: '',
    role: 'First 24 months of contributions recorded',
    region: '',
    monthlySalary: 0,
    contributed: 0,
    kind: 'milestone',
    note: 'Your contribution record became continuous from this point.',
  },
  {
    id: 'e2',
    from: 2010,
    to: 2015,
    employer: 'Uzbekinvest Insurance',
    role: 'Analyst, corporate risk',
    region: 'Tashkent City',
    monthlySalary: 1_950_000,
    contributed: 14_040_000,
    kind: 'employment',
  },
  {
    id: 'e3',
    from: 2015,
    to: 2018,
    employer: 'Agrobank JSCB',
    role: 'Senior analyst',
    region: 'Samarkand',
    monthlySalary: 3_400_000,
    contributed: 14_688_000,
    kind: 'employment',
  },
  {
    id: 'g1',
    from: 2018,
    to: 2019,
    employer: '',
    role: 'No contributions recorded',
    region: '',
    monthlySalary: 0,
    contributed: 0,
    kind: 'gap',
    note: 'A 14-month period with no employer contributions on file. If you were working during this time, your employer may not have filed a return.',
  },
  {
    id: 'e4',
    from: 2019,
    to: 2023,
    employer: 'IT Park Uzbekistan resident',
    role: 'Product manager',
    region: 'Tashkent City',
    monthlySalary: 5_600_000,
    contributed: 32_256_000,
    kind: 'employment',
  },
  {
    id: 'm2',
    from: 2021,
    to: 2021,
    employer: '',
    role: 'Voluntary contributions started',
    region: '',
    monthlySalary: 0,
    contributed: 0,
    kind: 'milestone',
    note: 'You began adding a voluntary monthly top-up to your individual account.',
  },
  {
    id: 'e5',
    from: 2023,
    to: null,
    employer: 'Uzum Technologies',
    role: 'Lead product manager',
    region: 'Tashkent City',
    monthlySalary: 8_400_000,
    contributed: 30_240_000,
    kind: 'employment',
  },
]

/** Twelve months of recorded contributions, for the contribution strip. */
export const RECENT_CONTRIBUTIONS = [
  { month: 'Apr', amount: 1_008_000, filed: true },
  { month: 'May', amount: 1_008_000, filed: true },
  { month: 'Jun', amount: 1_008_000, filed: true },
  { month: 'Jul', amount: 1_008_000, filed: true },
  { month: 'Aug', amount: 1_058_400, filed: true },
  { month: 'Sep', amount: 1_058_400, filed: true },
  { month: 'Oct', amount: 1_058_400, filed: true },
  { month: 'Nov', amount: 1_058_400, filed: true },
  { month: 'Dec', amount: 1_260_000, filed: true },
  { month: 'Jan', amount: 1_058_400, filed: true },
  { month: 'Feb', amount: 1_058_400, filed: true },
  { month: 'Mar', amount: 1_058_400, filed: true },
]

/** The citizen's present trajectory — the baseline every comparison starts from. */
export const BASE_SCENARIO: ScenarioInput = {
  currentAge: CITIZEN.currentAge,
  retirementAge: CITIZEN.statutoryRetirementAge,
  monthlySalary: CITIZEN.monthlySalary,
  yearsContributed: CITIZEN.yearsContributed,
  salaryGrowth: 0.05,
  additionalContribution: 0,
  existingCapital: CITIZEN.accumulatedCapital,
}
