/**
 * DEMONSTRATION DATA — entirely fictional.
 *
 * The regional, demographic and financial series below were constructed for this
 * concept. They are proportioned to resemble published national statistics so
 * that chart shapes and scale behaviour can be judged honestly, but they are NOT
 * actual figures of the Pension Fund of the Republic of Uzbekistan and must not
 * be cited as such.
 */

export interface RegionDatum {
  id: string
  name: string
  /** Abbreviated label for the narrow cartogram tiles, where `name` truncates. */
  short: string
  /** Tile position in the schematic cartogram (not a geographic projection). */
  col: number
  row: number
  contributors: number
  pensioners: number
  averagePension: number
  /** Contributors per pensioner. */
  ratio: number
  /** Share of the local workforce contributing formally. */
  coverage: number
}

const region = (
  id: string,
  name: string,
  short: string,
  col: number,
  row: number,
  contributors: number,
  pensioners: number,
  averagePension: number,
  coverage: number,
): RegionDatum => ({
  id,
  name,
  short,
  col,
  row,
  contributors,
  pensioners,
  averagePension,
  ratio: Math.round((contributors / pensioners) * 100) / 100,
  coverage,
})

/**
 * Tile cartogram, not a map projection. Each region gets one equal tile placed to
 * echo its real position — Karakalpakstan west, the Fergana valley east,
 * Surkhandarya south. Equal tiles keep small regions readable and stop large,
 * sparsely populated areas from dominating the picture. Labelled as schematic in
 * the interface so it is never mistaken for a survey map.
 */
export const REGIONS: RegionDatum[] = [
  region('krk', 'Karakalpakstan', 'Karakalpak.', 1, 1, 268_000, 214_000, 1_402_000, 0.51),
  region('kho', 'Khorezm', 'Khorezm', 2, 1, 246_000, 196_000, 1_388_000, 0.49),
  region('nav', 'Navoiy', 'Navoiy', 3, 1, 198_000, 132_000, 1_712_000, 0.63),
  region('jiz', 'Jizzakh', 'Jizzakh', 4, 1, 187_000, 148_000, 1_431_000, 0.47),
  region('sir', 'Sirdaryo', 'Sirdaryo', 5, 1, 141_000, 118_000, 1_468_000, 0.52),
  region('tsr', 'Tashkent Region', 'Tashkent Reg.', 6, 1, 512_000, 421_000, 1_624_000, 0.58),
  region('nam', 'Namangan', 'Namangan', 7, 1, 384_000, 318_000, 1_396_000, 0.44),
  region('and', 'Andijan', 'Andijan', 8, 1, 402_000, 341_000, 1_412_000, 0.45),
  region('buk', 'Bukhara', 'Bukhara', 2, 2, 289_000, 231_000, 1_509_000, 0.54),
  region('sam', 'Samarkand', 'Samarkand', 4, 2, 498_000, 428_000, 1_441_000, 0.46),
  region('tsc', 'Tashkent City', 'Tashkent City', 6, 2, 894_000, 512_000, 2_104_000, 0.78),
  region('fer', 'Fergana', 'Fergana', 7, 2, 461_000, 402_000, 1_408_000, 0.45),
  region('qas', 'Kashkadarya', 'Kashkadarya', 3, 3, 421_000, 352_000, 1_398_000, 0.43),
  region('sur', 'Surkhandarya', 'Surkhand.', 4, 4, 338_000, 278_000, 1_372_000, 0.41),
]

export const NATIONAL = {
  activeContributors: REGIONS.reduce((s, r) => s + r.contributors, 0),
  pensioners: REGIONS.reduce((s, r) => s + r.pensioners, 0),
  averagePension: 1_562_000,
  /** Annual, in so'm. */
  contributionRevenue: 68_400_000_000_000,
  pensionExpenditure: 74_100_000_000_000,
  /** Contributors per pensioner, nationally. */
  supportRatio: 1.32,
  /** Year-on-year change, in percent. */
  deltas: {
    contributors: 3.1,
    pensioners: 2.4,
    averagePension: 11.6,
    revenue: 14.2,
    expenditure: 16.8,
    supportRatio: -1.8,
  },
} as const

export interface FlowDatum {
  year: number
  revenue: number
  expenditure: number
  isProjection: boolean
}

export const REVENUE_VS_EXPENDITURE: FlowDatum[] = [
  { year: 2019, revenue: 31_200_000_000_000, expenditure: 32_800_000_000_000, isProjection: false },
  { year: 2020, revenue: 34_900_000_000_000, expenditure: 38_100_000_000_000, isProjection: false },
  { year: 2021, revenue: 41_600_000_000_000, expenditure: 45_200_000_000_000, isProjection: false },
  { year: 2022, revenue: 48_300_000_000_000, expenditure: 52_900_000_000_000, isProjection: false },
  { year: 2023, revenue: 55_100_000_000_000, expenditure: 60_400_000_000_000, isProjection: false },
  { year: 2024, revenue: 61_200_000_000_000, expenditure: 66_800_000_000_000, isProjection: false },
  { year: 2025, revenue: 68_400_000_000_000, expenditure: 74_100_000_000_000, isProjection: false },
  { year: 2026, revenue: 76_100_000_000_000, expenditure: 83_400_000_000_000, isProjection: true },
  { year: 2027, revenue: 84_200_000_000_000, expenditure: 93_600_000_000_000, isProjection: true },
  { year: 2028, revenue: 92_800_000_000_000, expenditure: 104_900_000_000_000, isProjection: true },
  { year: 2029, revenue: 101_900_000_000_000, expenditure: 117_200_000_000_000, isProjection: true },
]

export interface CohortDatum {
  bracket: string
  contributors: number
  pensioners: number
}

export const AGE_STRUCTURE: CohortDatum[] = [
  { bracket: '18–24', contributors: 612_000, pensioners: 0 },
  { bracket: '25–34', contributors: 1_486_000, pensioners: 0 },
  { bracket: '35–44', contributors: 1_392_000, pensioners: 0 },
  { bracket: '45–54', contributors: 1_004_000, pensioners: 118_000 },
  { bracket: '55–64', contributors: 745_000, pensioners: 1_284_000 },
  { bracket: '65–74', contributors: 0, pensioners: 1_612_000 },
  { bracket: '75+', contributors: 0, pensioners: 1_077_000 },
]

export interface SupportRatioDatum {
  year: number
  ratio: number
  isProjection: boolean
}

export const SUPPORT_RATIO_TREND: SupportRatioDatum[] = [
  { year: 2019, ratio: 1.58, isProjection: false },
  { year: 2020, ratio: 1.53, isProjection: false },
  { year: 2021, ratio: 1.48, isProjection: false },
  { year: 2022, ratio: 1.43, isProjection: false },
  { year: 2023, ratio: 1.39, isProjection: false },
  { year: 2024, ratio: 1.35, isProjection: false },
  { year: 2025, ratio: 1.32, isProjection: false },
  { year: 2026, ratio: 1.29, isProjection: true },
  { year: 2027, ratio: 1.26, isProjection: true },
  { year: 2028, ratio: 1.23, isProjection: true },
  { year: 2029, ratio: 1.2, isProjection: true },
]

/** Where contribution revenue originates, by payer category. */
export const REVENUE_MIX = [
  { name: 'Large enterprise', value: 34.2 },
  { name: 'SME', value: 27.8 },
  { name: 'Budget organisations', value: 19.4 },
  { name: 'Self-employed', value: 11.3 },
  { name: 'Voluntary contributions', value: 7.3 },
]
