'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
    Users,
    CheckSquare,
    BookOpen,
    DollarSign,
    Clock,
    ArrowRight,
    TrendingUp,
    ShieldCheck,
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
        totalRevenue: 0,
    })

    useEffect(() => {
        async function fetchAdminStats() {
            // 1. Fetch Students count
            const { count: studentCount } = await supabase
                .from('profiles')
                .select('*', { count: 'exact', head: true })

            // 2. Fetch Enrollments count by status
            const { data: enrollments } = await supabase
                .from('enrollments')
                .select('status')

            const pending = enrollments?.filter((e) => e.status === 'pending').length || 0
            const verified = enrollments?.filter((e) => e.status === 'verified').length || 0

            setStats({
                totalStudents: studentCount || 0,
                pendingEnrollments: pending,
                verifiedEnrollments: verified,
                totalRevenue: verified * 4200, // Estimated aggregate
            })
        }

        fetchAdminStats()
    }, [])

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        Admin Dashboard <span className="text-[#FE0E33]">(አጠቃላይ አናሊቲክስ)</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        የ Finot Academy የተማሪዎች ብዛት፣ ክፍያዎች እና አጠቃላይ የሲስተሙ ሁኔታ፡
                    </p>
                </div>

                <Link href="/admin-secure-finot-get/enrollments">
                    <CustomButton variant="danger" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                        Pending Enrollments ({stats.pendingEnrollments})
                    </CustomButton>
                </Link>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-yellow-500/10 text-yellow-400 border border-yellow-500/30">
                        <Clock className="w-6 h-6 animate-spin" />
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
                        <p className="text-xs text-gray-400">የተመዘገቡ ተማሪዎች (Total)</p>
                    </div>
                </GlassCard>

                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#FE0E33]/10 text-[#FE0E33] border border-[#FE0E33]/30">
                        <CheckSquare className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#FDFFFC]">{stats.verifiedEnrollments}</p>
                        <p className="text-xs text-gray-400">የጸደቁ ክፍያዎች (Verified)</p>
                    </div>
                </GlassCard>

                <GlassCard variant="default" className="p-5 flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30">
                        <DollarSign className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-2xl font-extrabold text-[#00EBD4]">
                            {stats.totalRevenue.toLocaleString()} ETB
                        </p>
                        <p className="text-xs text-gray-400">አጠቃላይ ገቢ (Total Revenue)</p>
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
                    <Link href="/admin-secure-finot-get/enrollments" className="inline-block pt-2">
                        <CustomButton variant="danger" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                            ወደ ክፍያ ማረጋገጫ ሂድ
                        </CustomButton>
                    </Link>
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