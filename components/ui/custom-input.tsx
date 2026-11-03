'use client'

import React, { useState } from 'react'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    isPassword?: boolean
}

export const CustomInput = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type = 'text',
            label,
            error,
            helperText,
            leftIcon,
            rightIcon,
            isPassword = false,
            disabled,
            id,
            ...props
        },
        ref
    ) => {
        const [showPassword, setShowPassword] = useState(false)
        const inputId = id || React.useId()

        const inputType = isPassword ? (showPassword ? 'text' : 'password') : type

        return (
            <div className="w-full flex flex-col gap-1.5 text-left">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-xs font-medium text-[#FDFFFC]/80 tracking-wide flex items-center justify-between"
                    >
                        <span>{label}</span>
                    </label>
                )}

                <div className="relative flex items-center w-full">
                    {leftIcon && (
                        <div className="absolute left-3.5 text-[#00EBD4]/70 pointer-events-none flex items-center justify-center">
                            {leftIcon}
                        </div>
                    )}

                    <input
                        id={inputId}
                        type={inputType}
                        ref={ref}
                        disabled={disabled}
                        className={cn(
                            'w-full bg-[#000E23]/80 border text-[#FDFFFC] text-sm rounded-xl px-4 py-3 outline-none transition-all duration-300 placeholder:text-gray-500',
                            'backdrop-blur-md',
                            leftIcon ? 'pl-10' : 'pl-4',
                            rightIcon || isPassword ? 'pr-11' : 'pr-4',
                            error
                                ? 'border-[#FE0E33] focus:ring-2 focus:ring-[#FE0E33]/40 shadow-[0_0_10px_rgba(254,14,51,0.2)]'
                                : 'border-[#00EBD4]/20 focus:border-[#00EBD4] focus:ring-2 focus:ring-[#00EBD4]/30 focus:shadow-[0_0_15px_rgba(0,235,212,0.15)]',
                            disabled && 'opacity-50 cursor-not-allowed bg-gray-900/50',
                            className
                        )}
                        {...props}
                    />

                    {isPassword ? (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            tabIndex={-1}
                            className="absolute right-3.5 text-gray-400 hover:text-[#00EBD4] transition-colors p-1"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    ) : (
                        rightIcon && (
                            <div className="absolute right-3.5 text-gray-400 pointer-events-none flex items-center justify-center">
                                {rightIcon}
                            </div>
                        )
                    )}
                </div>

                {error ? (
                    <p className="text-xs text-[#FE0E33] flex items-center gap-1 mt-0.5 animate-in fade-in slide-in-from-top-1 duration-200">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>{error}</span>
                    </p>
                ) : helperText ? (
                    <p className="text-xs text-gray-400 mt-0.5">{helperText}</p>
                ) : null}
            </div>
        )
    }
)

CustomInput.displayName = 'CustomInput'