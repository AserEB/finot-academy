'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function ForgotPasswordView() {
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleReset = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setSuccessMsg('')
        setIsLoading(true)

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
                redirectTo: `${window.location.origin}/reset-password`,
            })

            if (error) {
                setErrorMsg('ኢሜይሉን መላክ አልተቻለም፡ ' + error.message)
                setIsLoading(false)
                return
            }

            setSuccessMsg('የፓስወርድ ማስተካከያ ሊንክ ወደ ኢሜይልዎ ተልኳል! እባክዎን Gmail ዎን ያረጋግጡ።')
        } catch (err: any) {
            setErrorMsg('ችግር አጋጥሟል፡ ' + (err.message || ''))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#00EBD4]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 space-y-6">

                {/* Header Logo & Title */}
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
                        ፓስወርድ <span className="text-[#00EBD4]">መርሳት (Forgot Password)</span>
                    </h1>
                    <p className="text-xs text-gray-400">
                        የተመዘገቡበትን ኢሜይል አድራሻ ያስገቡ
                    </p>
                </div>

                {/* Card */}
                <GlassCard variant="glow" className="p-8 space-y-6">
                    {successMsg ? (
                        <div className="py-6 text-center space-y-4">
                            <div className="w-14 h-14 rounded-full bg-[#00EBD4]/20 border border-[#00EBD4] text-[#00EBD4] mx-auto flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>
                            <p className="text-sm font-bold text-[#FDFFFC] leading-relaxed">
                                {successMsg}
                            </p>
                            <Link href="/login" className="inline-block pt-2">
                                <CustomButton variant="outline" size="sm" leftIcon={<ArrowLeft className="w-4 h-4" />}>
                                    ወደ መግቢያ ገፅ ተመለስ
                                </CustomButton>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleReset} className="space-y-4">
                            <CustomInput
                                label="ኢሜይል አድራሻ (Gmail)"
                                type="email"
                                placeholder="example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                leftIcon={<Mail className="w-4 h-4 text-[#00EBD4]" />}
                                required
                            />

                            {errorMsg && (
                                <div className="p-3 rounded-xl bg-[#FE0E33]/15 border border-[#FE0E33]/40 text-xs text-[#FE0E33] font-semibold text-center animate-in fade-in">
                                    {errorMsg}
                                </div>
                            )}

                            <CustomButton
                                type="submit"
                                variant="primary"
                                fullWidth
                                size="lg"
                                isLoading={isLoading}
                                rightIcon={<Send className="w-4 h-4" />}
                            >
                                ሊንክ ላክ (Send Reset Link)
                            </CustomButton>
                        </form>
                    )}

                    <div className="pt-4 border-t border-white/10 text-center">
                        <Link
                            href="/login"
                            className="text-xs text-[#00EBD4] font-semibold hover:underline inline-flex items-center gap-1"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span>ወደ መግቢያ ገፅ ተመለስ</span>
                        </Link>
                    </div>
                </GlassCard>

            </div>
        </div>
    )
}