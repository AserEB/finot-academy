'use client'

import React, { useEffect, useState } from 'react'
import { BookOpen, Plus, Edit, DollarSign, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function ManageCoursesView() {
    const supabase = createClient()
    const [courses, setCourses] = useState<any[]>([])

    useEffect(() => {
        async function fetchCourses() {
            const { data } = await supabase.from('courses').select('*')
            setCourses(data || [])
        }
        fetchCourses()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        የኮርሶች አስተዳደር <span className="text-[#FE0E33]">(Manage Courses)</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        በ Finot Academy የሚሰጡ 4ቱ ኮርሶች ዝርዝር እና ዋጋዎች፡
                    </p>
                </div>
                <CustomButton variant="danger" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    አዲስ ኮርስ ጨምር
                </CustomButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {courses.map((c) => (
                    <GlassCard key={c.id} variant="default" className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold text-white">{c.title}</h3>
                            <span className="text-sm font-extrabold text-[#00EBD4] font-mono">
                                {c.price?.toLocaleString()} ETB
                            </span>
                        </div>
                        <p className="text-xs text-gray-300 line-clamp-2">{c.description}</p>
                        <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                            <span className="text-[11px] text-gray-400">Slug: {c.slug}</span>
                            <button className="p-2 rounded-lg bg-white/10 text-xs text-[#00EBD4] hover:bg-white/20 transition-colors flex items-center gap-1">
                                <Edit className="w-3.5 h-3.5" />
                                <span>አስተካክል።</span>
                            </button>
                        </div>
                    </GlassCard>
                ))}
            </div>
        </div>
    )
}