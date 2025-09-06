import AmountInput from "./AmountInput"
import CurrencyCard from "./CurrencyCard"
import SwapButton from "./SwapButton"
import styles from '@/styles/Converter.module.scss'

type LeftPanelProps = {
    amountStr: string;
    setAmountStr: (v: string) => void;
    from: string;
    to: string;
    onSwap: () => void;
    setOpenModalFor: (v: 'from' | 'to') => void
}

const LeftPanel = ({amountStr, setAmountStr, from, to, onSwap, setOpenModalFor}: LeftPanelProps) => {
    return (
        <div className={styles.leftPanel}>
            <AmountInput value={amountStr} onChange={setAmountStr} />
            <div className={styles.selectorRow}>
                <CurrencyCard label = 'From' code={from} onOpen={() => setOpenModalFor('from')} />
                <SwapButton onSwap={onSwap} />
                <CurrencyCard label = 'To' code={to} onOpen={() => setOpenModalFor('to')} />                        
            </div>
            
        </div>
    )
}
export default LeftPanel