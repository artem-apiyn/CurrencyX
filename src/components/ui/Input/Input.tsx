import clsx from "clsx";
import styles from './Input.module.scss'
import { InputHTMLAttributes, forwardRef  } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  className?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return <input {...props} ref={ref} className={clsx(styles.input, className)} />;
});

export default Input;