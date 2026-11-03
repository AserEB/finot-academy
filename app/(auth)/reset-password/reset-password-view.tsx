'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function ResetPasswordView() {
    const router = useRouter()
    const supabase = createClient()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setSuccessMsg('')

        if (password !== confirmPassword) {
            setErrorMsg('የገቡት የይለፍ ቃሎች አይመሳሰሉም!')
            return
        }

        if (password.length < 6) {
            setErrorMsg('ፓስወርድ ቢያንስ 6 ፊደላት/ቁጥሮች መሆን አለበት!')
            return
        }

        setIsLoading(true)

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            })

            if (error) {
                setErrorMsg('ፓስወርድ መቀየር አልተቻለም፡ ' + error.message)
                setIsLoading(false)
                return
            }

            setSuccessMsg('ፓስወርድዎ በስኬት ተቀይሯል! አሁን መግባት ይችላሉ።')
            setTimeout(() => {
                router.push('/login')
            }, 2000)
        } catch (err: any) {
            setErrorMsg('ችግር አጋጥሟል፡ ' + (err.message || ''))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#FE0E33]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 space-y-6">

                {/* Header */}
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
                        አዲስ ፓስወርድ <span className="text-[#00EBD4]">ያዘጋጁ</span>
                    </h1>
                </div>

                {/* Form Card */}
                <GlassCard variant="glow" className="p-8 space-y-6">
                    <form onSubmit={handleUpdatePassword} className="space-y-4">
                        <CustomInput
                            label="አዲስ የይለፍ ቃል (New Password)"
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
                            rightIcon={<ArrowRight className="w-4 h-4" />}
                        >
                            ፓስወርድ ቀይር (Update Password)
                        </CustomButton>
                    </form>
                </GlassCard>

            </div>
        </div>
    )
}