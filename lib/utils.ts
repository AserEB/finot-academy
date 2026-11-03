import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Phone Number Validation Rule (Must start with 251, 09, or 07)
export function isValidEthiopianPhone(phone: string): boolean {
    const cleaned = phone.trim().replace(/\s+/g, '')
    const phoneRegex = /^(2519\d{8}|2517\d{8}|09\d{8}|07\d{8})$/
    return phoneRegex.test(cleaned)
}

// File Size Limit Validation (Max 2MB for Receipts & Profile Photos)
export function validateFileSize(file: File, maxMb: number = 2): boolean {
    const maxBytes = maxMb * 1024 * 1024
    return file.size <= maxBytes
}

// Helper to format file sizes (e.g., 1.2MB / 2MB)
export function formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 MB'
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
}

// Unique Student ID Generator (e.g., FINOT-2026-8A4F)
export function generateUniqueStudentId(): string {
    const randomHex = Math.random().toString(36).substring(2, 6).toUpperCase()
    return `FINOT-2026-${randomHex}`
}