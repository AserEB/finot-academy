'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BellRing, X, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export const PinnedAnnouncementBanner: React.FC = () => {
    const supabase = createClient()
    const [banner, setBanner] = useState<any | null>(null)
    const [isVisible, setIsVisible] = useState(true)

    // ከ Supabase ዳታቤዝ Live Pinned Banner ማምጣት
    useEffect(() => {
        const fetchPinnedBanner = async () => {
            try {
                const { data, error } = await supabase
                    .from('announcements')
                    .select('*')
                    .eq('is_pinned_banner', true)
                    .eq('is_active', true)
                    .eq('target_audience', 'all')
                    .order('created_at', { ascending: false })
                    .limit(1)
                    .maybeSingle()

                if (!error && data) {
                    setBanner(data)
                } else {
                    setBanner(null)
                }
            } catch (err) {
                console.error('Fetch Banner Error:', err)
            }
        }

        fetchPinnedBanner()
    }, [])

    if (!banner || !isVisible) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full bg-gradient-to-r from-[#000E23] via-[#000E23]/95 to-[#000E23] border-b border-[#FE0E33]/40 shadow-[0_4px_20px_rgba(254,14,51,0.15)] relative z-40"
            >
                <div className="max-w-7xl mx-auto px-4 py-2.5 sm:px-6 lg:px-8 flex items-center justify-between gap-4 text-xs sm:text-sm text-[#FDFFFC]">
                    {/* Banner Icon & Message */}
                    <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="p-1.5 rounded-lg bg-[#FE0E33]/20 border border-[#FE0E33]/40 text-[#FE0E33] shrink-0 animate-pulse">
                            <BellRing className="w-4 h-4" />
                        </div>
                        <div className="flex flex-wrap items-center gap-2 truncate">
                            <span className="font-bold text-[#00EBD4] bg-[#00EBD4]/10 px-2 py-0.5 rounded border border-[#00EBD4]/20 shrink-0">
                                {banner.title}
                            </span>
                            <span className="truncate text-[#FDFFFC]/90">{banner.message}</span>
                        </div>
                    </div>

                    {/* Action Link & Dismiss */}
                    <div className="flex items-center gap-3 shrink-0">
                        <a
                            href="/courses"
                            className="inline-flex items-center gap-1 font-semibold text-[#00EBD4] hover:text-[#FDFFFC] hover:underline transition-colors text-xs"
                        >
                            <span>ኮርሶችን ይመልከቱ</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-1 rounded-md text-gray-400 hover:text-[#FE0E33] hover:bg-white/10 transition-colors"
                            title="ማስታወቂያውን ዝጋ"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}