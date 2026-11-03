'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    Users,
    CheckSquare,
    DollarSign,
    Clock,
    ArrowRight,
    ShieldCheck,
    XCircle,
    RefreshCw,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function AdminDashboardView() {
    const supabase = createClient()

    const [stats, setStats] = useState({
        totalStudents: 0,
        pendingEnrollments: 0,
        verifiedEnrollments: 0,
        rejectedEnrollments: 0,
        totalRevenue: 0,
    })
    const [isLoading, setIsLoading] = useState(true)

    const fetchAdminStats = async () => {
        setIsLoading(true)
        try {
            // 1. የተማሪዎችን ብዛት ማወቅ
            const { count: studentCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })

            // 2. የምዝገባዎችን ሁኔታ እና የኮርስ ዋጋዎችን ማምጣት
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select(`
                    status,
                    courses:course_id (price)
                `)

            const pending = enrollments?.filter((e) => e.status === 'pending').length || 0
            const verifiedList = enrollments?.filter((e) => e.status === 'verified') || []
            const rejected = enrollments?.filter((e) => e.status === 'rejected').length || 0

            // 3. እውነተኛውን የገቢ መጠን ማስላት (Verified የሆኑትን ብቻ)
            const revenue = verifiedList.reduce((sum: number, item: any) => {
                const price = Number(item.courses?.price) || 0
                return sum + price
            }, 0)

            setStats({
                totalStudents: studentCount || 0,
                pendingEnrollments: pending,
                verifiedEnrollments: verifiedList.length,
                rejectedEnrollments: rejected,
                totalRevenue: revenue,
            })
        } catch (err) {
            console.error('Fetch Stats Error:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchAdminStats()
    }, [])

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        Admin Dashboard <span className="text-[#FE0E33]">(አጠቃላይ የቀጥታ አናሊቲክስ)</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        ከ Supabase Database የወጡ የቀጥታ የተማሪዎች፣ የክፍያዎች እና የገቢ መረጃዎች፡
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <CustomButton
                        variant="secondary"
                        size="sm"
                        onClick={fetchAdminStats}
                        isLoading={isLoading}
                        leftIcon={<RefreshCw className="w-4 h-4" />}
                    >
                        አድስ (Refresh)
                    </CustomButton>

                    <Link href="/admin-secure-finot-get/enrollments">
                        <CustomButton variant="danger" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                            Pending Enrollments ({stats.pendingEnrollments})
                        </CustomButton>
                    </Link>
                </div>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                        <Clock className="w-6 h-6 animate-pulse" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#FDFFFC]">{stats.pendingEnrollments}</p>
                        <p className="text-xs text-gray-400">የሚጠበቁ ክፍያዎች (Pending)</p>
                    </div>
                </GlassCard>

                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30">
                        <Users className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#FDFFFC]">{stats.totalStudents}</p>
                        <p className="text-xs text-gray-400">የተመዘገቡ ተማሪዎች (Profiles)</p>
                    </div>
                </GlassCard>

                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30">
                        <CheckSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#FDFFFC]">{stats.verifiedEnrollments}</p>
                        <p className="text-xs text-gray-400">የጸደቁ ክፍያዎች (Verified)</p>
                    </div>
                </GlassCard>

                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#FE0E33]/10 text-[#FE0E33] border border-[#FE0E33]/30">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#00EBD4]">
                            {stats.totalRevenue.toLocaleString()} ETB
                        </p>
                        <p className="text-xs text-gray-400">የተሰበሰበ እውነተኛ ገቢ (Real Revenue)</p>
                    </div>
                </GlassCard>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard variant="glow" className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <CheckSquare className="w-5 h-5 text-[#FE0E33]" />
                        <span>የምዝገባ ክፍያዎችን ማረጋገጫ (Enrollment Approvals)</span>
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        ተማሪዎች የላኳቸውን የ Telebirr እና CBE የክፍያ ስክሪንሾቶች (Receipts) በመመልከት በጥንድ አዝራሮች (Approve/Reject) ያጽድቁ።
                    </p>
                    <div className="flex items-center gap-3 pt-2">
                        <Link href="/admin-secure-finot-get/enrollments">
                            <CustomButton variant="danger" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                ወደ ክፍያ ማረጋገጫ ሂድ
                            </CustomButton>
                        </Link>
                        {stats.rejectedEnrollments > 0 && (
                            <span className="text-[11px] text-[#FE0E33] font-semibold flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5" />
                                {stats.rejectedEnrollments} Rejected
                            </span>
                        )}
                    </div>
                </GlassCard>

                <GlassCard variant="default" className="p-6 space-y-4">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-[#00EBD4]" />
                        <span>የተማሪዎች ቁጥጥር እና ማስታወቂያዎች</span>
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed">
                        የተማሪዎችን መረጃ ለማስተካከል፣ Unique ID ለማመንጨት ወይም በመነሻ ገፁ ላይ ማስታወቂያዎችን ለመስቀል የመቆጣጠሪያ ክፍሎችን ይጠቀሙ።
                    </p>
                    <Link href="/admin-secure-finot-get/students" className="inline-block pt-2">
                        <CustomButton variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                            ተማሪዎችን አስተዳድር
                        </CustomButton>
                    </Link>
                </GlassCard>
            </div>
        </div>
    )
}