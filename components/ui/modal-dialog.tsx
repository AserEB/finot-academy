'use client'

import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalDialogProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    description?: string
    children: React.ReactNode
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'
    className?: string
}

export const ModalDialog: React.FC<ModalDialogProps> = ({
    isOpen,
    onClose,
    title,
    description,
    children,
    maxWidth = 'lg',
    className,
}) => {
    // Lock background scroll when modal is active
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    // Close modal on Escape key press
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [onClose])

    const maxWidthClasses = {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '4xl': 'max-w-4xl',
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
                    {/* Backdrop Blur Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-[#000E23]/80 backdrop-blur-md transition-opacity"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={cn(
                            'relative w-full bg-[#000E23] border border-[#00EBD4]/30 rounded-2xl shadow-[0_0_40px_rgba(0,235,212,0.15)] z-10 overflow-hidden text-[#FDFFFC]',
                            maxWidthClasses[maxWidth],
                            className
                        )}
                    >
                        {/* Modal Header */}
                        {(title || description) && (
                            <div className="flex items-start justify-between p-6 border-b border-[#00EBD4]/15 bg-white/5">
                                <div>
                                    {title && (
                                        <h3 className="text-xl font-bold text-[#FDFFFC] tracking-wide">
                                            {title}
                                        </h3>
                                    )}
                                    {description && (
                                        <p className="text-xs text-[#FDFFFC]/70 mt-1">
                                            {description}
                                        </p>
                                    )}
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-1.5 rounded-lg text-gray-400 hover:text-[#FE0E33] hover:bg-white/10 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                        {!title && !description && (
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-20 p-1.5 rounded-lg text-gray-400 hover:text-[#FE0E33] hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}

                        {/* Modal Body */}
                        <div className="p-6">{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}