import React, { useState } from 'react';
import styles from '../../styles/Button.module.scss';

type RefreshButtonProps = { 
  onRefresh: () => Promise<void> | void; 
  disabled?: boolean 
};

const RefreshButton = ({ onRefresh, disabled }: RefreshButtonProps) => {
  const [busy, setBusy] = useState(false);
  const handle = async () => {
    if (busy || disabled) return;
    setBusy(true);
    try {
      await onRefresh();
    } finally {
      setTimeout(() => setBusy(false), 600); 
    }
  };
  return (
    <button className={styles.btn} onClick={handle} disabled={busy || disabled}>
      {busy ? 'Refreshing...' : 'Refresh rates'}
    </button>
  );
};

export default RefreshButton;
