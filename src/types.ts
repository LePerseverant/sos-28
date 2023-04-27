export type Impact = "Low" | "Medium" | "High"

export type Category = "Weather" | "Terminal Disruption" | "Arb"

export interface SupplyEvent {
  key: string
  locationType: string
  applicability: string
  product: string
  startDate: Date | string
  endDate: Date | string
  duration: number | string
  impact: Impact
  category: Category
  comment: string
}
