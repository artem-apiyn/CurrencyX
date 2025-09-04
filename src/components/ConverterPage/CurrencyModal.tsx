import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../styles/Modal.module.scss';

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

const ModalRoot = ({ children }: ModalRootProps) => {
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
  const list = Object.keys(rates || {}).sort();
  const filtered = list.filter((c) => c.toLowerCase().includes(query.trim().toLowerCase()));
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (open) {
      setQuery('');
      setHighlight(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlight((h) => Math.min(h + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlight((h) => Math.max(h - 1, 0));
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        const code = filtered[highlight];
        if (code) {
          onSelect(code);
          onClose();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, filtered, highlight, onClose, onSelect]);

  if (!open) return null;

  return (
    <ModalRoot>
      <div className={styles.backdrop} onMouseDown={onClose} role="dialog" aria-modal="true">
        <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
          <div className={styles.header}>
            <h3>Select currency</h3>
            <button onClick={onClose} aria-label="Close">✕</button>
          </div>
          <input ref={inputRef} className={styles.search} value={query} onChange={(e) => { setQuery(e.target.value); setHighlight(0); }} placeholder="Search currency" />
          <div className={styles.list} ref={listRef}>
            {filtered.map((code, idx) => {
              const name = 'asdasdasd';
              const active = selected === code;
              const hl = idx === highlight;
              return (
                <div key={code} className={`${styles.option} ${active ? styles.active : ''} ${hl ? styles.highlight : ''}`} onClick={() => { onSelect(code); onClose(); }}>
                  <div className={styles.optLeft}>
                    <div className={styles.optCode}>{code}</div>
                    <div className={styles.optName}>{name}</div>
                  </div>
                  {active ? <div className={styles.check}>✓</div> : null}
                </div>
              );
            })}
            {filtered.length === 0 && <div className={styles.empty}>No currencies</div>}
          </div>
        </div>
      </div>
    </ModalRoot>
  );
};

export default CurrencyModal;
