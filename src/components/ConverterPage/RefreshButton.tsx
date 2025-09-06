import { useCallback, useEffect, useRef, useState } from 'react';
import styles from '@/styles/Button.module.scss';
import { Button } from '../ui';
import React from 'react';

type RefreshButtonProps = { 
  onRefresh: () => Promise<void> | void; 
  disabled?: boolean 
};

const RefreshButton = ({ onRefresh, disabled }: RefreshButtonProps) => {
  const [busy, setBusy] = useState(false);
  const timeoutRef = useRef<number>();

  const handle = useCallback(async () => {
    if (busy || disabled) return;
    setBusy(true);
    try {
      await onRefresh();
    } finally {
      timeoutRef.current = window.setTimeout(() => setBusy(false), 600);
    }
  }, [busy, disabled, onRefresh]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  return (
    <Button className={styles.btn} onClick={handle} disabled={busy || disabled}>
      {busy ? 'Refreshing...' : 'Refresh rates'}
    </Button>
  );
};

export default React.memo(RefreshButton);