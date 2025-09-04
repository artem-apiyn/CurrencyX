import React from 'react';
import { format } from 'date-fns';
import { useNetwork } from '../../hooks/useNetwork';
import styles from '../../pages/ConverterPage/Converter.module.scss'

type NetworkIndicatorProps = {
  lastUpdated?: number | null;
  offlineMessage?: string;
};

const NetworkIndicator = ({ lastUpdated }: NetworkIndicatorProps) => {
  const online = useNetwork();
  return (
    <div className={styles.networkIndicator}>
      {online ? (
        <div className={styles.online}>● Online {lastUpdated ? <span className={styles.updated}>Last: {format(new Date(lastUpdated), 'Pp')}</span> : null}</div>
      ) : (
        <div className={styles.offline}>● Offline {lastUpdated ? <span className={styles.updated}>Using cached rates from {format(new Date(lastUpdated), 'Pp')}</span> : null}</div>
      )}
    </div>
  );
};

export default NetworkIndicator;
