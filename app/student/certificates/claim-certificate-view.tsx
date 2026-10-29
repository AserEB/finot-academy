'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Award, Download, CheckCircle2, ShieldCheck, Lock, ExternalLink } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function ClaimCertificateView() {
    const supabase = createClient()
    const [studentProfile, setStudentProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Demo certificate data - linked with progress threshold
    const [certificates, setCertificates] = useState([
        {
            id: 'cert-1',
            courseTitle: 'Graphics Design Masterclass',
            issuedDate: 'October 27, 2026',
            certificateCode: 'FINOT-2026-GD89',
            isUnlocked: true,
            progress: 100,
        },
        {
            id: 'cert-2',
            courseTitle: 'Video Editing & Motion Graphics',
            issuedDate: 'Pending',
            certificateCode: 'LOCKED',
            isUnlocked: false,
            progress: 40,
        },
    ])

    useEffect(() => {
        async function loadData() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                setStudentProfile(profile || { full_name: 'Student Name', unique_id: 'FINOT-USER' })
            }
            setIsLoading(false)
        }
        loadData()
    }, [])

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የምስክር ወረቀቶች <span className="text-[#00EBD4]">(My Certificates)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    ከ 80% በላይ ባጠናቀቋቸው ኮርሶች የተዘጋጁ ህጋዊ የምስክር ወረቀቶችዎ ዝርዝር፡
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                    <GlassCard
                        key={cert.id}
                        variant={cert.isUnlocked ? 'glow' : 'default'}
                        className="p-6 space-y-4 flex flex-col justify-between"
                    >
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <div className="p-2.5 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30">
                                    <Award className="w-6 h-6" />
                                </div>
                                {cert.isUnlocked ? (
                                    <span className="px-3 py-1 rounded-full bg-[#00EBD4]/20 border border-[#00EBD4]/40 text-[#00EBD4] text-[10px] font-bold uppercase">
                                        Unlocked & Verified
                                    </span>
                                ) : (
                                    <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-gray-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                        <Lock className="w-3 h-3 text-[#FE0E33]" />
                                        <span>Locked ({cert.progress}%)</span>
                                    </span>
                                )}
                            </div>

                            <div>
                                <h3 className="text-lg font-bold text-white">{cert.courseTitle}</h3>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    ባለቤት፡ <strong className="text-white">{studentProfile?.full_name || 'Student'}</strong>
                                </p>
                            </div>

                            {cert.isUnlocked ? (
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 font-mono text-xs">
                                    <div className="flex justify-between text-gray-400 text-[11px]">
                                        <span>Certificate Code:</span>
                                        <strong className="text-[#00EBD4]">{cert.certificateCode}</strong>
                                    </div>
                                    <div className="flex justify-between text-gray-400 text-[11px]">
                                        <span>Issued Date:</span>
                                        <span className="text-white">{cert.issuedDate}</span>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-3 rounded-xl bg-[#FE0E33]/10 border border-[#FE0E33]/30 text-xs text-gray-300">
                                    <p>ሰርተፊኬቱን ለማስከፈት የትምህርት እድገትዎን ቢያንስ 80% ማድረስ አለብዎት።</p>
                                </div>
                            )}
                        </div>

                        <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                            {cert.isUnlocked ? (
                                <>
                                    <CustomButton variant="primary" size="sm" fullWidth leftIcon={<Download className="w-4 h-4" />}>
                                        Download PDF
                                    </CustomButton>
                                    <Link href={`/verify-certificate`} className="w-full">
                                        <CustomButton variant="outline" size="sm" fullWidth leftIcon={<ExternalLink className="w-4 h-4" />}>
                                            Verify Code
                                        </CustomButton>
                                    </Link>
                                </>
                            ) : (
                                <CustomButton variant="ghost" size="sm" fullWidth disabled>
                                    ተቆልፏል (Completion &lt; 80%)
                                </CustomButton>
                            )}
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}