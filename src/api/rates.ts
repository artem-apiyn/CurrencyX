import { RatesResponse } from '@/utils/types';

export async function fetchRatesVatComply(): Promise<RatesResponse> {
  const res = await fetch(process.env.REACT_APP_CONVERTER_API_URL || 'https://api.vatcomply.com/rates');
  if (!res.ok) {
    throw new Error(`Rates API failed: ${res.status}`);
  }
  return res.json();
}
