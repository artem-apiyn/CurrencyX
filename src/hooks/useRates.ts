import { useEffect, useState, useCallback } from 'react';
import { fetchRatesVatComply } from '../api/rates';
import { loadCache, saveCache } from '../utils/storage';
import { RatesCache, RatesResponse } from '../utils/types';

const CACHE_KEY = 'rates_cache_v1';
const TTL = 5 * 60 * 1000; 

export function useRates() {
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [base, setBase] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (force = false) => {
    setLoading(true);
    try {
      const apiRes: RatesResponse = await fetchRatesVatComply();
      if (apiRes && apiRes.rates) {
        setRates(apiRes.rates);
        setBase(apiRes.base || 'EUR');
        const ts = Date.now();
        setLastUpdated(ts);
        saveCache(CACHE_KEY, { base: apiRes.base || 'EUR', rates: apiRes.rates, timestamp: ts });
        setError(null);
      } else {
        throw new Error('Invalid API response');
      }
    } catch (e: any) {
      const cache: RatesCache | null = loadCache<RatesCache>(CACHE_KEY);
      if (cache) {
        setRates(cache.rates);
        setBase(cache.base);
        setLastUpdated(cache.timestamp);
        setError('Using cached rates — failed to fetch new rates');
      } else {
        setError('Failed to fetch rates and no cache available');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cache = loadCache<RatesCache>(CACHE_KEY);
    if (cache) {
      setRates(cache.rates);
      setBase(cache.base);
      setLastUpdated(cache.timestamp);
    }
    load();
    const onOnline = () => load(true);
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, [load]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isCacheStale()) {
        load(true);
      }
    }, TTL);

    return () => clearInterval(interval);
  }, [load, lastUpdated]);

  const isCacheStale = () => {
    if (!lastUpdated) return true;
    return Date.now() - lastUpdated > TTL;
  };

  return {
    rates,
    base,
    lastUpdated,
    isLoading,
    error,
    refresh: () => load(true),
    isCacheStale,
  };
}
