'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { BookOpen, PlayCircle, Clock } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function MyCoursesView() {
    const supabase = createClient()
    const [enrolledCourses, setEnrolledCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadMyCourses() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return

            const { data } = await supabase
                .from('enrollments')
                .select('*')
                .eq('user_id', user.id)

            setEnrolledCourses(data || [])
            setIsLoading(false)
        }

        loadMyCourses()
    }, [])

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

            {enrolledCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {enrolledCourses.map((item) => (
                        <GlassCard key={item.id} variant="interactive" className="p-6 space-y-4 flex flex-col justify-between">
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-[#00EBD4] uppercase tracking-wider">
                                    Enrolled Course
                                </span>
                                <h3 className="text-lg font-bold text-white capitalize">
                                    {item.course_slug.replace('-', ' ')}
                                </h3>
                                <p className="text-xs text-gray-400">
                                    የተመዘገቡበት ቀን፡ {new Date(item.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                                {item.status === 'verified' ? (
                                    <Link href={`/student/learn/${item.course_slug}`} className="w-full">
                                        <CustomButton variant="primary" fullWidth size="sm" rightIcon={<PlayCircle className="w-4 h-4" />}>
                                            ትምህርቱን ቀጥል (Watch Video)
                                        </CustomButton>
                                    </Link>
                                ) : (
                                    <div className="w-full text-center py-2 bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5">
                                        <Clock className="w-4 h-4 animate-spin" />
                                        <span>በማረጋገጥ ላይ (Pending Admin Approval)</span>
                                    </div>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <GlassCard variant="default" className="p-10 text-center space-y-4">
                    <BookOpen className="w-12 h-12 text-gray-500 mx-auto" />
                    <p className="text-base font-bold text-white">እስካሁን የተመዘገቡበት ኮርስ የለም</p>
                    <p className="text-xs text-gray-400">ተፈላጊ የዲጂታል ክህሎቶችን ለመማር አሁኑኑ ኮርሶችን ይመልከቱ።</p>
                    <Link href="/courses" className="inline-block pt-2">
                        <CustomButton variant="primary" size="md">
                            ኮርሶችን ይመልከቱ (Explore Courses)
                        </CustomButton>
                    </Link>
                </GlassCard>
            )}
        </div>
    )
}