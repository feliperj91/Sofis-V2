import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={twMerge(
                clsx('bg-white rounded-lg border border-gray-200 shadow-sm', className)
            )}
            {...props}
        >
            {children}
        </div>
    );
};

const CardHeader = ({ className, children, ...props }) => (
    <div className={twMerge(clsx('px-6 py-4 border-b border-gray-200', className))} {...props}>
        {children}
    </div>
);

const CardTitle = ({ className, children, ...props }) => (
    <h3 className={twMerge(clsx('text-lg font-medium leading-6 text-gray-900', className))} {...props}>
        {children}
    </h3>
);

const CardContent = ({ className, children, ...props }) => (
    <div className={twMerge(clsx('p-6', className))} {...props}>
        {children}
    </div>
);

export { Card, CardHeader, CardTitle, CardContent };
