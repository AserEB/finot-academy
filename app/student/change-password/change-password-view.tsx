'use client'

import React, { useState } from 'react'
import { Lock, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function ChangePasswordView() {
    const supabase = createClient()
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    const handleChange = async (e: React.FormEvent) => {
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

        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            setErrorMsg('ችግር አጋጥሟል፡ ' + error.message)
        } else {
            setSuccessMsg('ፓስወርድዎ በስኬት ተቀይሯል!')
            setPassword('')
            setConfirmPassword('')
        }
        setIsLoading(false)
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የይለፍ ቃል መቀየሪያ <span className="text-[#00EBD4]">(Change Password)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    አካውንትዎን ይበልጥ ደህንነቱ የተጠበቀ ለማድረግ አዲስ ፓስወርድ ያስገቡ፡
                </p>
            </div>

            <GlassCard variant="glow" className="p-8 max-w-md space-y-6">
                <form onSubmit={handleChange} className="space-y-4">
                    <CustomInput
                        label="አዲስ የይለፍ ቃል"
                        isPassword
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        leftIcon={<Lock className="w-4 h-4 text-[#00EBD4]" />}
                        required
                    />

                    <CustomInput
                        label="አዲስ ፓስወርድ ያረጋግጡ"
                        isPassword
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        leftIcon={<Lock className="w-4 h-4 text-[#00EBD4]" />}
                        required
                    />

                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-[#FE0E33]/15 border border-[#FE0E33]/40 text-xs text-[#FE0E33] font-semibold text-center">
                            {errorMsg}
                        </div>
                    )}

                    {successMsg && (
                        <div className="p-3 rounded-xl bg-[#00EBD4]/15 border border-[#00EBD4]/40 text-xs text-[#00EBD4] font-semibold text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <CustomButton type="submit" variant="primary" fullWidth isLoading={isLoading}>
                        ፓስወርድ ቀይር (Update)
                    </CustomButton>
                </form>
            </GlassCard>
        </div>
    )
}