export interface RatesResponse {
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface RatesCache {
  base: string;
  rates: Record<string, number>;
  timestamp: number;
}