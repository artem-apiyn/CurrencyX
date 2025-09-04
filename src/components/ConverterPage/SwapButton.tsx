import React from 'react';

type SwapButtonProps = {
  onSwap: () => void 
};

const SwapButton = ({ onSwap }: SwapButtonProps) => {
  return (
    <button  onClick={onSwap} aria-label="Swap currencies">
      ⇄
    </button>
  );
};

export default React.memo(SwapButton);
