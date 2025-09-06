import React from 'react';
import styles from '@/styles/Converter.module.scss'
import { Input } from '../ui';

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
      <label className={styles.label}>Amount</label>
      <Input className={styles.input} type="text" value={value} onChange={handle} inputMode="decimal" />
    </div>
  );
};

export default AmountInput;
