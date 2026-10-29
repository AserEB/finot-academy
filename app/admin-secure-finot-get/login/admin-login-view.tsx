'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function AdminLoginView() {
    const router = useRouter()
    const supabase = createClient()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleAdminLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email.trim(),
                password: password,
            })

            if (error) {
                setErrorMsg('የተሳሳተ የአድሚን ኢሜይል ወይም ፓስወርድ!')
                setIsLoading(false)
                return
            }

            if (data.user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', data.user.id)
                    .single()

                if (profile && (profile.role === 'owner' || profile.role === 'assistant_admin')) {
                    router.push('/admin-secure-finot-get/dashboard')
                } else {
                    setErrorMsg('ይህ አካውንት የአድሚን ፈቃድ የለውም!')
                    await supabase.auth.signOut()
                }
            }
        } catch (err: any) {
            setErrorMsg('በመግባት ላይ ችግር አጋጥሟል፡ ' + (err.message || ''))
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full min-h-screen bg-[#000E23] flex items-center justify-center py-12 px-4 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] bg-[#FE0E33]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="w-full max-w-md relative z-10 space-y-6">
                <div className="text-center space-y-3">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden border border-[#FE0E33]/50 mx-auto shadow-xl">
                        <Image src="/assets/images/finot-logo.jpg" alt="Finot Logo" fill className="object-cover" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#FDFFFC] font-main">
                        FINOT <span className="text-[#FE0E33]">ADMIN PORTAL</span>
                    </h1>
                    <p className="text-xs text-gray-400">የአድሚኖችና የመስራቾች ጥብቅ መግቢያ ገፅ</p>
                </div>

                <GlassCard variant="glow" className="p-8 space-y-6">
                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <CustomInput
                            label="Admin Gmail"
                            type="email"
                            placeholder="admin@finotacademy.tech"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            leftIcon={<Mail className="w-4 h-4 text-[#FE0E33]" />}
                            required
                        />

                        <CustomInput
                            label="Admin Password"
                            isPassword
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            leftIcon={<Lock className="w-4 h-4 text-[#FE0E33]" />}
                            required
                        />

                        {errorMsg && (
                            <div className="p-3 rounded-xl bg-[#FE0E33]/20 border border-[#FE0E33]/50 text-xs text-[#FE0E33] font-semibold text-center">
                                {errorMsg}
                            </div>
                        )}

                        <CustomButton
                            type="submit"
                            variant="danger"
                            fullWidth
                            size="lg"
                            isLoading={isLoading}
                            rightIcon={<ShieldCheck className="w-5 h-5" />}
                        >
                            አድሚን ሆይ ይግቡ (Admin Sign In)
                        </CustomButton>
                    </form>
                </GlassCard>
            </div>
        </div>
    )
}