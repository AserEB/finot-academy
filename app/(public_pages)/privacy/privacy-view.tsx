'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Lock, Eye, Database } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

export default function PrivacyView() {
    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#000E23]/80 border border-[#00EBD4]/30 text-[#00EBD4] text-xs font-semibold"
                    >
                        <ShieldCheck className="w-4 h-4 text-[#00EBD4]" />
                        <span>Finot Academy Privacy</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FDFFFC] font-main">
                        የግል መረጃ ጥበቃ <span className="text-[#00EBD4]">(Privacy Policy)</span>
                    </h1>

                    <p className="text-sm text-[#FDFFFC]/80 leading-relaxed font-secondary">
                        Finot Academy የተማሪዎችን የግል መረጃ እና ደህንነት ለመጠበቅ የሚከተላቸውን መመሪያዎች ያንብቡ።
                    </p>
                </div>

                {/* Privacy Sections */}
                <GlassCard variant="default" className="p-8 space-y-8 text-sm text-gray-300 leading-relaxed">

                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-[#FDFFFC] flex items-center gap-2">
                            <Database className="w-5 h-5 text-[#00EBD4]" />
                            <span>1. የምንሰበስበው መረጃ (Data We Collect)</span>
                        </h3>
                        <p>
                            በምዝገባ ወቅት የሚሰጡትን ሙሉ ስም፣ የኢሜይል አድራሻ፣ የስልክ ቁጥር፣ ጾታ እና የክፍያ ስክሪንሾት (Receipt) በደህንነት እንይዛለን።
                        </p>
                    </div>

                    <div className="space-y-3 border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-[#FDFFFC] flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#FE0E33]" />
                            <span>2. የመረጃ አጠቃቀም (How We Use Information)</span>
                        </h3>
                        <p>
                            መረጃዎ የሚከፈሉት ኮርሶች መፈቀዳቸውን ለማረጋገጥ፣ ሰርተፊኬት ለማዘጋጀት እና አውቶማቲክ የኢሜይል ማሳወቂያዎችን ለመላክ ብቻ ያገለግላል።
                        </p>
                    </div>

                    <div className="space-y-3 border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-[#FDFFFC] flex items-center gap-2">
                            <Eye className="w-5 h-5 text-[#00EBD4]" />
                            <span>3. የመረጃ ጥበቃ እና ሚስጥራዊነት (Data Security)</span>
                        </h3>
                        <p>
                            የተማሪዎች መረጃ ለሦስተኛ ወገን አሳልፎ አይሰጥም። በቪዲዮዎች ላይ የሚታየው Dynamic Watermark የተማሪውን ስም፣ ስልክ እና Unique ID የያዘ ሆኖ የይዘት ስርቆትን ለመከላከል የሚንሳፈፍ ነው።
                        </p>
                    </div>

                </GlassCard>

            </div>
        </div>
    )
}