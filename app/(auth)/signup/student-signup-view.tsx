'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function SignupView() {
    const router = useRouter()
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setSuccessMsg('')

        if (password !== confirmPassword) {
            setErrorMsg('ያስገቡት ፓስወርድ እና ማረጋገጫው አይመሳሰሉም!')
            return
        }

        if (password.length < 6) {
            setErrorMsg('ፓስወርድ ቢያንስ 6 ፊደላት/ቁጥሮች መሆን አለበት!')
            return
        }

        setIsLoading(true)

        try {
            // Register Auth User (SQL Trigger automatically handles profiles insertion)
            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: password,
            })

            if (error) {
                setErrorMsg(error.message || 'በምዝገባ ወቅት ችግር አጋጥሟል!')
                setIsLoading(false)
                return
            }

            setSuccessMsg('አካውንትዎ በስኬት ተፈጥሯል! አሁኑኑ መግባት ይችላሉ።')
            setTimeout(() => {
                router.push('/login')
            }, 1500)

        } catch (err: any) {
            setErrorMsg('ችግር አጋጥሟል፡ ' + (err.message || ''))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[450px] bg-[#00EBD4]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 space-y-6">
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
                        አዲስ አካውንት <span className="text-[#00EBD4]">ይምዝገቡ (Sign Up)</span>
                    </h1>
                    <p className="text-xs text-gray-400">
                        ኢሜይል እና ፓስወርድ በማስገባት አካውንት ይክፈቱ!
                    </p>
                </div>

                <GlassCard variant="glow" className="p-8 space-y-6">
                    <form onSubmit={handleSignup} className="space-y-4">
                        <CustomInput
                            label="ኢሜይል አድራሻ (Gmail)"
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail className="w-4 h-4 text-[#00EBD4]" />}
                            required
                        />

                        <CustomInput
                            label="የይለፍ ቃል (Password)"
                            isPassword
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            leftIcon={<Lock className="w-4 h-4 text-[#00EBD4]" />}
                            required
                        />

                        <CustomInput
                            label="ፓስወርድ ያረጋግጡ (Confirm Password)"
                            isPassword
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            leftIcon={<Lock className="w-4 h-4 text-[#00EBD4]" />}
                            required
                        />

                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-[#FE0E33]/15 border border-[#FE0E33]/40 text-xs text-[#FE0E33] font-semibold text-center animate-in fade-in">
                                {errorMsg}
                            </div>
                        )}

                        {successMsg && (
                            <div className="p-3 rounded-xl bg-[#00EBD4]/15 border border-[#00EBD4]/40 text-xs text-[#00EBD4] font-semibold text-center flex items-center justify-center gap-2 animate-in fade-in">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{successMsg}</span>
                            </div>
                        )}

                        <CustomButton
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={<Sparkles className="w-4 h-4" />}
                        >
                            አካውንት ክፈት (Create Account)
                        </CustomButton>
                    </form>

                    <div className="pt-4 border-t border-white/10 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                        <span>አካውንት አለዎት?</span>
                        <Link
                            href="/login"
                            className="text-[#00EBD4] font-bold hover:underline flex items-center gap-1"
                        >
                            <span>ይግቡ (Login)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}