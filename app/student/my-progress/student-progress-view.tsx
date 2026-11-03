'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { TrendingUp, CheckCircle2, AlertCircle, Award, PlayCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function StudentProgressView() {
    const supabase = createClient()
    const [progressList, setProgressList] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadStudentProgress() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data, error } = await supabase
                    .from('enrollments')
                    .select('*, courses(title, slug)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (!error && data) {
                    setProgressList(data)
                }
            } catch (err) {
                console.error('Error loading progress:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadStudentProgress()
    }, [supabase])

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የትምህርት እድገት <span className="text-[#00EBD4]">(My Progress)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    በእያንዳንዱ ኮርስ ላይ ያሳዩትን እውነተኛ የትምህርት ሽፋን እና የሰርተፊኬት ብቃት ሁኔታ፡
                </p>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-xs text-gray-400">መረጃዎች እየተጫኑ ነው...</div>
            ) : progressList.length > 0 ? (
                <div className="grid grid-cols-1 gap-5">
                    {progressList.map((item) => {
                        const courseTitle = item.courses?.title || item.course_slug?.replace('-', ' ') || 'Course'
                        const courseSlug = item.courses?.slug || item.course_slug || ''
                        const percentage = item.progress_percentage || 0
                        const isEligibleForCert = percentage >= 80

                        return (
                            <GlassCard key={item.id} variant="default" className="p-6 space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold text-white capitalize">{courseTitle}</h3>
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${item.status === 'verified'
                                                ? 'bg-[#00EBD4]/20 text-[#00EBD4]'
                                                : 'bg-yellow-500/20 text-yellow-400'
                                                }`}>
                                                {item.status === 'verified' ? 'Active' : 'Pending Verification'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400">
                                            Course Unique ID: <strong className="text-[#00EBD4] font-mono">{item.unique_student_id}</strong>
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <span className="text-2xl font-extrabold text-[#00EBD4] font-mono">
                                            {percentage}%
                                        </span>
                                        <p className="text-[10px] text-gray-400">የትምህርት ሽፋን</p>
                                    </div>
                                </div>

                                <div className="w-full bg-white/10 h-3.5 rounded-full overflow-hidden p-0.5 border border-white/10">
                                    <div
                                        className="bg-gradient-to-r from-[#00EBD4] via-[#00EBD4] to-[#FE0E33] h-full rounded-full transition-all duration-700 ease-out"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>

                                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10">
                                    {isEligibleForCert ? (
                                        <div className="flex items-center gap-2 text-xs text-[#00EBD4] font-semibold">
                                            <CheckCircle2 className="w-4 h-4 shrink-0" />
                                            <span>ሰርተፊኬት ለመቀበል ብቁ ሆነዋል! (&gt;=80% ተጠናቋል)</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                                            <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
                                            <span>ሰርተፊኬት ለመቀበል ቢያንስ 80% የቪዲዮ ትምህርት ማጠናቀቅ አለብዎት።</span>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-2 self-end sm:self-auto">
                                        {isEligibleForCert && (
                                            <Link href="/student/certificates">
                                                <CustomButton variant="outline" size="sm" leftIcon={<Award className="w-4 h-4 text-[#00EBD4]" />}>
                                                    ሰርተፊኬት ውሰድ
                                                </CustomButton>
                                            </Link>
                                        )}
                                        {item.status === 'verified' && (
                                            <Link href={`/student/learn/${courseSlug}`}>
                                                <CustomButton variant="primary" size="sm" rightIcon={<PlayCircle className="w-4 h-4" />}>
                                                    ትምህርቱን ቀጥል
                                                </CustomButton>
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>
                        )
                    })}
                </div>
            ) : (
                <GlassCard variant="default" className="p-8 text-center space-y-3">
                    <TrendingUp className="w-10 h-10 text-gray-500 mx-auto" />
                    <p className="text-sm font-bold text-gray-300">እስካሁን የተመዘገቡበት ንቁ ኮርስ የለም</p>
                    <Link href="/courses" className="inline-block pt-1">
                        <CustomButton variant="primary" size="sm">
                            ኮርሶችን ይመልከቱ
                        </CustomButton>
                    </Link>
                </GlassCard>
            )}
        </div>
    )
}