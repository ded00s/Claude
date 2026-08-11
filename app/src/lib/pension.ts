/**
 * Pension projection model — ILLUSTRATIVE ONLY.
 *
 * This is a deliberately transparent, self-consistent teaching model built for a
 * design concept. It is NOT the statutory formula of the Pension Fund of the
 * Republic of Uzbekistan, and it must never be presented as such. Every figure it
 * produces is a demonstration of interface behaviour, not a pension entitlement.
 *
 * The model is kept simple on purpose so that a citizen can follow the causal
 * chain — more years, or a higher salary, or a later retirement each move the
 * result in a direction the user can predict. That legibility matters more here
 * than actuarial precision.
 */

/** Model constants, surfaced so the UI can explain itself. */
export const MODEL = {
  /** Service years required before the full replacement rate applies. */
  fullServiceYears: 25,
  /**
   * Replacement rate awarded at exactly `fullServiceYears`. Calibrated so the
   * model lands in the 40–50% range that pension systems of this type actually
   * deliver — a projection that promises 75%+ of final salary would flatter the
   * citizen and misinform the decision the simulator exists to support.
   */
  baseReplacement: 0.45,
  /** Added replacement per year of service beyond `fullServiceYears`. */
  perExtraYear: 0.01,
  /** Ceiling on the replacement rate. */
  maxReplacement: 0.6,
  /**
   * Share of salary accruing to the individual account. Small on purpose: the
   * earnings-related component carries most of the pension, and the individual
   * account is a supplement, not the main engine.
   */
  accrualRate: 0.02,
  /** Assumed years of payout used to annuitise accumulated capital. */
  payoutYears: 18,
  /** Assumed long-run wage indexation, used to index historic earnings. */
  indexation: 0.06,
  /** Adequacy benchmark: pension as a share of final salary. */
  adequacyTarget: 0.6,
  /** Statutory retirement ages in Uzbekistan, offered as simulator presets. */
  statutoryAge: { men: 60, women: 55 },
} as const

export interface ScenarioInput {
  currentAge: number
  retirementAge: number
  monthlySalary: number
  /** Years of contribution already recorded. */
  yearsContributed: number
  /** Expected annual salary growth, as a fraction (0.05 = 5%). */
  salaryGrowth: number
  /** Voluntary monthly top-up on the individual account. */
  additionalContribution: number
  /** Capital already accumulated from past contributions. */
  existingCapital: number
}

export interface ScenarioResult {
  monthlyPension: number
  replacementRate: number
  totalServiceYears: number
  finalSalary: number
  capitalAtRetirement: number
  /** Portion of the monthly pension from the earnings-related component. */
  fromEarnings: number
  /** Portion from annuitised individual capital. */
  fromCapital: number
  /** Pension as a share of the final salary. */
  adequacy: number
  yearsToRetirement: number
}

export function replacementRate(serviceYears: number): number {
  if (serviceYears <= 0) return 0
  if (serviceYears < MODEL.fullServiceYears) {
    return MODEL.baseReplacement * (serviceYears / MODEL.fullServiceYears)
  }
  const extra = (serviceYears - MODEL.fullServiceYears) * MODEL.perExtraYear
  return Math.min(MODEL.maxReplacement, MODEL.baseReplacement + extra)
}

export function projectScenario(input: ScenarioInput): ScenarioResult {
  const yearsToRetirement = Math.max(0, input.retirementAge - input.currentAge)
  const totalServiceYears = input.yearsContributed + yearsToRetirement

  // Salary compounds at the expected growth rate until retirement.
  const finalSalary = input.monthlySalary * Math.pow(1 + input.salaryGrowth, yearsToRetirement)

  // Career-average earnings, indexed forward — the base for the earnings component.
  const averageIndexedSalary = averageIndexed(
    input.monthlySalary,
    input.salaryGrowth,
    yearsToRetirement,
  )

  const rate = replacementRate(totalServiceYears)
  const fromEarnings = averageIndexedSalary * rate

  // Individual capital: existing balance grows with indexation, and each future
  // year adds accrual on that year's salary plus any voluntary top-up.
  let capital = input.existingCapital * Math.pow(1 + MODEL.indexation, yearsToRetirement)
  for (let y = 0; y < yearsToRetirement; y++) {
    const salaryThatYear = input.monthlySalary * Math.pow(1 + input.salaryGrowth, y)
    const annualAccrual = (salaryThatYear * MODEL.accrualRate + input.additionalContribution) * 12
    // Each year's accrual is indexed for the remaining years to retirement.
    capital += annualAccrual * Math.pow(1 + MODEL.indexation, yearsToRetirement - y - 1)
  }

  const fromCapital = capital / (MODEL.payoutYears * 12)
  const monthlyPension = fromEarnings + fromCapital

  return {
    monthlyPension,
    replacementRate: rate,
    totalServiceYears,
    finalSalary,
    capitalAtRetirement: capital,
    fromEarnings,
    fromCapital,
    adequacy: finalSalary > 0 ? monthlyPension / finalSalary : 0,
    yearsToRetirement,
  }
}

/** Mean salary over the remaining career, expressed in retirement-year terms. */
function averageIndexed(salary: number, growth: number, years: number): number {
  if (years <= 0) return salary
  let total = 0
  for (let y = 0; y < years; y++) {
    total += salary * Math.pow(1 + growth, y)
  }
  return total / years
}

export interface ForecastPoint {
  age: number
  year: number
  /** Monthly pension if the citizen retired at this age, current behaviour. */
  current: number
  /** Same, under the optimised scenario. */
  optimised: number
  /** Lower/upper bounds of the illustrative uncertainty band. */
  bandLow: number
  bandHigh: number
  isProjection: boolean
}

/**
 * Pension entitlement as a function of retirement age. The band widens with
 * distance from today — the further out the estimate, the less certain it is,
 * and the chart says so rather than implying false precision.
 */
export function buildForecast(
  base: ScenarioInput,
  optimised: ScenarioInput,
  fromAge: number,
  toAge: number,
  calendarYearNow: number,
): ForecastPoint[] {
  const points: ForecastPoint[] = []
  for (let age = fromAge; age <= toAge; age++) {
    const cur = projectScenario({ ...base, retirementAge: age })
    const opt = projectScenario({ ...optimised, retirementAge: age })
    const horizon = Math.max(0, age - base.currentAge)
    // Uncertainty grows ~1.4% per year out, capped so the band stays readable.
    const spread = Math.min(0.28, horizon * 0.014)
    points.push({
      age,
      year: calendarYearNow + (age - base.currentAge),
      current: cur.monthlyPension,
      optimised: opt.monthlyPension,
      bandLow: cur.monthlyPension * (1 - spread),
      bandHigh: cur.monthlyPension * (1 + spread),
      isProjection: age > base.currentAge,
    })
  }
  return points
}

/* ============================================================================
   PENSION READINESS
   ----------------------------------------------------------------------------
   A planning aid, not an assessment of the person. It measures the completeness
   of a contribution record and the runway left to act — both things a citizen
   can still influence. It is never a credit score, never shared with third
   parties, and never gates access to anything.
   ========================================================================= */

export interface ReadinessFactor {
  id: string
  label: string
  score: number
  max: number
  /** Plain-language reading of this factor. */
  detail: string
}

export interface Readiness {
  total: number
  band: { label: string; tone: 'accent' | 'primary' | 'warning' }
  factors: ReadinessFactor[]
}

export function computeReadiness(args: {
  yearsContributed: number
  yearsToRetirement: number
  gapMonths: number
  totalRecordedMonths: number
  adequacy: number
}): Readiness {
  const { yearsContributed, yearsToRetirement, gapMonths, totalRecordedMonths, adequacy } = args

  // 1. Contribution history — progress toward the qualifying service period.
  const historyScore = clamp(yearsContributed / MODEL.fullServiceYears, 0, 1) * 30

  // 2. Runway — years left in which changes can still compound.
  const runwayScore = clamp(yearsToRetirement / 20, 0, 1) * 20

  // 3. Consistency — share of the record free of contribution gaps.
  const consistency = totalRecordedMonths > 0 ? 1 - gapMonths / totalRecordedMonths : 0
  const consistencyScore = clamp(consistency, 0, 1) * 25

  // 4. Projected adequacy against the benchmark replacement share.
  const adequacyScore = clamp(adequacy / MODEL.adequacyTarget, 0, 1) * 25

  const total = Math.round(historyScore + runwayScore + consistencyScore + adequacyScore)

  return {
    total,
    band: band(total),
    factors: [
      {
        id: 'history',
        label: 'Contribution history',
        score: round1(historyScore),
        max: 30,
        detail: `${yearsContributed} of ${MODEL.fullServiceYears} qualifying years recorded.`,
      },
      {
        id: 'runway',
        label: 'Years remaining',
        score: round1(runwayScore),
        max: 20,
        detail:
          yearsToRetirement > 0
            ? `${yearsToRetirement} years before your selected retirement age — time in which changes still compound.`
            : 'You have reached your selected retirement age.',
      },
      {
        id: 'consistency',
        label: 'Contribution consistency',
        score: round1(consistencyScore),
        max: 25,
        detail:
          gapMonths > 0
            ? `${gapMonths} months without recorded contributions across your record.`
            : 'No gaps found in your recorded contribution history.',
      },
      {
        id: 'adequacy',
        label: 'Projected adequacy',
        score: round1(adequacyScore),
        max: 25,
        detail: `Projected pension replaces ${Math.round(adequacy * 100)}% of your expected final salary (benchmark ${Math.round(
          MODEL.adequacyTarget * 100,
        )}%).`,
      },
    ],
  }
}

/**
 * Bands are deliberately non-punitive. The lowest band is "Getting started",
 * never "Poor" — the score describes a record's completeness, not a person's worth.
 */
function band(total: number): Readiness['band'] {
  if (total >= 80) return { label: 'Well prepared', tone: 'accent' }
  if (total >= 60) return { label: 'On track', tone: 'accent' }
  if (total >= 40) return { label: 'Building up', tone: 'primary' }
  return { label: 'Getting started', tone: 'warning' }
}

const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n))
const round1 = (n: number) => Math.round(n * 10) / 10
