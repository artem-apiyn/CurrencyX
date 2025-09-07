import { useEffect, useState, useRef } from 'react';
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

  const loadRef = useRef<(force?: boolean) => Promise<void>>();

  useEffect(() => {
    loadRef.current = async (force = false) => {
      const stale = !lastUpdated || Date.now() - lastUpdated > TTL;
      if (!force && !stale && rates) return;

      setLoading(true);
      try {
        const apiRes: RatesResponse = await fetchRatesVatComply();
        if (!apiRes?.rates) throw new Error('Invalid API response');

        const ts = Date.now();
        setRates(apiRes.rates);
        setBase(apiRes.base || 'EUR');
        setLastUpdated(ts);
        saveCache(CACHE_KEY, {
          base: apiRes.base || 'EUR',
          rates: apiRes.rates,
          timestamp: ts,
        });
        setError(null);
      } catch (e: unknown) {
        const errMsg = e instanceof Error ? e.message : String(e);
        const cache: RatesCache | null = loadCache<RatesCache>(CACHE_KEY);
        if (cache) {
          setRates(cache.rates);
          setBase(cache.base);
          setLastUpdated(cache.timestamp);
        } else {
          setError(`Failed to fetch rates and no cache available — ${errMsg}`);
        }
      } finally {
        setLoading(false);
      }
    };
  }, [lastUpdated, rates]);

  useEffect(() => {
    const cache = loadCache<RatesCache>(CACHE_KEY);
    if (cache) {
      setRates(cache.rates);
      setBase(cache.base);
      setLastUpdated(cache.timestamp);
    }

    loadRef.current?.();

    const onOnline = () => loadRef.current?.(true);
    window.addEventListener('online', onOnline);
    return () => window.removeEventListener('online', onOnline);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => loadRef.current?.(true), TTL);
    return () => clearInterval(interval);
  }, []);

  return {
    rates,
    base,
    lastUpdated,
    isLoading,
    error,
    refresh: () => loadRef.current?.(true),
  };
}
