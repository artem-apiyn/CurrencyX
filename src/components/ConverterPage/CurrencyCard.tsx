import React from 'react';
import styles from '../../pages/ConverterPage/Converter.module.scss';

type CurrencyCardProps = {
  code: string;
  name: string
  onOpen: () => void;
};

const CurrencyCard = ({ code, onOpen, name }: CurrencyCardProps) => {
  return (
    <button className={styles.currencyCard} onClick={onOpen} type="button" aria-haspopup="dialog">
      <div className={styles.currencyCode}>{code}</div>
      <div className={styles.currencyName}>{name}</div>
    </button>
  );
};

export default React.memo(CurrencyCard);
