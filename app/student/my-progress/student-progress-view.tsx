'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, BookOpen, CheckCircle2, Clock } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

export default function StudentProgressView() {
    const progressList = [
        {
            id: 1,
            courseTitle: 'Graphics Design Masterclass',
            totalLessons: 5,
            completedLessons: 5,
            percentage: 100,
        },
        {
            id: 2,
            courseTitle: 'Video Editing & Motion Graphics',
            totalLessons: 5,
            completedLessons: 2,
            percentage: 40,
        },
    ]

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የትምህርት እድገት <span className="text-[#00EBD4]">(My Progress)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    በእያንዳንዱ ኮርስ ላይ ያሳዩትን አጠቃላይ የትምህርት ሽፋን ሁኔታ፡
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {progressList.map((item) => (
                    <GlassCard key={item.id} variant="default" className="p-6 space-y-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div>
                                <h3 className="text-lg font-bold text-white">{item.courseTitle}</h3>
                                <p className="text-xs text-gray-400">
                                    የተጠናቀቁ ሌሰኖች፡ <strong className="text-[#00EBD4]">{item.completedLessons}</strong> ከ {item.totalLessons}
                                </p>
                            </div>

                            <span className="text-xl font-extrabold text-[#00EBD4]">
                                {item.percentage}%
                            </span>
                        </div>

                        {/* Custom Glowing Progress Bar */}
                        <div className="w-full bg-white/10 h-3 rounded-full overflow-hidden p-0.5 border border-white/10">
                            <div
                                className="bg-gradient-to-r from-[#00EBD4] to-[#FE0E33] h-full rounded-full transition-all duration-500"
                                style={{ width: `${item.percentage}%` }}
                            />
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}