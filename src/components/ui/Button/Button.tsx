import clsx from "clsx";
import styles from './Button.module.scss'
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    className: string;
    children: React.ReactNode;
    variant?: 'icon'
}

const Button = ({children, className, variant, ...props}: ButtonProps) => {
    return (
        <button {...props} className={clsx(styles.button, className, variant === 'icon' ? styles.icon : '')}>
            {children}
        </button>
    )
}
export default Button