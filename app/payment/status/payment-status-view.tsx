'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, AlertCircle, ArrowRight, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function PaymentStatusView() {
    const supabase = createClient()
    const [enrollments, setEnrollments] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const checkStatus = async () => {
        setIsLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            const { data } = await supabase
                .from('enrollments')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            setEnrollments(data || [])
        }
        setIsLoading(false)
    }

    useEffect(() => {
        checkStatus()
    }, [])

    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">

                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                            የክፍያ ሁኔታ መከታተያ <span className="text-[#00EBD4]">(Status)</span>
                        </h1>
                        <p className="text-xs text-gray-400 mt-1">
                            የላኩት የክፍያ ማረጋገጫ በአድሚን ቡድናችን የመጽደቅ ሁኔታ፡
                        </p>
                    </div>

                    <button
                        onClick={checkStatus}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#00EBD4] border border-white/10 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        <span>አድስ (Refresh)</span>
                    </button>
                </div>

                {enrollments.length > 0 ? (
                    <div className="space-y-4">
                        {enrollments.map((item) => (
                            <GlassCard key={item.id} variant="default" className="p-6 space-y-4">
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div>
                                        <span className="text-[10px] font-bold text-[#00EBD4] uppercase tracking-wider">
                                            Course Enrollment
                                        </span>
                                        <h3 className="text-lg font-bold text-white capitalize">
                                            {item.course_slug.replace('-', ' ')}
                                        </h3>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            የተላከበት ቀን፡ {new Date(item.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    {item.status === 'pending' && (
                                        <div className="px-3.5 py-2 rounded-xl bg-yellow-500/15 border border-yellow-500/40 text-yellow-400 text-xs font-semibold flex items-center gap-2">
                                            <Clock className="w-4 h-4 animate-spin" />
                                            <span>በማረጋገጥ ላይ (Pending)</span>
                                        </div>
                                    )}

                                    {item.status === 'verified' && (
                                        <div className="px-3.5 py-2 rounded-xl bg-[#00EBD4]/15 border border-[#00EBD4]/40 text-[#00EBD4] text-xs font-semibold flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>ጸድቋል (Verified)</span>
                                        </div>
                                    )}

                                    {item.status === 'rejected' && (
                                        <div className="px-3.5 py-2 rounded-xl bg-[#FE0E33]/15 border border-[#FE0E33]/40 text-[#FE0E33] text-xs font-semibold flex items-center gap-2">
                                            <AlertCircle className="w-4 h-4" />
                                            <span>ውድቅ ተደርጓል (Rejected)</span>
                                        </div>
                                    )}
                                </div>

                                {item.status === 'verified' && (
                                    <div className="pt-2 border-t border-white/10 flex justify-end">
                                        <Link href={`/student/learn/${item.course_slug}`}>
                                            <CustomButton variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                                ወደ ትምህርቱ ሂድ (Start Learning)
                                            </CustomButton>
                                        </Link>
                                    </div>
                                )}
                            </GlassCard>
                        ))}
                    </div>
                ) : (
                    <GlassCard variant="default" className="p-10 text-center space-y-3">
                        <Clock className="w-10 h-10 text-gray-500 mx-auto" />
                        <p className="text-sm font-bold text-white">ምንም የተላከ የክፍያ ማረጋገጫ የለም</p>
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