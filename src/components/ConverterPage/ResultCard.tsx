import React, { useEffect } from 'react';
import currencies from '@/assets/currencies.json'
import styles from '@/styles/Result.module.scss';

type ResultCardProps = {
  amount: number;
  rate?: number | undefined;
  from: string;
  to: string;
};

const ResultCard = ({ amount, rate, from, to }: ResultCardProps) => {

  useEffect(() => {
    console.log(to)
  }, [to])

  if (!rate) {
    return (
      <>
        <div className={styles.header}>Conversion result</div>
        <div className={styles.empty}>Conversion not available</div>
      </>
    );
  }

  const converted = amount * rate;
  const exchangeText = `1 ${from} = ${rate.toFixed(6)} ${to}`;
  const inverse = 1 / rate;
  const toSymbol = currencies.find((item) => item.code === to)?.symbol

  return (
    <>
      <div className={styles.header}>Conversion result</div>
      
      <div className={styles.amount}>
        <div className={styles.amountLarge}>{toSymbol}{converted.toFixed(6)}</div>
        <div className={styles.small}>{`${amount} ${from} = `}</div>
      </div>

      <div className={styles.break} />

      <div className={styles.details}>
        <div className={styles.infoRow}>
          <div className={styles.rate}>Exchange Rate</div>
          <div>{exchangeText}</div>
        </div>
        <div className={styles.infoRow}>
          <div className={styles.rate}>Inverse Rate</div>
          <div>{`1 ${to} = ${inverse.toFixed(6)} ${from}`}</div>
        </div>
      </div>

      <div className={styles.break} />

      <div className={styles.information}>Rates are for informational purposes only and may not reflect real-time market rates</div>
    </> 
  );
};

export default React.memo(ResultCard);