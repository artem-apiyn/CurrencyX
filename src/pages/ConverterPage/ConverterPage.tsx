import React, { useCallback, useEffect, useMemo, useState } from "react";
import styles from './Converter.module.scss'
import AmountInput from "@/components/ConverterPage/AmountInput";
import CurrencyCard from "@/components/ConverterPage/CurrencyCard";
import { loadSettings, saveSettings } from "@/utils/storage";
import { useDebounce } from "@/hooks/useDebounce";
import { useRates } from "@/hooks/useRates";
import SwapButton from "@/components/ConverterPage/SwapButton";
import CurrencyModal from "@/components/ConverterPage/CurrencyModal";
import ResultCard from "@/components/ConverterPage/ResultCard";
import NetworkIndicator from "@/components/ConverterPage/NetworkIncdicator";
import RefreshButton from "@/components/ConverterPage/RefreshButton";

const DEFAULT_FROM = 'USD';
const DEFAULT_TO = 'EUR';

function computeRate(rates: Record<string, number> | null, base: string | null, from: string, to: string) {
  if (!rates || !base) return undefined;
  if (from === to) return 1;
  const rateBaseToFrom = from === base ? 1 : rates[from];
  const rateBaseToTo = to === base ? 1 : rates[to];
  if (rateBaseToFrom === undefined || rateBaseToTo === undefined) return undefined;
  return rateBaseToTo / rateBaseToFrom;
}

const ConverterPage = () => {
    const { rates, base, lastUpdated, isLoading, error, refresh } = useRates();
    const settings = loadSettings();
    const [from, setFrom] = useState<string>(settings?.from || DEFAULT_FROM);
    const [to, setTo] = useState<string>(settings?.to || DEFAULT_TO);
    const [amountStr, setAmountStr] = useState<string>(settings?.amount || '1');

    const [openModalFor, setOpenModalFor] = useState<'from' | 'to' | null>(null);

    const debouncedAmountStr = useDebounce(amountStr, 250);
    const amount = useMemo(() => {
        const v = debouncedAmountStr.replace(',', '.');
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    }, [debouncedAmountStr]);

    const rate = useMemo(() => computeRate(rates, base, from, to), [rates, base, from, to]);

    useEffect(() => {
        saveSettings("converterSettings", { from, to, amount: amountStr });
    }, [from, to, amountStr]);

    const handleSelect = useCallback((code: string) => {
        if (openModalFor === 'from') setFrom(code);
        if (openModalFor === 'to') setTo(code);
    }, [openModalFor]);

    const swap = () => {
        setFrom((prev) => {
        const oldFrom = prev;
        setTo(oldFrom);
        return to;
        });
    };


    return (
        <div className={styles.container}>
            <div className={styles.center}>

                <div className={styles.title}>
                    <h1>Currency converter</h1>
                    <p>Get real-time exchange rates</p>
                </div>

                <div className={styles.controlsRow}>
                    <NetworkIndicator lastUpdated={lastUpdated} />
                    <RefreshButton onRefresh={() => refresh()} disabled={isLoading} />
                </div>

                <div className={styles.panelRow}>
                    <div className={styles.leftPanel}>
                        <AmountInput value={amountStr} onChange={setAmountStr} />

                        <div className={styles.selectorRow}>
                            <CurrencyCard code={from} name={'sada'} onOpen={() => setOpenModalFor('from')} />
                            <SwapButton onSwap={swap} />
                            <CurrencyCard code={to} name={'adsda'} onOpen={() => setOpenModalFor('to')} />                        
                        </div>
                        
                    </div>
                    
                    <div className={styles.rightPanel}>
                        <ResultCard amount={amount} rate={rate} from={from} to={to} lastUpdated={lastUpdated} />
                    </div>
                    
                    </div>
                    {openModalFor && rates && (
                        <CurrencyModal open={!!openModalFor} onClose={() => setOpenModalFor(null)} rates={rates} selected={openModalFor === 'from' ? from : to} onSelect={handleSelect} />
                    )}
                    {error ? <div className={styles.error}>{error}</div> : null}
            </div>
            
            
        </div>
    )
}
export default ConverterPage