import { ReactNode } from 'react';

interface Props {
    href?: string;
    children?: ReactNode;
    className?: string;
}

export default function TextLink({ href = '#', children, className = '' }: Props) {
    return (
        <a href={href} className={`text-blue-600 hover:underline ${className}`}>
            {children}
        </a>
    );
}
