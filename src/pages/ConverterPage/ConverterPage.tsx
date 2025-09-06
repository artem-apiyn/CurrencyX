import { useCallback, useEffect, useMemo, useState } from "react";
import styles from '../../styles/Converter.module.scss'
import { loadSettings, saveSettings } from "@/utils/storage";
import { useDebounce } from "@/hooks/useDebounce";
import { useRates } from "@/hooks/useRates";
import { CurrencyModal, AmountInput, ControlsRow, CurrencyCard, ResultCard, SwapButton, LeftPanel } from "@/components/ConverterPage";
import { computeRate } from "@/utils/computeRate";

const DEFAULT_FROM = 'USD';
const DEFAULT_TO = 'EUR';

type Settings = {
  from: string;
  to: string;
  amount?: number;
};

const ConverterPage = () => {
    const { rates, base, lastUpdated, isLoading, error, refresh } = useRates();
    const settings = loadSettings<Settings>();
    const [from, setFrom] = useState<string>(settings?.from || DEFAULT_FROM);
    const [to, setTo] = useState<string>(settings?.to || DEFAULT_TO);
    const [amountStr, setAmountStr] = useState<string>(settings?.amount?.toString() || '1');

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

    const swap = useCallback(() => {
        setFrom((prev) => {
            const oldFrom = prev;
            setTo(oldFrom);
            return to;
        });
    }, [to]);

    return (
        <div className={styles.container}>
            <div className={styles.center}>

                <div className={styles.title}>
                    <h1>Currency converter</h1>
                    <p>Get real-time exchange rates</p>
                </div>

                <ControlsRow 
                onRefresh={() => refresh()} 
                lastUpdated={lastUpdated} 
                disabled={isLoading} 
                />

                <div className={styles.panelRow}>
                    <LeftPanel amountStr={amountStr} setAmountStr={setAmountStr} from = {from} to={to} onSwap={swap} setOpenModalFor={setOpenModalFor}/>
                    
                    <div className={styles.rightPanel}>
                        <ResultCard amount={amount} rate={rate} from={from} to={to} />
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