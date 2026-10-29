'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Upload, CheckCircle2, ShieldCheck, Copy, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { validateFileSize } from '@/lib/utils'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

interface EnrollmentFormViewProps {
    courseSlug: string
}

export default function EnrollmentFormView({ courseSlug }: EnrollmentFormViewProps) {
    const router = useRouter()
    const supabase = createClient()

    const [receiptFile, setReceiptFile] = useState<File | null>(null)
    const [filePreview, setFilePreview] = useState<string | null>(null)
    const [copiedBank, setCopiedBank] = useState<string | null>(null)
    const [errorMsg, setErrorMsg] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const courseDetails: Record<string, { title: string; price: number }> = {
        'graphics-design': { title: 'Graphics Design Masterclass', price: 4200 },
        'video-editing': { title: 'Video Editing & Motion Graphics', price: 7000 },
        'smm-marketing': { title: 'Social Media Marketing (SMM)', price: 3500 },
        'prompt-engineering': { title: 'Prompt Engineering & Generative AI', price: 2500 },
    }

    const selectedCourse = courseDetails[courseSlug] || { title: 'Digital Skill Course', price: 3500 }

    const handleCopy = (text: string, bank: string) => {
        navigator.clipboard.writeText(text)
        setCopiedBank(bank)
        setTimeout(() => setCopiedBank(null), 2000)
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!validateFileSize(file, 2)) {
            setErrorMsg('የፋይሉ መጠን ከ 2MB መብለጥ የለበትም!')
            return
        }

        setErrorMsg('')
        setReceiptFile(file)
        setFilePreview(URL.createObjectURL(file))
    }

    const handleSubmitEnrollment = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!receiptFile) {
            setErrorMsg('እባክዎን የክፍያ ስክሪንሾቱን (Receipt Screenshot) ያያይዙ!')
            return
        }

        setIsSubmitting(true)
        setErrorMsg('')

        try {
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) {
                setErrorMsg('እባክዎን አስቀድመው ወደ አካውንትዎ ይግቡ (Login)!')
                setIsSubmitting(false)
                return
            }

            const fileExt = receiptFile.name.split('.').pop()
            const fileName = `${user.id}_${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(fileName, receiptFile)

            if (uploadError) {
                setErrorMsg('የክፍያ ሰነዱን መጫን አልተቻለም፡ ' + uploadError.message)
                setIsSubmitting(false)
                return
            }

            const receiptUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/receipts/${fileName}`

            const { error: insertError } = await supabase
                .from('enrollments')
                .insert({
                    user_id: user.id,
                    course_slug: courseSlug,
                    receipt_url: receiptUrl,
                    status: 'pending',
                })

            if (insertError) {
                setErrorMsg('ምዝገባውን መመዝገብ አልተቻለም፡ ' + insertError.message)
                setIsSubmitting(false)
                return
            }

            setIsSuccess(true)
        } catch (err: any) {
            setErrorMsg('ችግር አጋጥሟል፡ ' + (err.message || ''))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

                <div className="text-center space-y-3">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#FDFFFC] font-main">
                        የስልጠና ምዝገባ እና ክፍያ <span className="text-[#00EBD4]">(Enrollment)</span>
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-300">
                        የመረጡት ኮርስ፡ <strong className="text-[#00EBD4]">{selectedCourse.title}</strong> —
                        ክፍያ፡ <strong className="text-[#FE0E33]">{selectedCourse.price.toLocaleString()} ETB</strong>
                    </p>
                </div>

                {isSuccess ? (
                    <GlassCard variant="glow" className="p-8 text-center space-y-6 animate-in fade-in">
                        <div className="w-16 h-16 rounded-full bg-[#00EBD4]/20 border border-[#00EBD4] text-[#00EBD4] mx-auto flex items-center justify-center">
                            <CheckCircle2 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold text-[#FDFFFC]">
                                የክፍያ ማረጋገጫዎ በስኬት ተልኳል!
                            </h2>
                            <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto leading-relaxed">
                                የ Finot Academy አድሚን ቡድን የከፈሉትን ደረሰኝ አረጋግጦ አካውንትዎን በቅርብ ሰዓታት ውስጥ ያጸድቃል።
                            </p>
                        </div>
                        <Link href="/student/dashboard">
                            <CustomButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                ወደ ተማሪ ዳሽቦርድ ሂድ (Go to Dashboard)
                            </CustomButton>
                        </Link>
                    </GlassCard>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

                        <GlassCard variant="default" className="p-6 space-y-6">
                            <h3 className="text-lg font-bold text-[#FDFFFC] border-b border-white/10 pb-3">
                                1. የክፍያ አማራጮች (Payment Accounts)
                            </h3>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <span className="text-xs font-bold text-[#00EBD4] uppercase tracking-wider">Telebirr Account</span>
                                <div className="flex items-center justify-between text-sm font-bold text-white">
                                    <span>0911223344</span>
                                    <button
                                        onClick={() => handleCopy('0911223344', 'telebirr')}
                                        className="p-1.5 rounded-lg bg-white/10 hover:bg-[#00EBD4]/20 text-[#00EBD4] transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                {copiedBank === 'telebirr' && <p className="text-[10px] text-[#00EBD4]">ተቀድቷል (Copied!)</p>}
                            </div>

                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                <span className="text-xs font-bold text-[#FE0E33] uppercase tracking-wider">CBE Bank Account</span>
                                <div className="flex items-center justify-between text-sm font-bold text-white">
                                    <span>1000123456789</span>
                                    <button
                                        onClick={() => handleCopy('1000123456789', 'cbe')}
                                        className="p-1.5 rounded-lg bg-white/10 hover:bg-[#FE0E33]/20 text-[#FE0E33] transition-colors"
                                    >
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </div>
                                {copiedBank === 'cbe' && <p className="text-[10px] text-[#FE0E33]">ተቀድቷል (Copied!)</p>}
                            </div>
                        </GlassCard>

                        <GlassCard variant="glow" className="p-6 space-y-6">
                            <h3 className="text-lg font-bold text-[#FDFFFC] border-b border-white/10 pb-3">
                                2. የክፍያ ስክሪንሾት ይላኩ (Upload Receipt)
                            </h3>

                            <form onSubmit={handleSubmitEnrollment} className="space-y-4">
                                <div className="flex flex-col items-center justify-center border-2 border-dashed border-[#00EBD4]/40 rounded-2xl p-6 text-center hover:border-[#00EBD4] transition-colors bg-black/20">
                                    {filePreview ? (
                                        <div className="space-y-3 w-full">
                                            <div className="relative w-full h-40 rounded-xl overflow-hidden border border-white/20">
                                                <Image src={filePreview} alt="Receipt Preview" fill className="object-cover" />
                                            </div>
                                            <p className="text-xs text-[#00EBD4] font-semibold">{receiptFile?.name}</p>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer space-y-2 flex flex-col items-center">
                                            <Upload className="w-10 h-10 text-[#00EBD4] animate-bounce" />
                                            <span className="text-xs font-bold text-white">የከፈሉበትን ስክሪንሾት ይምረጡ</span>
                                            <span className="text-[10px] text-gray-400">PNG, JPG እስከ 2MB</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="hidden"
                                            />
                                        </label>
                                    )}
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
                                    isLoading={isSubmitting}
                                    rightIcon={<ShieldCheck className="w-5 h-5" />}
                                >
                                    ምዝገባውን አረጋግጥ (Submit Enrollment)
                                </CustomButton>
                            </form>
                        </GlassCard>

                    </div>
                )}

            </div>
        </div>
    )
}