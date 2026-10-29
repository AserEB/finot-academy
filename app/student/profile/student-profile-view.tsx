'use client'

import React, { useEffect, useState } from 'react'
import { User, Mail, Phone, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function StudentProfileView() {
    const supabase = createClient()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [uniqueId, setUniqueId] = useState('')
    const [isSaving, setIsSaving] = useState(false)
    const [successMsg, setSuccessMsg] = useState('')

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setEmail(user.email || '')
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    setFullName(profile.full_name || '')
                    setPhone(profile.phone || '')
                    setUniqueId(profile.unique_id || 'FINOT-USER')
                }
            }
        }
        loadProfile()
    }, [])

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setSuccessMsg('')

        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            await supabase
                .from('profiles')
                .update({ full_name: fullName, phone: phone })
                .eq('id', user.id)

            setSuccessMsg('ፕሮፋይልዎ በስኬት ተስተካክሏል!')
        }
        setIsSaving(false)
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የግል ፕሮፋይል <span className="text-[#00EBD4]">(Profile Settings)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    የግል መረጃዎችዎን እዚህ ማስተካከል ይችላሉ፡
                </p>
            </div>

            <GlassCard variant="glow" className="p-8 max-w-2xl space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Student Unique ID</span>
                        <strong className="text-sm font-mono text-[#00EBD4]">{uniqueId}</strong>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-[#00EBD4]" />
                </div>

                <form onSubmit={handleUpdate} className="space-y-4">
                    <CustomInput
                        label="ሙሉ ስም (Full Name)"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        leftIcon={<User className="w-4 h-4 text-[#00EBD4]" />}
                        required
                    />

                    <CustomInput
                        label="ኢሜይል አድራሻ (Gmail - Read Only)"
                        value={email}
                        disabled
                        leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
                    />

                    <CustomInput
                        label="ስልክ ቁጥር (Phone Number)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        leftIcon={<Phone className="w-4 h-4 text-[#00EBD4]" />}
                        required
                    />

                    {successMsg && (
                        <div className="p-3 rounded-xl bg-[#00EBD4]/15 border border-[#00EBD4]/40 text-xs text-[#00EBD4] font-semibold text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>{successMsg}</span>
                        </div>
                    )}

                    <CustomButton type="submit" variant="primary" isLoading={isSaving} fullWidth>
                        መረጃዎችን አዝምን (Update Profile)
                    </CustomButton>
                </form>
            </GlassCard>
        </div>
    )
}