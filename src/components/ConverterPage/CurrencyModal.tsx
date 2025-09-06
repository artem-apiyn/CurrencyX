import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '@/styles/Modal.module.scss';
import stylesCard from '@/styles/Converter.module.scss'
import currencies from '@/assets/currencies.json';
import clsx from 'clsx';
import { Button, Input } from '../ui';
import { CheckIcon, CloseIcon, LoopIcon } from '@/assets/icons';

type CurrencyModalProps = {
  open: boolean;
  onClose: () => void;
  rates: Record<string, number>;
  selected?: string;
  onSelect: (code: string) => void;
};

type ModalRootProps = {
  children: React.ReactNode;
};

const Modal = ({ children }: ModalRootProps) => {
  const el = useMemo(() => {
    let node = document.getElementById('modal-root');
    if (!node) {
      node = document.createElement('div');
      node.id = 'modal-root';
      document.body.appendChild(node);
    }
    return node;
  }, []);

  return createPortal(children, el);
};

const CurrencyModal = ({ open, onClose, rates, selected, onSelect }: CurrencyModalProps) => {
  const [query, setQuery] = useState('');
  const [highlight, setHighlight] = useState(0);
  
  
  const list = useMemo(() => Object.keys(rates || {}).sort(), [rates]);
  const filtered = useMemo(
    () => list.filter(c => c.toLowerCase().includes(query.trim().toLowerCase())),
    [list, query]
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useLayoutEffect(() => {
    if (open) {
      setQuery('');
      setHighlight(0);
      inputRef.current?.focus();
      
    }
  }, [open]);
  
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;

      switch (e.key) {
        case 'Escape': onClose(); break;
        case 'ArrowDown':
          e.preventDefault();
          setHighlight(h => Math.min(h + 1, filtered.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setHighlight(h => Math.max(h - 1, 0));
          break;
        case 'Enter': {
          e.preventDefault();
          const code = filtered[highlight];
          if (code) { onSelect(code); onClose(); }
          break;
        }
      }
    },
    [open, filtered, highlight, onClose, onSelect]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;


  return (
    <Modal>
      <div className={styles.backdrop} onMouseDown={onClose} role="dialog" aria-modal="true">
        <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
          
          <div className={styles.header}>
            <h3 className={styles.title}>Select currency</h3>
            <Button className={styles.close} variant='icon' onClick={onClose} aria-label="Close">
              <CloseIcon />
            </Button>
          </div>

          <p className={styles.description}>Choose a currency from the list below or use the search bar to find a specific currency.</p>
          
          <label className={clsx(stylesCard.input, styles.inputWrapper)}>
            <div className={styles.icon}>
              <LoopIcon />
            </div>
            <Input ref={inputRef} className={styles.input} value={query} onChange={(e) => { setQuery(e.target.value); setHighlight(0); }} placeholder="Input" />

          </label>
          <div className={styles.list} ref={listRef}>
            {filtered.map((code) => {
              const currency = currencies.find(c => c.code === code);
              const name = currency?.name;
              const active = selected === code;
              return (
                <Button 
                  key={code} 
                  className={clsx(stylesCard.currencyCardBtn, styles.option, active ? styles.active : '')} 
                  onClick={() => { onSelect(code); onClose(); }}
                >
                  <div className={stylesCard.codeWithSymbol}>
                    <div className={stylesCard.symbol}>{currency?.symbol}</div>
                  
                    <div className={stylesCard.currencyCodeWithName}>
                      <div className={stylesCard.currencyCode}>{code}</div>
                      <div className={stylesCard.currencyName}>{name}</div>
                    </div>
                  </div>
                  {active ? (
                    <div className={styles.check}>
                      <CheckIcon />
                    </div>
                  ) : null}
                </Button>
                
              );
            })}
            {filtered.length === 0 && <div className={styles.empty}>No currencies</div>}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CurrencyModal;
