export function computeRate(rates: Record<string, number> | null, base: string | null, from: string, to: string) {
  if (!rates || !base) return undefined;
  if (from === to) return 1;
  const rateBaseToFrom = from === base ? 1 : rates[from];
  const rateBaseToTo = to === base ? 1 : rates[to];
  if (rateBaseToFrom === undefined || rateBaseToTo === undefined) return undefined;
  return rateBaseToTo / rateBaseToFrom;
}