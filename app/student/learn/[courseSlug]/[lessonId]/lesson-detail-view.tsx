'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    CheckCircle2,
    FileText,
    PlayCircle,
    Sparkles,
    ChevronRight,
    ChevronLeft,
    BookOpen,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ProtectedVideoPlayer } from '@/components/protected-video-player'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

interface LessonDetailViewProps {
    courseSlug: string
    lessonId: string
}

export default function LessonDetailView({
    courseSlug,
    lessonId,
}: LessonDetailViewProps) {
    const supabase = createClient()
    const [studentProfile, setStudentProfile] = useState<any>(null)
    const [isCompleted, setIsCompleted] = useState(false)

    // Mock database mapping for individual lesson detail view
    const lessonData: Record<string, any> = {
        'mod-1': {
            title: 'Introduction to Design Fundamentals',
            videoUrl: 'https://youtu.be/GQS7wPujL2k',
            description:
                'በዚህ ሌሰን የዲዛይን መሰረታዊ ህጎችን፣ የቀለም መዋቅርን (Color Theory) እና የስራ ቦታ ማስተካከያን በተግባር እናያለን።',
            resources: [
                { name: 'Color Palette Guide.pdf', size: '1.2 MB' },
                { name: 'Design Assets Checklist.pdf', size: '850 KB' },
            ],
        },
        'mod-2': {
            title: 'Adobe Photoshop Basics',
            videoUrl: 'https://youtu.be/uSUpLsZTrdM',
            description:
                'የ Photoshop ሶፍትዌር መቆጣጠሪያዎች፣ Layer Masks እና Selection Tools አጠቃቀም።',
            resources: [{ name: 'Practice Project Files.zip', size: '15.4 MB' }],
        },
    }

    const lesson = lessonData[lessonId] || lessonData['mod-1']

    useEffect(() => {
        async function loadUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                setStudentProfile(
                    profile || {
                        full_name: user.email?.split('@')[0] || 'Finot Student',
                        unique_id: 'FINOT-USER',
                        phone: '+251900000000',
                    }
                )
            }
        }
        loadUser()
    }, [])

    return (
        <div className="space-y-6">
            {/* Header Navigation */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <Link href={`/student/learn/${courseSlug}`}>
                    <button className="flex items-center gap-2 text-xs font-semibold text-gray-300 hover:text-[#00EBD4] transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>ወደ ኮርሱ ዝርዝር ተመለስ</span>
                    </button>
                </Link>

                <span className="text-xs font-mono text-[#00EBD4] bg-[#00EBD4]/10 px-3 py-1 rounded-full border border-[#00EBD4]/30">
                    Lesson ID: {lessonId}
                </span>
            </div>

            {/* Video Player */}
            <div className="space-y-4">
                <ProtectedVideoPlayer
                    youtubeUrl={lesson.videoUrl}
                    studentName={studentProfile?.full_name || 'Finot Student'}
                    studentUniqueId={studentProfile?.unique_id || 'FINOT-USER'}
                    studentPhone={studentProfile?.phone || '+251900000000'}
                />

                {/* Lesson Info Header */}
                <GlassCard variant="default" className="p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-[#FDFFFC] font-main">
                                {lesson.title}
                            </h1>
                            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                                {lesson.description}
                            </p>
                        </div>

                        <CustomButton
                            variant={isCompleted ? 'outline' : 'secondary'}
                            size="sm"
                            onClick={() => setIsCompleted(!isCompleted)}
                            leftIcon={<CheckCircle2 className="w-4 h-4 text-[#00EBD4]" />}
                        >
                            {isCompleted ? 'ተጠናቋል (Completed)' : 'እንደ ተጠናቀቀ ምዝግብ'}
                        </CustomButton>
                    </div>
                </GlassCard>

                {/* Downloadable Resources & Notes Section */}
                <GlassCard variant="glow" className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <FileText className="w-5 h-5 text-[#00EBD4]" />
                        <span>የሌሰኑ ፋይሎች እና ማስታወሻዎች (Lesson Resources)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {lesson.resources.map((res: any, idx: number) => (
                            <div
                                key={idx}
                                className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs"
                            >
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-[#FE0E33]" />
                                    <span className="font-semibold text-white">{res.name}</span>
                                </div>
                                <span className="text-[10px] text-gray-400 font-mono">
                                    {res.size}
                                </span>
                            </div>
                        ))}
                    </div>
                </GlassCard>

                {/* Previous / Next Lesson Footer Buttons */}
                <div className="flex items-center justify-between pt-2">
                    <CustomButton
                        variant="outline"
                        size="sm"
                        leftIcon={<ChevronLeft className="w-4 h-4" />}
                    >
                        ያለፈው ሌሰን
                    </CustomButton>
                    <CustomButton
                        variant="primary"
                        size="sm"
                        rightIcon={<ChevronRight className="w-4 h-4" />}
                    >
                        ቀጣይ ሌሰን
                    </CustomButton>
                </div>
            </div>
        </div>
    )
}