import React from 'react';
import { formatCurrency } from '../../utils/format';
import styles from '../../styles/Result.module.scss';

type ResultCardProps = {
  amount: number;
  rate?: number | undefined;
  from: string;
  to: string;
  lastUpdated?: number | null;
};

const ResultCard = ({ amount, rate, from, to, lastUpdated }: ResultCardProps) => {
  if (!rate) {
    return (
      <div className={styles.resultCard}>
        <div className={styles.header}>Conversion result</div>
        <div className={styles.empty}>Conversion not available</div>
      </div>
    );
  }

  const converted = amount * rate;
  const exchangeText = `1 ${from} = ${rate.toFixed(6)} ${to}`;
  const inverse = 1 / rate;

  return (
    <div className={styles.resultCard}>
      <div className={styles.header}>Conversion result</div>
      <div className={styles.amountLarge}>{formatCurrency(converted, to)}</div>
      <div className={styles.small}>{`${amount} ${from} = ${converted.toFixed(6)} ${to}`}</div>

      <div className={styles.break} />

      <div className={styles.infoRow}>
        <div>Exchange Rate</div>
        <div>{exchangeText}</div>
      </div>
      <div className={styles.infoRow}>
        <div>Inverse Rate</div>
        <div>{`1 ${to} = ${inverse.toFixed(6)} ${from}`}</div>
      </div>

      {lastUpdated ? <div className={styles.note}>Rates updated: {new Date(lastUpdated).toLocaleString()}</div> : null}
    </div>
  );
};

export default React.memo(ResultCard);