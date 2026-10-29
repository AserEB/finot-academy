'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ProtectedVideoPlayer } from '@/components/protected-video-player'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'
import { createClient } from '@/lib/supabase/client'
import {
    PlayCircle,
    CheckCircle2,
    Lock,
    ArrowLeft,
    BookOpen,
    Award,
    Sparkles,
} from 'lucide-react'

interface CoursePlayerViewProps {
    courseSlug: string
}

export default function CoursePlayerView({ courseSlug }: CoursePlayerViewProps) {
    const supabase = createClient()
    const [studentProfile, setStudentProfile] = useState<any>(null)
    const [activeLesson, setActiveLesson] = useState<any>(null)
    const [completedLessons, setCompletedLessons] = useState<string[]>([])

    const courseDataMap: Record<string, any> = {
        'graphics-design': {
            title: 'Graphics Design Masterclass',
            modules: [
                { id: 'mod-1', number: 1, title: 'Introduction to Graphic Design & Design Fundamentals', url: 'https://youtu.be/GQS7wPujL2k' },
                { id: 'mod-2', number: 2, title: 'Adobe Photoshop - Photo Editing & Manipulation', url: 'https://youtu.be/uSUpLsZTrdM' },
                { id: 'mod-3', number: 3, title: 'Adobe Photoshop - Creative Design & Digital Artwork', url: 'https://youtu.be/HHRHVaerKtE' },
                { id: 'mod-4', number: 4, title: 'Adobe Illustrator - Vector Graphics & Illustration', url: 'https://youtu.be/3NBKRYwEbNs' },
                { id: 'mod-5', number: 5, title: 'Professional Branding & Real-World Design Projects', url: 'https://youtu.be/y_2P5o_msuo' },
            ],
        },
        'video-editing': {
            title: 'Video Editing & Motion Graphics',
            modules: [
                { id: 'mod-1', number: 1, title: 'Introduction to Video Editing & Adobe Premiere Pro', url: 'https://youtu.be/oUlpbue-Gw0' },
                { id: 'mod-2', number: 2, title: 'Basic Video Editing & Timeline Techniques', url: 'https://youtu.be/954L0eVIdaE' },
                { id: 'mod-3', number: 3, title: 'Color Correction & Color Grading', url: 'https://youtu.be/TMnBLZy3WFg' },
                { id: 'mod-4', number: 4, title: 'Audio Editing, Effects & Motion Graphics', url: 'https://youtu.be/bDf477GaMtA' },
                { id: 'mod-5', number: 5, title: 'Advanced Editing, Exporting & Real-World Projects', url: 'https://www.youtube.com/live/wEFRWiKr0BM' },
            ],
        },
        'smm-marketing': {
            title: 'Social Media Marketing (SMM)',
            modules: [
                { id: 'mod-1', number: 1, title: 'Introduction to Social Media Marketing (SMM)', url: 'https://youtu.be/I2pwcAVonKI' },
                { id: 'mod-2', number: 2, title: 'Content Creation & Social Media Management', url: 'https://youtu.be/y-n1RUbYq6Q' },
                { id: 'mod-3', number: 3, title: 'Social Media Advertising, Analytics & Growth', url: 'https://youtu.be/I2pwcAVonKI' },
            ],
        },
        'prompt-engineering': {
            title: 'Prompt Engineering & Generative AI',
            modules: [
                { id: 'mod-1', number: 1, title: 'Introduction to Prompt Engineering & Generative AI', url: 'https://youtu.be/_ZvnD73m400' },
                { id: 'mod-2', number: 2, title: 'Prompt Writing Techniques & Frameworks', url: 'https://youtu.be/P08jrZhyNxw' },
                { id: 'mod-3', number: 3, title: 'Advanced Prompt Engineering & AI Tools', url: 'https://youtu.be/pwWBcsxEoLk' },
                { id: 'mod-4', number: 4, title: 'Practical AI Applications & Real-World Projects', url: 'https://youtu.be/pwWBcsxEoLk' },
            ],
        },
    }

    const course = courseDataMap[courseSlug] || courseDataMap['graphics-design']

    useEffect(() => {
        async function loadUser() {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                setStudentProfile(profile || {
                    full_name: user.email?.split('@')[0] || 'Finot Student',
                    unique_id: 'FINOT-USER',
                    phone: '+251900000000',
                })
            }
        }
        loadUser()
        setActiveLesson(course.modules[0])
    }, [courseSlug])

    const toggleLessonComplete = (id: string) => {
        if (completedLessons.includes(id)) {
            setCompletedLessons(completedLessons.filter((item) => item !== id))
        } else {
            setCompletedLessons([...completedLessons, id])
        }
    }

    const progressPercentage = Math.round(
        (completedLessons.length / course.modules.length) * 100
    )

    return (
        <div className="space-y-6">
            {/* Top Header Navigation */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <Link href="/student/my-courses">
                        <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:text-white transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-bold text-[#FDFFFC] font-main">
                            {course.title}
                        </h1>
                        <p className="text-xs text-[#00EBD4]">
                            {completedLessons.length} of {course.modules.length} Lessons Completed ({progressPercentage}%)
                        </p>
                    </div>
                </div>

                {progressPercentage >= 80 && (
                    <Link href="/student/certificates">
                        <CustomButton variant="primary" size="sm" leftIcon={<Award className="w-4 h-4" />}>
                            የምስክር ወረቀት ተቀበል (80%+)
                        </CustomButton>
                    </Link>
                )}
            </div>

            {/* Main Video Player & Lesson List Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Video Player Container */}
                <div className="lg:col-span-2 space-y-4">
                    {activeLesson && (
                        <div className="space-y-3">
                            <ProtectedVideoPlayer
                                youtubeUrl={activeLesson.url}
                                studentName={studentProfile?.full_name || 'Finot Student'}
                                studentUniqueId={studentProfile?.unique_id || 'FINOT-USER'}
                                studentPhone={studentProfile?.phone || '+251900000000'}
                            />

                            <GlassCard variant="default" className="p-5 flex items-center justify-between gap-4">
                                <div>
                                    <span className="text-xs font-mono text-[#00EBD4]">
                                        Module {activeLesson.number}
                                    </span>
                                    <h3 className="text-lg font-bold text-[#FDFFFC]">
                                        {activeLesson.title}
                                    </h3>
                                </div>

                                <CustomButton
                                    variant={completedLessons.includes(activeLesson.id) ? 'outline' : 'secondary'}
                                    size="sm"
                                    onClick={() => toggleLessonComplete(activeLesson.id)}
                                    leftIcon={<CheckCircle2 className="w-4 h-4 text-[#00EBD4]" />}
                                >
                                    {completedLessons.includes(activeLesson.id)
                                        ? 'ተጠናቋል (Marked Done)'
                                        : 'እንደ ተጠናቀቀ ምዝግብ'}
                                </CustomButton>
                            </GlassCard>
                        </div>
                    )}
                </div>

                {/* Lesson Modules Sidebar */}
                <div className="lg:col-span-1 space-y-3">
                    <h3 className="text-sm font-bold text-[#FDFFFC] flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-[#00EBD4]" />
                        <span>የኮርሱ ሞጁሎች (Lessons List)</span>
                    </h3>

                    <div className="space-y-2">
                        {course.modules.map((mod: any) => {
                            const isActive = activeLesson?.id === mod.id
                            const isDone = completedLessons.includes(mod.id)
                            return (
                                <GlassCard
                                    key={mod.id}
                                    variant={isActive ? 'glow' : 'default'}
                                    onClick={() => setActiveLesson(mod)}
                                    className={`p-4 cursor-pointer transition-all flex items-center justify-between gap-3 ${isActive ? 'border-[#00EBD4]' : ''
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg text-xs font-bold ${isActive ? 'bg-[#00EBD4] text-[#000E23]' : 'bg-white/5 text-[#00EBD4]'
                                            }`}>
                                            M{mod.number}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-white line-clamp-1">{mod.title}</h4>
                                            <p className="text-[10px] text-gray-400">Video Lesson</p>
                                        </div>
                                    </div>

                                    {isDone && (
                                        <CheckCircle2 className="w-4 h-4 text-[#00EBD4] shrink-0" />
                                    )}
                                </GlassCard>
                            )
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}