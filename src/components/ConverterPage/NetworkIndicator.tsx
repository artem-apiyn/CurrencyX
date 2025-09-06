import { format } from 'date-fns';
import { useNetwork } from '../../hooks/useNetwork';
import styles from '@/styles/Converter.module.scss';
import clsx from 'clsx';
import { ClockIcon, OfflineIcon, OnlineIcon } from '@/assets/icons';

type NetworkIndicatorProps = {
  lastUpdated?: number | null;
  offlineMessage?: string;
};

const NetworkIndicator = ({ lastUpdated }: NetworkIndicatorProps) => {
  const online = useNetwork();
  return (
    <>
      {online ? (
        <div className={styles.network}>
          <div className={clsx(styles.online, styles.networkIndicator)}>
            <OnlineIcon />
            <span>Online</span>  
          </div> 
          {lastUpdated ? (
            <div className={styles.clock}>
              <div className={styles.clockIcon}>
                <ClockIcon />
              </div>
              <span className={styles.updated}>
                Last updated: {format(new Date(lastUpdated), 'Pp')}
              </span>
            </div>
            ) : null}
        </div>
      ) : (
        <div className={styles.network}>
          <div className={clsx(styles.offline, styles.networkIndicator)}>
            <OfflineIcon />
            <span>Offline</span>
          </div>
          {lastUpdated ? (
            <div className={styles.clock}>
              <div className={styles.clockIcon}>
                <ClockIcon />
              </div>
              <span className={styles.updated}>
                Using cached rates from {format(new Date(lastUpdated), 'Pp')}
              </span> 
            </div>
            ): null}
        </div>
      )}
    </>
  );
};

export default NetworkIndicator;
