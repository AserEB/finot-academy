'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, PlayCircle, Clock, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function MyCoursesView() {
    const supabase = createClient()
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadMyCourses() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const { data, error } = await supabase
                    .from('enrollments')
                    .select('*, courses(title, slug, description)')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false })

                if (!error && data) {
                    setEnrolledCourses(data)
                }
            } catch (err) {
                console.error('Error loading enrolled courses:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadMyCourses()
    }, [supabase])

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የኔ ኮርሶች <span className="text-[#00EBD4]">(My Courses)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    የተመዘገቡባቸው እና የተፈቀዱልዎ የስልጠና ኮርሶች ዝርዝር፡
                </p>
            </div>

            {isLoading ? (
                <div className="text-center py-12 text-xs text-gray-400">መረጃዎች እየተጫኑ ነው...</div>
            ) : enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((item) => {
                        const courseSlug = item.courses?.slug || item.course_slug || ''
                        const courseTitle = item.courses?.title || courseSlug.replace('-', ' ')
                        const uniqueId = item.unique_student_id || 'FINOT-STUDENT'

                        const getStatusBadge = () => {
                            if (item.status === 'verified') {
                                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#00EBD4]/20 text-[#00EBD4]">Verified</span>
                            }
                            if (item.status === 'rejected') {
                                return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FE0E33]/20 text-[#FE0E33]">Rejected</span>
                            }
                            return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400">Pending</span>
                        }

                        return (
                            <GlassCard key={item.id} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                                        <span className="text-[10px] font-bold text-[#00EBD4] uppercase tracking-wider flex items-center gap-1 font-mono">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>ID: {uniqueId}</span>
                                        </span>
                                        {getStatusBadge()}
                                    </div>

                                    <h3 className="text-lg font-bold text-white capitalize font-main">
                                        {courseTitle}
                                    </h3>

                                    <p className="text-xs text-gray-400">
                                        የተመዘገቡበት ቀን፡ {new Date(item.created_at).toLocaleDateString()}
                                    </p>

                                    {item.status === 'rejected' && item.rejection_reason && (
                                        <p className="text-xs text-[#FE0E33] bg-[#FE0E33]/10 p-2.5 rounded-xl border border-[#FE0E33]/30">
                                            ምክንያት፡ {item.rejection_reason}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                                    {item.status === 'verified' && (
                                        <Link href={`/student/learn/${courseSlug}`} className="w-full">
                                            <CustomButton variant="primary" fullWidth size="sm" rightIcon={<PlayCircle className="w-4 h-4" />}>
                                                ትምህርቱን ቀጥል (Watch Video)
                                            </CustomButton>
                                        </Link>
                                    )}

                                    {item.status === 'pending' && (
                                        <div className="w-full text-center py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5">
                                            <Clock className="w-4 h-4 animate-spin" />
                                            <span>በማረጋገጥ ላይ (Pending Approval)</span>
                                        </div>
                                    )}

                                    {item.status === 'rejected' && (
                                        <Link href={`/payment/enroll/${courseSlug}`} className="w-full">
                                            <CustomButton variant="danger" fullWidth size="sm" rightIcon={<AlertCircle className="w-4 h-4" />}>
                                                ድጋሚ ያመልክቱ (Re-apply)
                                            </CustomButton>
                                        </Link>
                                    )}
                                </div>
                            </GlassCard>
                        )
                    })}
                </div>
            ) : (
                <GlassCard variant="default" className="p-10 text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-gray-500 mx-auto" />
                    <p className="text-base font-bold text-white">እስካሁን የተመዘገቡበት ኮርስ የለም</p>
                    <p className="text-xs text-gray-400">ተፈላጊ የዲጂታል ክህሎቶችን ለመማር አሁኑኑ ኮርሶችን ይመልከቱ።</p>
                    <Link href="/courses" className="inline-block pt-2">
                        <CustomButton variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                            ኮርሶችን ይመልከቱ (Explore Courses)
                        </CustomButton>
                    </Link>
                </GlassCard>
            )}
        </div>
    )
}