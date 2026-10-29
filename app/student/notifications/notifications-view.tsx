'use client'

import React from 'react'
import { Bell, CheckCircle2, Info, Sparkles } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

export default function NotificationsView() {
    const notifications = [
        {
            id: 1,
            title: 'የምዝገባ ማረጋገጫ (Enrollment Approved)',
            message: 'ለ Graphics Design Masterclass ያደረጉት የክፍያ ማረጋገጫ ጸድቋል! አሁኑኑ መማር መጀመር ይችላሉ።',
            date: 'Today, 10:30 AM',
            type: 'success',
        },
        {
            id: 2,
            title: 'እንኳን ወደ Finot Academy በደህና መጡ!',
            message: 'አካውንትዎ በስኬት ተፈጥሯል። የዲጂታል ክህሎቶችን ለማዳበር ዝግጁ ይሁኑ።',
            date: 'Yesterday',
            type: 'info',
        },
    ]

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    ማሳወቂያዎች <span className="text-[#00EBD4]">(Notifications)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    ከ Finot Academy አድሚኖች የተላኩልዎ ማሳወቂያዎች፡
                </p>
            </div>

            <div className="space-y-3">
                {notifications.map((n) => (
                    <GlassCard key={n.id} variant="default" className="p-5 flex items-start gap-4">
                        <div className="p-2.5 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30 shrink-0">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                            <div className="flex items-center justify-between gap-4">
                                <h4 className="text-sm font-bold text-white">{n.title}</h4>
                                <span className="text-[10px] text-gray-400">{n.date}</span>
                            </div>
                            <p className="text-xs text-gray-300 leading-relaxed">{n.message}</p>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}