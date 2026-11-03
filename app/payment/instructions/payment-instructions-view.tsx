'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    CreditCard,
    CheckCircle2,
    Copy,
    Smartphone,
    Building2,
    ArrowRight,
    ShieldCheck,
    FileCheck2,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function PaymentInstructionsView() {
    const [copiedAccount, setCopiedAccount] = useState<string | null>(null)

    const copyToClipboard = (text: string, accountName: string) => {
        navigator.clipboard.writeText(text)
        setCopiedAccount(accountName)
        setTimeout(() => setCopiedAccount(null), 2000)
    }

    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#00EBD4]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FE0E33]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#000E23]/80 border border-[#00EBD4]/30 text-[#00EBD4] text-xs font-semibold"
                    >
                        <CreditCard className="w-4 h-4 text-[#FE0E33]" />
                        <span>Finot Academy Payment Guide</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FDFFFC] font-main">
                        የክፍያ መመሪያዎች <span className="text-[#00EBD4]">(Instructions)</span>
                    </h1>

                    <p className="text-sm text-[#FDFFFC]/80 leading-relaxed font-secondary">
                        በ Telebirr ወይም በ CBE የባንክ አካውንታችን ክፍያ ፈጽመው ምዝገባዎን በ 3 ቀላል ደረጃዎች ያጠናቁ።
                    </p>
                </div>

                {/* Account Details Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Telebirr Card */}
                    <GlassCard variant="interactive" className="p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2 text-[#00EBD4]">
                                <Smartphone className="w-5 h-5" />
                                <h3 className="text-base font-bold text-white">Telebirr Account</h3>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-[#00EBD4]/20 text-[#00EBD4] text-[10px] font-bold">
                                Instant Transfer
                            </span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs text-gray-400">የአካውንት ስም (Account Holder)</span>
                            <p className="text-sm font-bold text-white">Finot Academy / Bereket</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-gray-400 block">የስልክ / ሂሳብ ቁጥር</span>
                                <strong className="text-base font-mono text-[#00EBD4]">0911223344</strong>
                            </div>
                            <button
                                onClick={() => copyToClipboard('0911223344', 'telebirr')}
                                className="p-2 rounded-lg bg-white/10 hover:bg-[#00EBD4]/20 text-[#00EBD4] transition-colors"
                                title="Copy Number"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        {copiedAccount === 'telebirr' && (
                            <p className="text-[10px] text-[#00EBD4] font-semibold">ቁጥሩ ተቀድቷል (Copied!)</p>
                        )}
                    </GlassCard>

                    {/* CBE Card */}
                    <GlassCard variant="interactive" className="p-6 space-y-4">
                        <div className="flex items-center justify-between border-b border-white/10 pb-3">
                            <div className="flex items-center gap-2 text-[#FE0E33]">
                                <Building2 className="w-5 h-5" />
                                <h3 className="text-base font-bold text-white">CBE Account</h3>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-[#FE0E33]/20 text-[#FE0E33] text-[10px] font-bold">
                                CBE Birr / Mobile Banking
                            </span>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs text-gray-400">የአካውንት ስም (Account Holder)</span>
                            <p className="text-sm font-bold text-white">Finot Academy</p>
                        </div>

                        <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                            <div>
                                <span className="text-[10px] text-gray-400 block">የባንክ ሂሳብ ቁጥር (Account Number)</span>
                                <strong className="text-base font-mono text-[#FE0E33]">1000123456789</strong>
                            </div>
                            <button
                                onClick={() => copyToClipboard('1000123456789', 'cbe')}
                                className="p-2 rounded-lg bg-white/10 hover:bg-[#FE0E33]/20 text-[#FE0E33] transition-colors"
                                title="Copy Number"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        {copiedAccount === 'cbe' && (
                            <p className="text-[10px] text-[#FE0E33] font-semibold">ቁጥሩ ተቀድቷል (Copied!)</p>
                        )}
                    </GlassCard>

                </div>

                {/* 3 Step Guide */}
                <GlassCard variant="default" className="p-8 space-y-6">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                        <FileCheck2 className="w-5 h-5 text-[#00EBD4]" />
                        <span>ምዝገባን የማጠናቀቂያ 3 ደረጃዎች (Steps to Follow)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div className="space-y-2">
                            <div className="w-8 h-8 rounded-full bg-[#00EBD4]/20 text-[#00EBD4] font-extrabold flex items-center justify-center text-sm">
                                1
                            </div>
                            <h4 className="text-sm font-bold text-white">ክፍያ ይፈጽሙ</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                በ Telebirr ወይም CBE ሂሳብ ቁጥራችን የኮርሱን ትክክለኛ የክፍያ መጠን ይላኩ።
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="w-8 h-8 rounded-full bg-[#FE0E33]/20 text-[#FE0E33] font-extrabold flex items-center justify-center text-sm">
                                2
                            </div>
                            <h4 className="text-sm font-bold text-white">ስክሪንሾት ያንሱ</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                የተሳካበትን የክፍያ ደረሰኝ (Transaction Receipt) ስክሪንሾት በማንሳት ያስቀምጡ።
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="w-8 h-8 rounded-full bg-[#00EBD4]/20 text-[#00EBD4] font-extrabold flex items-center justify-center text-sm">
                                3
                            </div>
                            <h4 className="text-sm font-bold text-white">ስክሪንሾቱን ይላኩ</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                በምዝገባ ገጹ ላይ ስክሪንሾቱን ያያይዙ። አድሚኖቻችን አረጋግጠው ወዲያውኑ ያጸድቁልዎታል።
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 text-center">
                        <Link href="/courses">
                            <CustomButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                ወደ ኮርሶች ሂድና ተመዝገብ (Select Course)
                            </CustomButton>
                        </Link>
                    </div>
                </GlassCard>

            </div>
        </div>
    )
}