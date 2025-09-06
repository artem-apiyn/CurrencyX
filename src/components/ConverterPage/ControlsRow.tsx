import styles from '@/styles/Converter.module.scss'
import RefreshButton from './RefreshButton';
import NetworkIndicator from './NetworkIndicator';

type ControlsRow = {
    onRefresh: () => void;
    lastUpdated?: number | null;
    disabled: boolean
}

const ControlsRow = ({onRefresh, lastUpdated, disabled}: ControlsRow) => {
    return (
        <div className={styles.indicator}>
            <NetworkIndicator lastUpdated={lastUpdated} />
            <RefreshButton onRefresh={onRefresh} disabled={disabled} />
        </div>
    )
}
export default ControlsRow