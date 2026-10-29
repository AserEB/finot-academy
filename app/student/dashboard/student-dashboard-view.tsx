'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    BookOpen,
    Clock,
    Award,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    PlayCircle,
    ArrowRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function StudentDashboardView() {
    const supabase = createClient()
    const [userProfile, setUserProfile] = useState<any>(null)
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadDashboardData() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                // Fetch User Profile
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                setUserProfile(profile || { full_name: user.email?.split('@')[0], unique_id: 'FINOT-USER' })

                // Fetch Student Enrollments State
                const { data: enrollData } = await supabase
                    .from('enrollments')
                    .select('*')
                    .eq('user_id', user.id)

                setEnrollments(enrollData || [])
            } catch (err) {
                console.error('Dashboard load error:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadDashboardData()
    }, [])

    return (
        <div className="space-y-8">
            {/* Welcome Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#000E23] via-[#000E23]/90 to-[#000E23] border border-[#00EBD4]/30 shadow-xl">
                <div>
                    <span className="text-xs font-mono text-[#00EBD4] tracking-widest uppercase">
                        ID: {userProfile?.unique_id || 'FINOT-2026-STUDENT'}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main mt-1">
                        እንኳን ደህና መጡ፣ <span className="text-[#00EBD4]">{userProfile?.full_name || 'Student'}</span>!
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        የትምህርት ጉዞዎን በ Finot Academy በተግባር ይቀጥሉ!
                    </p>
                </div>

                <Link href="/courses">
                    <CustomButton variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        አዲስ ኮርስ መዝግብ
                    </CustomButton>
                </Link>
            </div>

            {/* Analytics Counter Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#FDFFFC]">{enrollments.length}</p>
                        <p className="text-xs text-gray-400">የተመዘገቡባቸው ኮርሶች</p>
                    </div>
                </GlassCard>

                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#FE0E33]/10 text-[#FE0E33] border border-[#FE0E33]/30">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#FDFFFC]">
                            {enrollments.filter((e) => e.status === 'verified').length}
                        </p>
                        <p className="text-xs text-gray-400">የተፈቀዱ/የነቁ ኮርሶች</p>
                    </div>
                </GlassCard>

                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#FDFFFC]">0</p>
                        <p className="text-xs text-gray-400">የተቀበሏቸው ሰርተፊኬቶች</p>
                    </div>
                </GlassCard>
            </div>

            {/* My Active Enrollments Section */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-[#FDFFFC] font-main flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#00EBD4]" />
                    <span>የተመዘገቧቸው ኮርሶች (Enrollment Status)</span>
                </h2>

                {enrollments.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {enrollments.map((item) => (
                            <GlassCard key={item.id} variant="default" className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                <div className="space-y-1">
                                    <h3 className="text-base font-bold text-[#FDFFFC] capitalize">
                                        {item.course_slug.replace('-', ' ')}
                                    </h3>
                                    <p className="text-xs text-gray-400">
                                        የተመዘገቡበት ቀን፡ {new Date(item.created_at).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Status Badge Mapping */}
                                <div className="flex items-center gap-3">
                                    {item.status === 'pending' && (
                                        <div className="px-3 py-1.5 rounded-xl bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 text-xs font-semibold flex items-center gap-1.5">
                                            <Clock className="w-4 h-4 animate-spin" />
                                            <span>ምዝገባውበማረጋገጥ ላይ (Pending Verification)</span>
                                        </div>
                                    )}

                                    {item.status === 'verified' && (
                                        <div className="flex items-center gap-3">
                                            <div className="px-3 py-1 rounded-xl bg-[#00EBD4]/15 border border-[#00EBD4]/40 text-[#00EBD4] text-xs font-semibold flex items-center gap-1">
                                                <CheckCircle2 className="w-4 h-4" />
                                                <span>የተፈቀደ (Verified)</span>
                                            </div>
                                            <Link href={`/student/learn/${item.course_slug}`}>
                                                <CustomButton variant="secondary" size="sm" rightIcon={<PlayCircle className="w-4 h-4" />}>
                                                    ትምህርት ጀምር
                                                </CustomButton>
                                            </Link>
                                        </div>
                                    )}

                                    {item.status === 'rejected' && (
                                        <div className="px-3 py-1.5 rounded-xl bg-[#FE0E33]/15 border border-[#FE0E33]/40 text-[#FE0E33] text-xs font-semibold flex items-center gap-1.5">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>ምዝገባው ውድቅ ተደርጓል (Rejected)</span>
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                ) : (
                    <GlassCard variant="default" className="p-8 text-center space-y-3">
                        <BookOpen className="w-10 h-10 text-gray-500 mx-auto" />
                        <p className="text-sm font-bold text-gray-300">እስካሁን የተመዘገቡበት ኮርስ የለም</p>
                        <Link href="/courses" className="inline-block pt-1">
                            <CustomButton variant="outline" size="sm">
                                ኮርሶችን ይመልከቱ
                            </CustomButton>
                        </Link>
                    </GlassCard>
                )}
            </div>
        </div>
    )
}