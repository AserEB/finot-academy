'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { FileText, ShieldAlert, Lock, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

export default function TermsView() {
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
                        <FileText className="w-4 h-4 text-[#FE0E33]" />
                        <span>Finot Academy Legal</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FDFFFC] font-main">
                        የአገልግሎት ውሎች <span className="text-[#00EBD4]">(Terms & Conditions)</span>
                    </h1>

                    <p className="text-sm text-[#FDFFFC]/80 leading-relaxed font-secondary">
                        እባክዎን የ Finot Academy መድረክን ከመጠቀምዎ በፊት የሚከተሉትን ህጎችና መመሪያዎች በጥንቃቄ ያንብቡ።
                    </p>
                </div>

                {/* Legal Sections */}
                <GlassCard variant="default" className="p-8 space-y-8 text-sm text-gray-300 leading-relaxed">

                    <div className="space-y-3">
                        <h3 className="text-lg font-bold text-[#FDFFFC] flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-[#00EBD4]" />
                            <span>1. የአካውንት አጠቃቀም (Account Policy)</span>
                        </h3>
                        <p>
                            እያንዳንዱ የተማሪ አካውንት ለአንድ ሰው ብቻ የሚያገለግል ነው። አካውንትዎን ለሌላ ሰው አሳልፎ መስጠት፣ ፓስወርድ ማጋራት ወይም በቡድን መጠቀም በጥብቅ የተከለከለ ነው።
                        </p>
                    </div>

                    <div className="space-y-3 border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-[#FE0E33] flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5 text-[#FE0E33]" />
                            <span>2. የይዘት ጥበቃ እና የቅጅ መብት (Copyright & Security)</span>
                        </h3>
                        <p>
                            በ Finot Academy የሚቀርቡ የቪዲዮ ትምህርቶች፣ ሰነዶች እና ቁሳቁሶች በሙሉ የ Finot Academy ንብረቶች ናቸው። ቪዲዮዎችን በሌላ ስልክ ማንሳት፣ በስክሪን ሪኮርደር መቅረጽ ወይም ማሰራጨት በህግ የሚያስጠይቅ ከመሆኑም በላይ አካውንትዎ ያለምንም ቅድመ ማሳወቂያ እንዲታገድ ያደርጋል።
                        </p>
                    </div>

                    <div className="space-y-3 border-t border-white/10 pt-6">
                        <h3 className="text-lg font-bold text-[#FDFFFC] flex items-center gap-2">
                            <Lock className="w-5 h-5 text-[#00EBD4]" />
                            <span>3. የምዝገባ ክፍያ እና መጽደቅ (Enrollment & Refunds)</span>
                        </h3>
                        <p>
                            ተማሪዎች የሚልኩት የክፍያ ስክሪንሾት (Receipt) በአድሚን ከተረጋገጠ በኋላ ምዝገባው ይጸድቃል። የተሳሳተ ወይም ሀሰተኛ የክፍያ ሰነድ ማያያዝ ምዝገባው ውድቅ እንዲሆንና አካውንቱ እንዲታገድ ያደርጋል።
                        </p>
                    </div>

                </GlassCard>

            </div>
        </div>
    )
}