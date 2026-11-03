'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MailCheck, ArrowRight, ShieldCheck } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function VerifyEmailView() {
    return (
        <div className="w-full min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#00EBD4]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 space-y-6">
                {/* Header Logo */}
                <div className="text-center space-y-3">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#00EBD4]/40 shadow-lg">
                            <Image
                                src="/assets/images/finot-logo.jpg"
                                alt="Finot Academy Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        ኢሜይልዎን <span className="text-[#00EBD4]">ያረጋግጡ</span>
                    </h1>
                </div>

                <GlassCard variant="glow" className="p-8 text-center space-y-6">
                    <div className="w-16 h-16 rounded-full bg-[#00EBD4]/20 border border-[#00EBD4] text-[#00EBD4] mx-auto flex items-center justify-center animate-bounce">
                        <MailCheck className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-[#FDFFFC]">
                            የማረጋገጫ ሊንክ ተልኳል!
                        </h3>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            እባክዎን ወደ Gmail አካውንትዎ በመሄድ የተላከውን የማረጋገጫ ሊንክ ይጫኑ። ከተረጋገጠ በኋላ ቀጥታ ወደ Finot Academy መግባት ይችላሉ።
                        </p>
                    </div>

                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-left text-[11px] text-gray-400 space-y-1">
                        <div className="flex items-center gap-1.5 text-[#00EBD4] font-semibold">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>ማሳሰቢያ፡</span>
                        </div>
                        <p>መልእክቱ በ Inbox ካልመጣ እባክዎን Spam / Junk ፎልደርዎን ያረጋግጡ።</p>
                    </div>

                    <div className="pt-2">
                        <Link href="/login">
                            <CustomButton variant="primary" fullWidth rightIcon={<ArrowRight className="w-4 h-4" />}>
                                ወደ መግቢያ ገፅ ሂድ (Login)
                            </CustomButton>
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}