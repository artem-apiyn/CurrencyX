import styles from '@/styles/Button.module.scss';
import { Button } from '../ui';
import { SwapIcon } from '@/assets/icons';

type SwapButtonProps = {
  onSwap: () => void 
};

const SwapButton = ({ onSwap }: SwapButtonProps) => {
  return (
    <div className={styles.swap}> 
      <Button variant='icon' className={styles.swapBtn} onClick={onSwap} aria-label="Swap currencies">
        <SwapIcon />
      </Button>
    </div>
    
  );
};

export default SwapButton;
