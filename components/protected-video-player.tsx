'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldAlert, Lock } from 'lucide-react'

export interface ProtectedVideoPlayerProps {
    youtubeUrl: string
    studentName?: string
    studentUniqueId?: string
    studentPhone?: string
}

export const ProtectedVideoPlayer: React.FC<ProtectedVideoPlayerProps> = ({
    youtubeUrl,
    studentName = 'Finot Student',
    studentUniqueId = 'FINOT-USER',
    studentPhone = '+251900000000',
}) => {
    // Extract YouTube Video ID from standard or share URLs
    const extractVideoId = (url: string): string => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
        const match = url.match(regExp)
        return match && match[2].length === 11 ? match[2] : ''
    }

    const videoId = extractVideoId(youtubeUrl)

    // Floating Watermark position state (Changes every 5 seconds)
    const [watermarkPos, setWatermarkPos] = useState({ top: '20%', left: '30%' })

    useEffect(() => {
        const interval = setInterval(() => {
            const top = Math.floor(Math.random() * 70 + 15) + '%'
            const left = Math.floor(Math.random() * 60 + 10) + '%'
            setWatermarkPos({ top, left })
        }, 5000)

        return () => clearInterval(interval)
    }, [])

    // Keyboard and Inspection Lockdown (PrtScn, Ctrl+S, Ctrl+U, F12)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'PrintScreen' ||
                e.keyCode === 44 ||
                (e.ctrlKey && (e.key === 's' || e.key === 'u' || e.key === 'p')) ||
                e.key === 'F12'
            ) {
                e.preventDefault()
                alert('Security Alert: Screenshots and Inspect Element are disabled to protect Finot Academy content!')
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [])

    // Youtube Embed URL with Controls & External Links Hidden
    const embedUrl = `https://www.youtube.com/embed/${videoId}?controls=0&disablekb=1&modestbranding=1&rel=0&fs=0&autoplay=0`

    if (!videoId) {
        return (
            <div className="w-full h-72 bg-[#000E23]/90 border border-[#FE0E33]/30 rounded-2xl flex flex-col items-center justify-center text-center p-6 text-[#FDFFFC]">
                <ShieldAlert className="w-12 h-12 text-[#FE0E33] mb-3 animate-bounce" />
                <p className="text-base font-bold">invalid Video Source</p>
                <p className="text-xs text-gray-400 mt-1">Please check the YouTube URL configured for this module.</p>
            </div>
        )
    }

    return (
        <div
            onContextMenu={(e) => e.preventDefault()}
            className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden border border-[#00EBD4]/20 shadow-[0_0_30px_rgba(0,14,35,0.8)] select-none"
            style={{
                WebkitUserSelect: 'none',
                userSelect: 'none',
            }}
        >
            {/* 1. Youtube Iframe Container */}
            <iframe
                src={embedUrl}
                title="Protected Course Lesson"
                className="w-full h-full pointer-events-auto border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />

            {/* 2. Transparent Dynamic Watermark Overlay (Floating) */}
            <motion.div
                animate={{ top: watermarkPos.top, left: watermarkPos.left }}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
                className="absolute z-30 pointer-events-none opacity-30 bg-[#000E23]/80 px-3 py-1.5 rounded-lg border border-[#00EBD4]/40 text-[10px] text-[#00EBD4] font-mono shadow-md backdrop-blur-xs flex items-center gap-1.5"
            >
                <Lock className="w-3 h-3 text-[#FE0E33]" />
                <span>{studentName}</span> | <span>{studentUniqueId}</span> | <span>{studentPhone}</span>
            </motion.div>

            {/* 3. Invisible Transparent Protection Shield over Iframe Title Area */}
            <div className="absolute top-0 left-0 right-0 h-16 z-20 bg-transparent pointer-events-auto" />
        </div>
    )
}