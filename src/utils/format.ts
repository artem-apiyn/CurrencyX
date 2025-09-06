export function formatCurrency(value: number, currency: string, minimumFractionDigits = 2) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits: 6,
    }).format(value);
  } catch {
    return `${value.toFixed(minimumFractionDigits)} ${currency}`;
  }
}
