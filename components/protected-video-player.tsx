'use client'

import React, { useEffect, useState } from 'react'

interface ProtectedVideoPlayerProps {
    youtubeUrl: string
    studentName?: string
    studentUniqueId?: string
    studentPhone?: string
}

export function ProtectedVideoPlayer({
    youtubeUrl,
    studentName = 'Finot Student',
    studentUniqueId = 'FINOT-STUDENT',
    studentPhone = '',
}: ProtectedVideoPlayerProps) {
    const [watermarkPos, setWatermarkPos] = useState({ top: '10%', left: '10%' })

    // 1. Extract YouTube Video ID from various URL formats
    const getYouTubeEmbedUrl = (url: string) => {
        let videoId = ''
        if (url.includes('youtu.be/')) {
            videoId = url.split('youtu.be/')[1]?.split('?')[0] || ''
        } else if (url.includes('watch?v=')) {
            videoId = url.split('watch?v=')[1]?.split('&')[0] || ''
        } else if (url.includes('live/')) {
            videoId = url.split('live/')[1]?.split('?')[0] || ''
        } else {
            videoId = url
        }

        // Parameters to hide controls, title, YouTube logo & external links
        return `https://www.youtube.com/embed/${videoId}?controls=0&disablekb=1&modestbranding=1&rel=0&fs=0&autoplay=1`
    }

    // 2. Dynamic Floating Watermark position updater (every 4 seconds)
    useEffect(() => {
        const interval = setInterval(() => {
            const randomTop = Math.floor(Math.random() * 75) + 10 // 10% to 85%
            const randomLeft = Math.floor(Math.random() * 65) + 10 // 10% to 75%
            setWatermarkPos({ top: `${randomTop}%`, left: `${randomLeft}%` })
        }, 4000)

        return () => clearInterval(interval)
    }, [])

    // 3. Security Lockdown: Prevent Right Click, Inspect Element, and PrintScreen
    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
        }

        const handleKeyDown = (e: KeyboardEvent) => {
            // Prevent F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S, PrintScreen
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) ||
                (e.ctrlKey && (e.key === 'u' || e.key === 'U' || e.key === 's' || e.key === 'S')) ||
                e.key === 'PrintScreen'
            ) {
                e.preventDefault()
            }
        }

        window.addEventListener('contextmenu', handleContextMenu)
        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('contextmenu', handleContextMenu)
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const embedUrl = getYouTubeEmbedUrl(youtubeUrl)

    return (
        <div
            className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/20 bg-black select-none shadow-2xl"
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* Protected Video Iframe Embed */}
            <iframe
                src={embedUrl}
                title="Finot Academy Protected Video Player"
                className="w-full h-full border-0 pointer-events-auto"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen={false}
            />

            {/* Dynamic Moving Watermark Overlay */}
            <div
                className="absolute pointer-events-none z-30 transition-all duration-1000 ease-in-out px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-xs border border-white/10 text-center"
                style={{
                    top: watermarkPos.top,
                    left: watermarkPos.left,
                }}
            >
                <p className="text-[11px] font-mono font-bold text-white/40 tracking-wider">
                    {studentName} | {studentUniqueId}
                </p>
                {studentPhone && (
                    <p className="text-[9px] font-mono text-[#00EBD4]/40">
                        {studentPhone}
                    </p>
                )}
            </div>

            {/* Invisible Top Cover Overlay to block direct YouTube title click */}
            <div className="absolute top-0 left-0 w-full h-12 z-20 bg-transparent pointer-events-auto" />
        </div>
    )
}