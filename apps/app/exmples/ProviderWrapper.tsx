'use client'
import { ThemeProvider } from '@/providers/ThemeProvider'
import React from 'react'

export default function ProviderWrapper({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider defaultTheme='default' >
            {children}
        </ThemeProvider>
    )
}
