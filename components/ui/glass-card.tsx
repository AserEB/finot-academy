'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface GlassCardProps extends HTMLMotionProps<'div'> {
    variant?: 'default' | 'glow' | 'interactive' | 'outline'
    children: React.ReactNode
    className?: string
    noPadding?: boolean
}

export const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
    (
        {
            variant = 'default',
            children,
            className,
            noPadding = false,
            ...props
        },
        ref
    ) => {
        const variantStyles = {
            default:
                'bg-[#000E23]/75 backdrop-blur-md border border-[#00EBD4]/15 shadow-xl',
            glow:
                'bg-[#000E23]/85 backdrop-blur-lg border border-[#FE0E33]/40 shadow-[0_0_25px_rgba(254,14,51,0.15)] hover:border-[#FE0E33]/70 hover:shadow-[0_0_35px_rgba(254,14,51,0.25)]',
            interactive:
                'bg-[#000E23]/80 backdrop-blur-md border border-[#00EBD4]/20 hover:border-[#00EBD4]/60 hover:shadow-[0_0_30px_rgba(0,235,212,0.2)] hover:-translate-y-1 transition-all duration-300 cursor-pointer',
            outline:
                'bg-transparent backdrop-blur-sm border border-[#FDFFFC]/15 hover:border-[#00EBD4]/40',
        }

        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className={cn(
                    'rounded-2xl text-[#FDFFFC] overflow-hidden relative',
                    noPadding ? 'p-0' : 'p-6',
                    variantStyles[variant],
                    className
                )}
                {...props}
            >
                {children}
            </motion.div>
        )
    }
)

GlassCard.displayName = 'GlassCard'