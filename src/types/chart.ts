export type Primitive = string | number | boolean | null

export type ChartDatum = Record<string, Primitive>

export interface ChartData {
  data: ChartDatum[]
  type?: 'line' | 'interval'
  xField?: string
  yField?: string
}


