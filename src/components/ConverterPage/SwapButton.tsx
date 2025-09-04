import React from 'react';
import styles from '../../styles/Button.module.scss';

type SwapButtonProps = {
  onSwap: () => void 
};

const SwapButton = ({ onSwap }: SwapButtonProps) => {
  return (
    <button className={styles.swapBtn} onClick={onSwap} aria-label="Swap currencies">
      ⇄
    </button>
  );
};

export default React.memo(SwapButton);
