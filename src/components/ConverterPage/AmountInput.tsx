import React from 'react';
import styles from '../../pages/ConverterPage/Converter.module.scss';

type AmountInputProps = {
  value: string;
  onChange: (v: string) => void;
};

const AmountInput = ({ value, onChange }: AmountInputProps) => {

  const handle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const cleaned = raw.replace(/[^\d.,]/g, '');
    onChange(cleaned);
  };

  return (
    <div className={styles.amountInput}>
      <p className={styles.label}>Amount</p>
      <input className={styles.input} type="text" value={value} onChange={handle} inputMode="decimal" />
    </div>
  );
};

export default React.memo(AmountInput);
