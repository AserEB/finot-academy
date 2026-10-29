'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function StudentLoginView() {
    const router = useRouter() // ካፒታል R የነበረው እዚህ ጋር ተስተካክሏል
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            })

            if (error) {
                setErrorMsg('የተሳሳተ ኢሜይል ወይም ፓስወርድ! እባክዎን እንደገና ይሞክሩ።')
                setIsLoading(false)
                return
            }

            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single()

                const role = profile?.role || 'student'

                if (role === 'owner' || role === 'assistant_admin') {
                    router.push('/admin-secure-finot-get/dashboard')
                } else {
                    router.push('/student/dashboard')
                }
            }
        } catch (err: any) {
            setErrorMsg('በመግባት ላይ ችግር አጋጥሟል፡ ' + (err.message || ''))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#FE0E33]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 space-y-6">
                <div className="text-center space-y-3">
                    <Link href="/" className="inline-flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-[#00EBD4]/40 shadow-lg">
                            <Image src="/assets/images/finot-logo.jpg" alt="Finot Academy Logo" fill className="object-cover" />
                        </div>
                    </Link>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        ወደ አካውንትዎ <span className="text-[#00EBD4]">ይግቡ (Login)</span>
                    </h1>
                    <p className="text-xs text-gray-400">እንኳን ወደ Finot Academy በደህና ተመለሱ!</p>
                </div>

                <GlassCard variant="glow" className="p-8 space-y-6">
                    <form onSubmit={handleLogin} className="space-y-4">
                        <CustomInput
                            label="ኢሜይል አድራሻ (Gmail)"
                            type="email"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail className="w-4 h-4 text-[#00EBD4]" />}
                            required
                        />

                        <div className="space-y-1">
                            <CustomInput
                                label="የይለፍ ቃል (Password)"
                                isPassword
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                leftIcon={<Lock className="w-4 h-4 text-[#00EBD4]" />}
                                required
                            />
                            <div className="text-right pt-1">
                                <Link href="/forgot-password" className="text-[11px] text-[#00EBD4] hover:underline">
                                    ፓስወርድ ረስተዋል?
                                </Link>
                            </div>
                        </div>

                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-[#FE0E33]/15 border border-[#FE0E33]/40 text-xs text-[#FE0E33] font-semibold text-center">
                                {errorMsg}
                            </div>
                        )}

                        <CustomButton
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={<LogIn className="w-4 h-4" />}
                        >
                            ይግቡ (Sign In)
                        </CustomButton>
                    </form>

                    <div className="pt-4 border-t border-white/10 text-center text-xs text-gray-400 flex items-center justify-center gap-1.5">
                        <span>አካውንት የሎትም?</span>
                        <Link href="/signup" className="text-[#00EBD4] font-bold hover:underline flex items-center gap-1">
                            <span>አዲስ አካውንት ይክፈቱ</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}