'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Award, Search, CheckCircle2, XCircle, ShieldCheck } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function VerifyCertificateView() {
    const [certCode, setCertCode] = useState('')
    const [searchResult, setSearchResult] = useState<any>(null)
    const [isSearching, setIsSearching] = useState(false)
    const [hasSearched, setHasSearched] = useState(false)

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault()
        if (!certCode.trim()) return

        setIsSearching(true)
        setHasSearched(false)

        // Demo lookup logic for certificate verification
        setTimeout(() => {
            setIsSearching(false)
            setHasSearched(true)

            const cleanCode = certCode.trim().toUpperCase()
            if (cleanCode.startsWith('FINOT-') || cleanCode.length >= 8) {
                setSearchResult({
                    isValid: true,
                    studentName: 'Abebe Kebede',
                    courseTitle: 'Graphics Design Masterclass',
                    certificateCode: cleanCode,
                    issuedDate: 'October 27, 2026',
                    uniqueId: 'FINOT-2026-8A4F',
                })
            } else {
                setSearchResult({ isValid: false })
            }
        }, 1000)
    }

    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#00EBD4]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FE0E33]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#000E23]/80 border border-[#00EBD4]/30 text-[#00EBD4] text-xs font-semibold"
                    >
                        <Award className="w-4 h-4 text-[#FE0E33]" />
                        <span>Public Certificate Verification System</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FDFFFC] font-main">
                        ሰርተፊኬት ማረጋገጫ <span className="text-[#00EBD4]">(Verify Certificate)</span>
                    </h1>

                    <p className="text-sm text-[#FDFFFC]/80 leading-relaxed font-secondary">
                        የ Finot Academy የምስክር ወረቀት ትክክለኛነት ለማረጋገጥ ከታች ባለው መፈለጊያ የሰርተፊኬት ኮዱን ያስገቡ።
                    </p>
                </div>

                {/* Verification Form */}
                <GlassCard variant="glow" className="p-8 space-y-6">
                    <form onSubmit={handleVerify} className="space-y-4">
                        <CustomInput
                            label="የሰርተፊኬት ኮድ (Certificate Code / Student ID)"
                            placeholder="ለምሳሌ፡ FINOT-2026-8A4F"
                            value={certCode}
                            onChange={(e) => setCertCode(e.target.value)}
                            leftIcon={<Search className="w-4 h-4 text-[#00EBD4]" />}
                            required
                        />
                        <CustomButton
                            type="submit"
                            variant="secondary"
                            fullWidth
                            size="lg"
                            isLoading={isSearching}
                            rightIcon={<ShieldCheck className="w-5 h-5" />}
                        >
                            አረጋግጥ (Verify Certificate)
                        </CustomButton>
                    </form>

                    {/* Search Result Output */}
                    {hasSearched && searchResult && (
                        <div className="pt-6 border-t border-white/15 animate-in fade-in duration-300">
                            {searchResult.isValid ? (
                                <div className="p-6 rounded-2xl bg-[#00EBD4]/10 border border-[#00EBD4]/40 text-center space-y-4">
                                    <div className="w-14 h-14 rounded-full bg-[#00EBD4]/20 border border-[#00EBD4] text-[#00EBD4] mx-auto flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <span className="inline-block px-3 py-1 rounded-full bg-[#00EBD4] text-[#000E23] font-bold text-xs uppercase">
                                        Verified Authentic Certificate
                                    </span>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-[#FDFFFC]">
                                            {searchResult.studentName}
                                        </h3>
                                        <p className="text-sm text-[#00EBD4] font-semibold">
                                            {searchResult.courseTitle}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-300 pt-2 border-t border-[#00EBD4]/20 max-w-sm mx-auto">
                                        <div>
                                            <span className="text-gray-400 block">Code:</span>
                                            <strong className="text-white font-mono">{searchResult.certificateCode}</strong>
                                        </div>
                                        <div>
                                            <span className="text-gray-400 block">Issued Date:</span>
                                            <strong className="text-white">{searchResult.issuedDate}</strong>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-6 rounded-2xl bg-[#FE0E33]/10 border border-[#FE0E33]/40 text-center space-y-3">
                                    <div className="w-14 h-14 rounded-full bg-[#FE0E33]/20 border border-[#FE0E33] text-[#FE0E33] mx-auto flex items-center justify-center">
                                        <XCircle className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-lg font-bold text-[#FDFFFC]">
                                        የተሳሳተ የሰርተፊኬት ኮድ!
                                    </h3>
                                    <p className="text-xs text-gray-300">
                                        ያስገቡት ኮድ በሲስተማችን ውስጥ አልተገኘም። እባክዎን ኮዱን አስተካክለው እንደገና ይሞክሩ።
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </GlassCard>

            </div>
        </div>
    )
}