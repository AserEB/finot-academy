'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { User, Mail, Phone, ShieldCheck, CheckCircle2, Camera } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { isValidEthiopianPhone, validateFileSize } from '@/lib/utils'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'
import { ModalDialog } from '@/components/ui/modal-dialog'

export default function StudentProfileView() {
    const supabase = createClient()
    const router = useRouter()
    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [gender, setGender] = useState<'male' | 'female'>('male')
    const [uniqueStudentId, setUniqueStudentId] = useState('')
    const [profilePhotoUrl, setProfilePhotoUrl] = useState('')

    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

    const [isSaving, setIsSaving] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)

    useEffect(() => {
        async function loadProfile() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                setEmail(user.email || '')
                // .single() ወደ .maybeSingle() ተቀይሯል (406 error እንዳይፈጥር)
                const { data: profile, error } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .maybeSingle()

                if (!error && profile) {
                    setFullName(profile.full_name || '')
                    setPhone(profile.phone_number || '')
                    setGender(profile.gender || 'male')
                    setUniqueStudentId(profile.unique_student_id || '')
                    setProfilePhotoUrl(profile.profile_photo_url || '/assets/images/default-avatar.jpg')
                } else {
                    // ፕሮፋይሉ ከሌለ አዲስ ID ይሰጠዋል
                    setUniqueStudentId(`FINOT-${Math.floor(1000 + Math.random() * 9000)}`)
                }
            }
        }
        loadProfile()
    }, [supabase])

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!validateFileSize(file, 2)) {
            setErrorMsg('የፎቶው መጠን ከ 2MB መብለጥ የለበትም!')
            return
        }

        setErrorMsg('')
        setAvatarFile(file)
        setAvatarPreview(URL.createObjectURL(file))
    }

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setErrorMsg('')

        if (phone.trim() && !isValidEthiopianPhone(phone.trim())) {
            setErrorMsg('እባክዎን ትክክለኛ የኢትዮጵያ ስልክ ቁጥር ያስገቡ!')
            setIsSaving(false)
            return
        }

        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('ተጠቃሚው አልተገኘም!')

            let newPhotoUrl = profilePhotoUrl

            if (avatarFile) {
                const fileExt = avatarFile.name.split('.').pop()
                const fileName = `${user.id}_${Date.now()}.${fileExt}`

                const { error: uploadError } = await supabase.storage
                    .from('avatars')
                    .upload(fileName, avatarFile, {
                        contentType: avatarFile.type,
                        upsert: true
                    })

                if (uploadError) {
                    throw new Error('አቫታር ወደ Storage መጫን አልተቻለም፡ ' + uploadError.message)
                }

                const { data: publicUrlData } = supabase.storage
                    .from('avatars')
                    .getPublicUrl(fileName)

                newPhotoUrl = publicUrlData.publicUrl
            }

            const fallbackName = fullName.trim() || email.split('@')[0]

            // መፍትሄው እዚህ ጋር ነው: .update() ወደ .upsert() ተቀይሯል!
            // ፕሮፋይል ከሌለ አዲስ ይፈጥራል (Create)፣ ካለ ደግሞ ያዘምናል (Update)
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    email: user.email,
                    unique_student_id: uniqueStudentId,
                    full_name: fallbackName,
                    phone_number: phone.trim() || null,
                    gender: gender,
                    profile_photo_url: newPhotoUrl,
                    updated_at: new Date().toISOString(),
                }, { onConflict: 'id' })

            if (updateError) {
                throw new Error('ዳታቤዝ ላይ ፕሮፋይል ማዘመን አልተቻለም፡ ' + updateError.message)
            }

            setFullName(fallbackName)
            setProfilePhotoUrl(newPhotoUrl)
            setAvatarFile(null)
            setAvatarPreview(null)
            setIsSuccessModalOpen(true)

            router.refresh()

        } catch (err: any) {
            setErrorMsg(err.message || 'ፕሮፋይል ማዘመን አልተቻለም!')
        } finally {
            setIsSaving(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የግል ፕሮፋይል <span className="text-[#00EBD4]">(Profile Settings)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    የግል መረጃዎችዎን እና የፕሮፋይል ፎቶዎን እዚህ ማስተካከል ይችላሉ፡
                </p>
            </div>

            <GlassCard variant="glow" className="p-8 max-w-2xl space-y-6">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-400 block uppercase">Student Unique ID (Immutable)</span>
                        <strong className="text-sm font-mono text-[#00EBD4]">{uniqueStudentId}</strong>
                    </div>
                    <ShieldCheck className="w-5 h-5 text-[#00EBD4]" />
                </div>

                <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-[#00EBD4]/50 shrink-0 bg-black/40 shadow-lg">
                            <Image
                                src={avatarPreview || profilePhotoUrl || '/assets/images/default-avatar.jpg'}
                                alt="Profile Avatar"
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="space-y-2 text-center sm:text-left">
                            <h4 className="text-xs font-bold text-white">የፕሮፋይል ፎቶ (Avatar Upload)</h4>
                            <p className="text-[11px] text-gray-400">
                                1:1 Ratio (Square) ፎቶ ይምረጡ፤ ከፍተኛ መጠን 2MB።
                            </p>
                            <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#00EBD4]/20 text-[#00EBD4] text-xs font-semibold cursor-pointer hover:bg-[#00EBD4]/30 transition-colors">
                                <Camera className="w-3.5 h-3.5" />
                                <span>ፎቶ ይምረጡ (Browse)</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <CustomInput
                        label="ሙሉ ስም (Full Name)"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="ሙሉ ስምዎን ያስገቡ"
                        leftIcon={<User className="w-4 h-4 text-[#00EBD4]" />}
                    />

                    <CustomInput
                        label="ኢሜይል አድራሻ (Gmail - Read Only)"
                        value={email}
                        disabled
                        leftIcon={<Mail className="w-4 h-4 text-gray-400" />}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <CustomInput
                            label="ስልክ ቁጥር (Phone Number)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0912345678 (Optional)"
                            leftIcon={<Phone className="w-4 h-4 text-[#00EBD4]" />}
                        />

                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-xs font-medium text-[#FDFFFC]/80">ጾታ (Gender)</label>
                            <select
                                value={gender}
                                onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                                className="w-full bg-[#000E23] border border-[#00EBD4]/20 text-[#FDFFFC] text-xs rounded-xl px-3 py-3 outline-none focus:border-[#00EBD4]"
                            >
                                <option value="male">ወንድ (Male)</option>
                                <option value="female">ሴት (Female)</option>
                            </select>
                        </div>
                    </div>

                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-[#FE0E33]/15 border border-[#FE0E33]/40 text-xs text-[#FE0E33] font-semibold text-center">
                            {errorMsg}
                        </div>
                    )}

                    <CustomButton type="submit" variant="primary" isLoading={isSaving} fullWidth>
                        መረጃዎችን አዝምን (Update Profile)
                    </CustomButton>
                </form>
            </GlassCard>

            <ModalDialog
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
                title="ፕሮፋይልዎ በስኬት ተስተካክሏል!"
                description="የቀየሩት መረጃ እና የፕሮፋይል ፎቶ በስኬት ተቀምጧል።"
            >
                <div className="space-y-4 text-center py-2">
                    <div className="w-12 h-12 rounded-full bg-[#00EBD4]/20 border border-[#00EBD4]/40 text-[#00EBD4] flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-7 h-7" />
                    </div>
                    <p className="text-xs text-gray-300">
                        የቀየሩት ፕሮፋይል እና አቫታር አሁን በዳሽቦርድዎ እና በሲስተሙ ላይ በቋሚነት ይታያል።
                    </p>
                    <div className="pt-2">
                        <CustomButton
                            variant="primary"
                            size="sm"
                            fullWidth
                            onClick={() => {
                                setIsSuccessModalOpen(false);
                                router.push('/student/dashboard');
                            }}
                        >
                            እሺ (OK)
                        </CustomButton>
                    </div>
                </div>
            </ModalDialog>
        </div>
    )
}