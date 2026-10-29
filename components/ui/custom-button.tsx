'use client'

import React from 'react'
import { motion, HTMLMotionProps } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    children?: React.ReactNode
    fullWidth?: boolean
}

export const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'primary',
            size = 'md',
            isLoading = false,
            leftIcon,
            rightIcon,
            children,
            fullWidth = false,
            disabled,
            ...props
        },
        ref
    ) => {
        // Size variants mapping
        const sizeStyles = {
            sm: 'px-3 py-1.5 text-xs font-semibold rounded-md gap-1.5',
            md: 'px-5 py-2.5 text-sm font-semibold rounded-lg gap-2',
            lg: 'px-7 py-3.5 text-base font-bold rounded-xl gap-2.5',
        }

        // Color and visual style variants matching Finot Color Palette
        const variantStyles = {
            primary:
                'bg-[#FE0E33] text-[#FDFFFC] shadow-[0_0_15px_rgba(254,14,51,0.4)] hover:shadow-[0_0_25px_rgba(254,14,51,0.7)] hover:bg-[#e00c2c] border border-[#FE0E33]/30',
            secondary:
                'bg-[#00EBD4] text-[#000E23] shadow-[0_0_15px_rgba(0,235,212,0.4)] hover:shadow-[0_0_25px_rgba(0,235,212,0.7)] hover:bg-[#00d6c0] font-bold border border-[#00EBD4]/30',
            outline:
                'bg-transparent text-[#00EBD4] border border-[#00EBD4]/60 hover:bg-[#00EBD4]/10 hover:border-[#00EBD4] hover:shadow-[0_0_15px_rgba(0,235,212,0.3)]',
            ghost:
                'bg-transparent text-[#FDFFFC] hover:bg-white/10 hover:text-[#00EBD4]',
            danger:
                'bg-red-700 text-white hover:bg-red-800 shadow-[0_0_15px_rgba(185,28,28,0.4)]',
        }

        return (
            <motion.button
                ref={ref}
                whileTap={{ scale: disabled || isLoading ? 1 : 0.96 }}
                whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
                disabled={disabled || isLoading}
                className={cn(
                    'inline-flex items-center justify-center transition-all duration-300 outline-none focus:ring-2 focus:ring-[#00EBD4]/50 disabled:opacity-50 disabled:cursor-not-allowed select-none cursor-pointer',
                    sizeStyles[size],
                    variantStyles[variant],
                    fullWidth ? 'w-full' : '',
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-current mr-1" />
                ) : (
                    leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
                )}
                <span className="truncate">{children}</span>
                {!isLoading && rightIcon && (
                    <span className="inline-flex shrink-0">{rightIcon}</span>
                )}
            </motion.button>
        )
    }
)

CustomButton.displayName = 'CustomButton'