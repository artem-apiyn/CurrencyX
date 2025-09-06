import React from 'react';
import styles from '@/styles/Converter.module.scss'
import currencies from '@/assets/currencies.json';
import { Button } from '../ui';

type CurrencyCardProps = {
  code: string;
  onOpen: () => void;
  label: string
};

const CurrencyCard = ({ code, onOpen, label }: CurrencyCardProps) => {
  const currency = React.useMemo(
    () => currencies.find(c => c.code === code),
    [code]
  );
  return (
    <div className={styles.currencyCard}>
      <label className={styles.label}>{label}</label>

      <Button className={styles.currencyCardBtn} onClick={onOpen} type="button" aria-haspopup="dialog">
        <div className={styles.codeWithSymbol}>
          <div className={styles.symbol}>{currency?.symbol}</div>
          <div className={styles.currencyCodeWithName}>
            <div className={styles.currencyCode}>{code}</div>
            <div className={styles.currencyName}>{currency?.name}</div>
        
          </div>
        </div>
      </Button>

    </div>
  );
};

export default CurrencyCard;
