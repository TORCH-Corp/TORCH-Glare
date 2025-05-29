import React from 'react'
import { Toaster as ToasterComponent, toast } from 'react-hot-toast'


const Toaster = ({
    position = 'top-left',
    reverseOrder = false,
    gutter = 8,
    containerClassName = '',
    containerStyle = {},
    toastOptions = {},
    ...props }: React.ComponentPropsWithoutRef<typeof ToasterComponent>) => {
    return (
        <ToasterComponent
            position={position}
            reverseOrder={reverseOrder}
            gutter={gutter}
            containerClassName={containerClassName}
            containerStyle={containerStyle}
            {...props}
            toastOptions={{
                // Define default options
                className: '',
                duration: 8000,
                removeDelay: 1000,
                style: {
                    background: 'var(--background-presentation-state-information-secondary)',
                    color: 'var(--content-presentation-global-primary)',
                    borderRadius: '16px',
                },

                // Default options for specific types
                success: {
                    duration: 3000,
                    style: {
                        background: 'var(--background-presentation-state-success-secondary)',
                        color: 'var(--content-presentation-global-primary)',
                        borderRadius: '16px',
                    },
                    iconTheme: {
                        primary: 'var(--background-presentation-state-success-primary)',
                        secondary: 'var(--background-presentation-state-success-secondary)',
                    },
                },
                error: {
                    duration: 5000,
                    style: {
                        background: 'var(--background-presentation-state-negative-secondary)',
                        color: 'var(--content-presentation-global-primary)',
                        borderRadius: '16px',
                    },
                    iconTheme: {
                        primary: 'var(--background-presentation-state-negative-primary)',
                        secondary: 'var(--background-presentation-state-negative-secondary)',
                    },
                },
                loading: {
                    duration: 4000,
                    style: {
                        background: 'var(--background-presentation-state-warning-secondary)',
                        color: 'var(--content-presentation-global-primary)',
                        borderRadius: '16px',
                    },
                    iconTheme: {
                        primary: 'var(--background-presentation-state-warning-primary)',
                        secondary: 'var(--background-presentation-state-warning-secondary)',
                    },
                },
                blank: {
                    duration: 4000,
                    style: {
                        background: 'var(--background-presentation-state-information-secondary)',
                        color: 'var(--content-presentation-global-primary)',
                        borderRadius: '16px',
                    },
                    iconTheme: {
                        primary: 'var(--background-presentation-state-information-primary)',
                        secondary: 'var(--background-presentation-state-information-secondary)',
                    },
                },
                ...toastOptions,
            }}
        />
    )
}

export { Toaster, toast }