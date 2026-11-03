'use client'

import React, { useEffect, useState } from 'react'
import { Bell, CheckCircle2, AlertCircle, Megaphone } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'

export default function NotificationsView() {
    const supabase = createClient()
    const [notifications, setNotifications] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function loadNotifications() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                const items: any[] = []
                let userStatus: string | null = null

                // 1. Fetch User Enrollment status updates (Verified or Rejected)
                const { data: enrollData } = await supabase
                    .from('enrollments')
                    .select('*, courses(title)')
                    .eq('user_id', user.id)

                if (enrollData) {
                    enrollData.forEach((item) => {
                        const courseTitle = item.courses?.title || item.course_slug?.replace('-', ' ') || 'Course'

                        if (item.status === 'verified') {
                            userStatus = 'verified'
                            items.push({
                                id: `enroll-verified-${item.id}`,
                                title: 'የምዝገባ ማረጋገጫ (Enrollment Approved)',
                                message: `ለ "${courseTitle}" ያደረጉት የክፍያ ማረጋገጫ ጸድቋል! አሁኑኑ መማር መጀመር ይችላሉ።`,
                                date: new Date(item.updated_at || item.created_at).toLocaleString(),
                                rawDate: new Date(item.updated_at || item.created_at),
                                type: 'success',
                            })
                        } else if (item.status === 'rejected') {
                            userStatus = 'rejected'
                            items.push({
                                id: `enroll-rejected-${item.id}`,
                                title: 'የምዝገባ ጥያቄ ውድቅ ተደርጓል (Enrollment Rejected)',
                                message: `ለ "${courseTitle}" ያደረጉት ምዝገባ ውድቅ ተደርጓል። ምክንያት፡ ${item.rejection_reason || 'ተቀባይነት ያለው የክፍያ ደረሰኝ አልተያያዘም።'}`,
                                date: new Date(item.updated_at || item.created_at).toLocaleString(),
                                rawDate: new Date(item.updated_at || item.created_at),
                                type: 'rejected',
                            })
                        }
                    })
                }

                // 2. Fetch Active System Announcements from Admin
                const { data: announceData } = await supabase
                    .from('announcements')
                    .select('*')
                    .eq('is_active', true)

                if (announceData) {
                    announceData.forEach((ann) => {
                        const isRelevant =
                            ann.target_audience === 'all' ||
                            (ann.target_audience === 'enrolled' && userStatus === 'verified') ||
                            (ann.target_audience === 'rejected' && userStatus === 'rejected')

                        if (isRelevant) {
                            items.push({
                                id: `announcement-${ann.id}`,
                                title: ann.title,
                                message: ann.message,
                                date: new Date(ann.created_at).toLocaleString(),
                                rawDate: new Date(ann.created_at),
                                type: 'info',
                                isPinned: ann.is_pinned_banner,
                            })
                        }
                    })
                }

                // Sort by date (newest first)
                items.sort((a, b) => b.rawDate.getTime() - a.rawDate.getTime())
                setNotifications(items)

                // 3. ተማሪው ሁሉንም እንዳየ (Read) አድርጎ መመዝገብ
                const allIds = items.map((i) => i.id)
                localStorage.setItem('finot_read_notifications', JSON.stringify(allIds))
                window.dispatchEvent(new Event('storage'))

            } catch (err) {
                console.error('Error loading notifications:', err)
            } finally {
                setIsLoading(false)
            }
        }

        loadNotifications()
    }, [supabase])

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    ማሳወቂያዎች <span className="text-[#00EBD4]">(Notifications)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    ከ Finot Academy አድሚኖች የተላኩልዎ እውነተኛ ማሳወቂያዎች እና የምዝገባ ሁኔታዎች፡
                </p>
            </div>

            {isLoading ? (
                <div className="py-16 text-center text-gray-400 text-xs">
                    ማሳወቂያዎች እየተጫኑ ነው...
                </div>
            ) : notifications.length > 0 ? (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <GlassCard key={n.id} variant="default" className="p-5 flex items-start gap-4">
                            {n.type === 'success' && (
                                <div className="p-2.5 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30 shrink-0">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                            )}

                            {n.type === 'rejected' && (
                                <div className="p-2.5 rounded-xl bg-[#FE0E33]/10 text-[#FE0E33] border border-[#FE0E33]/30 shrink-0">
                                    <AlertCircle className="w-5 h-5" />
                                </div>
                            )}

                            {n.type === 'info' && (
                                <div className="p-2.5 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30 shrink-0">
                                    <Megaphone className="w-5 h-5" />
                                </div>
                            )}

                            <div className="space-y-1 w-full">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                                        <span>{n.title}</span>
                                        {n.isPinned && (
                                            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#FE0E33] text-white rounded-full">
                                                Pinned
                                            </span>
                                        )}
                                    </h4>
                                    <span className="text-[10px] text-gray-400 font-mono">{n.date}</span>
                                </div>
                                <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <GlassCard variant="default" className="p-8 text-center space-y-3">
                    <Bell className="w-10 h-10 text-gray-500 mx-auto" />
                    <p className="text-sm font-bold text-gray-300">ምንም አይነት አዲስ ማሳወቂያ የለም</p>
                </GlassCard>
            )}
        </div>
    )
}