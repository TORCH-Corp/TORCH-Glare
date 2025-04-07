import { cn } from '../utils/cn';
import { cva } from 'class-variance-authority';
import React from 'react';

interface PopoverProps {
    children: React.ReactNode;
}

interface PopoverTriggerProps {
    children: React.ReactNode;
}

interface PopoverContentProps {
    variant?: 'SystemStyle' | 'PresentationStyle';
    overlayBlur?: boolean;
    children: React.ReactNode;
    role?: 'menu' | 'listbox';
    ariaLabel?: string;
}

export function Popover({ children }: PopoverProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const triggerRef = React.useRef<HTMLButtonElement>(null);
    const contentRef = React.useRef<HTMLUListElement>(null);

    // Close popover on Escape
    React.useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setIsOpen(false);
                triggerRef.current?.focus();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Focus first item when popover opens
    React.useEffect(() => {
        if (isOpen && contentRef.current) {
            const firstFocusable = contentRef.current.querySelector(
                '[role="menuitem"], [role="option"]'
            ) as HTMLElement | null;
            firstFocusable?.focus();
        }
    }, [isOpen]);

    return (
        <div className="relative">
            {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement, {
                        isOpen,
                        setIsOpen,
                        triggerRef,
                        contentRef,
                    });
                }
                return child;
            })}
        </div>
    );
}

export function PopoverTrigger({
    children,
    isOpen,
    setIsOpen,
    triggerRef,
}: PopoverTriggerProps & {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    triggerRef?: React.RefObject<HTMLButtonElement>;
}) {
    return (
        <button
            ref={triggerRef}
            popoverTarget="popup-1"
            aria-expanded={isOpen}
            aria-haspopup="true"
            onClick={() => setIsOpen?.(!isOpen)}
            className={cn(
                'focus:outline-none',
                'focus:ring-2 focus:ring-blue-500',
                'rounded-md p-2',
                'transition-colors',
                'hover:bg-gray-100'
            )}
        >
            {children}
        </button>
    );
}

export function PopoverContent({
    variant,
    overlayBlur,
    children,
    role = 'menu',
    ariaLabel = 'Popover',
    isOpen,
    setIsOpen,
    contentRef,
}: PopoverContentProps & {
    isOpen?: boolean;
    setIsOpen?: (open: boolean) => void;
    contentRef?: React.RefObject<HTMLUListElement>;
}) {
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!contentRef?.current) return;

        const items = Array.from(
            contentRef.current.querySelectorAll(
                '[role="menuitem"], [role="option"]'
            )
        ) as HTMLElement[];

        if (items.length === 0) return;

        const currentIndex = items.findIndex(
            (item) => item === document.activeElement
        );

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                items[(currentIndex + 1) % items.length]?.focus();
                break;
            case 'ArrowUp':
                e.preventDefault();
                items[(currentIndex - 1 + items.length) % items.length]?.focus();
                break;
            case 'Home':
                e.preventDefault();
                items[0]?.focus();
                break;
            case 'End':
                e.preventDefault();
                items[items.length - 1]?.focus();
                break;
            case 'Tab':
                if (!e.shiftKey && currentIndex === items.length - 1) {
                    setIsOpen?.(false);
                }
                break;
        }
    };

    return (
        <ul
            ref={contentRef}
            id="popup-1"
            popover="auto"
            role={role}
            aria-label={ariaLabel}
            onKeyDown={handleKeyDown}
            className={cn(
                popoverStyles({ variant, overlayBlur }),
                'focus:outline-none'
            )}
        >
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement, {
                        role: role === 'menu' ? 'menuitem' : 'option',
                        tabIndex: -1,
                        className: cn(
                            'focus:bg-gray-100',
                            'focus:outline-none',
                            'px-4 py-2',
                            'cursor-pointer',
                            'hover:bg-gray-50',
                            child.props.className
                        ),
                    });
                }
                return child;
            })}
        </ul>
    );
}

const popoverStyles = cva(
    [
        'p-1',
        'max-h-[200px]',
        'z-[1000]',
        'rounded-[8px]',
        'border',
        'min-w-[240px]',
        'outline-none',
        'overflow-auto',
        'data-[state=open]:animate-in',
        'data-[state=closed]:animate-out',
        'data-[state=closed]:fade-out-0',
        'data-[state=open]:fade-in-0',
        'scrollbar-hide',
        'overflow-x-hidden',
    ],
    {
        variants: {
            variant: {
                SystemStyle: [
                    'border-border-system-global-secondary',
                    'bg-background-system-body-primary',
                    'shadow-[0px_0px_18px_0px_rgba(0,0,0,0.75)]',
                ],
                PresentationStyle: [
                    'border-border-presentation-global-primary',
                    'bg-background-presentation-form-base',
                    'shadow-[0px_0px_10px_0px_rgba(0,0,0,0.4),0px_4px_4px_0px_rgba(0,0,0,0.2)]',
                ],
            },
            overlayBlur: {
                true: ['backdrop-blur-sm'],
            },
        },
        defaultVariants: {
            variant: 'SystemStyle',
        },
    }
);