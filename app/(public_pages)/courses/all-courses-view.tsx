'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, Palette, Video, Share2, Cpu, Sparkles } from 'lucide-react'
import { CourseCardItem } from '@/components/course-card-item'
import { CustomInput } from '@/components/ui/custom-input'
import { GlassCard } from '@/components/ui/glass-card'

export default function AllCoursesView() {
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')

    // The 4 Core Courses with exact prices and details from Blueprint
    const allCourses = [
        {
            id: '1',
            title: 'Graphics Design',
            slug: 'graphics-design',
            category: 'design',
            description:
                'Learn Adobe Photoshop & Illustrator from basic principles, photo manipulation, vector graphics to real-world branding projects.',
            price: 4200,
            instructorName: 'Bereket & Team',
            enrolledCount: 142,
            imageSrc: '/assets/images/course-placeholders/graphics-design.jpg',
        },
        {
            id: '2',
            title: 'Video Editing',
            slug: 'video-editing',
            description:
                'Master Premiere Pro, timeline cutting, Lumetri color grading, motion graphics, audio syncing, and YouTube/Reels video export.',
            price: 7000,
            category: 'video',
            instructorName: 'Nuhamin & Team',
            enrolledCount: 98,
            imageSrc: '/assets/images/course-placeholders/video-editing.jpg',
        },
        {
            id: '3',
            title: 'Social Media Marketing (SMM)',
            slug: 'smm-marketing',
            category: 'marketing',
            description:
                'Master paid advertisement campaigns, targeted audience creation, content creation calendars, analytics, and social growth.',
            price: 3500,
            instructorName: 'Biruk & Team',
            enrolledCount: 185,
            imageSrc: '/assets/images/course-placeholders/smm-marketing.jpg',
        },
        {
            id: '4',
            title: 'Prompt Engineering',
            slug: 'prompt-engineering',
            category: 'ai',
            description:
                'Master ChatGPT, Gemini, Claude, zero-shot/few-shot prompting frameworks, AI content strategy, and automated task workflows.',
            price: 2500,
            instructorName: 'Lidet & Team',
            enrolledCount: 210,
            imageSrc: '/assets/images/course-placeholders/prompt-engineering.jpg',
        },
    ]

    // Search and Category Filter Logic
    const filteredCourses = allCourses.filter((course) => {
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory =
            selectedCategory === 'all' || course.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-10 left-10 w-96 h-96 bg-[#00EBD4]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#FE0E33]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

                {/* Header Section */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#000E23]/80 border border-[#00EBD4]/30 text-[#00EBD4] text-xs font-semibold"
                    >
                        <BookOpen className="w-4 h-4 text-[#FE0E33]" />
                        <span>Finot Academy Course Catalog</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl sm:text-5xl font-extrabold text-[#FDFFFC] font-main"
                    >
                        የምናቀርባቸው <span className="text-[#00EBD4]">ኮርሶች (All Courses)</span>
                    </motion.h1>

                    <p className="text-sm text-[#FDFFFC]/80 leading-relaxed font-secondary">
                        ተግባራዊና ዘመናዊ የዲጂታል ክህሎቶችን ይማሩ። ፍላጎትዎ ያለበትን ኮርስ መርጠው አሁኑኑ ይመዝገቡ!
                    </p>
                </div>

                {/* Search & Filter Bar Section */}
                <GlassCard variant="default" className="p-4 sm:p-6 space-y-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">

                        {/* Search Input */}
                        <div className="w-full md:w-96">
                            <CustomInput
                                placeholder="ኮርስ በስም ወይም በይዘት ፈልግ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                leftIcon={<Search className="w-4 h-4 text-[#00EBD4]" />}
                            />
                        </div>

                        {/* Category Filter Buttons */}
                        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${selectedCategory === 'all'
                                    ? 'bg-[#FE0E33] text-white shadow-[0_0_15px_rgba(254,14,51,0.4)]'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Filter className="w-3.5 h-3.5" />
                                <span>ሁሉም (All)</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory('design')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${selectedCategory === 'design'
                                    ? 'bg-[#00EBD4] text-[#000E23] font-bold shadow-[0_0_15px_rgba(0,235,212,0.4)]'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Palette className="w-3.5 h-3.5" />
                                <span>Graphics Design</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory('video')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${selectedCategory === 'video'
                                    ? 'bg-[#00EBD4] text-[#000E23] font-bold shadow-[0_0_15px_rgba(0,235,212,0.4)]'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Video className="w-3.5 h-3.5" />
                                <span>Video Editing</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory('marketing')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${selectedCategory === 'marketing'
                                    ? 'bg-[#00EBD4] text-[#000E23] font-bold shadow-[0_0_15px_rgba(0,235,212,0.4)]'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                <span>SMM</span>
                            </button>

                            <button
                                onClick={() => setSelectedCategory('ai')}
                                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${selectedCategory === 'ai'
                                    ? 'bg-[#00EBD4] text-[#000E23] font-bold shadow-[0_0_15px_rgba(0,235,212,0.4)]'
                                    : 'bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
                                    }`}
                            >
                                <Cpu className="w-3.5 h-3.5" />
                                <span>Prompt Eng.</span>
                            </button>
                        </div>

                    </div>
                </GlassCard>

                {/* Course Grid Display */}
                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCardItem
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                slug={course.slug}
                                description={course.description}
                                price={course.price}
                                instructorName={course.instructorName}
                                enrolledCount={course.enrolledCount}
                                imageSrc={course.imageSrc}
                            />
                        ))}
                    </div>
                ) : (
                    <GlassCard variant="default" className="text-center py-16">
                        <Sparkles className="w-12 h-12 text-gray-500 mx-auto mb-3 animate-pulse" />
                        <p className="text-lg font-bold text-[#FDFFFC]">ምንም የተገኘ ኮርስ የለም</p>
                        <p className="text-xs text-gray-400 mt-1">
                            የፈለጉት ቃል አልተገኘም። እባክዎን የመፈለጊያ ቃሉን አስተካክለው እንደገና ይሞክሩ።
                        </p>
                    </GlassCard>
                )}

            </div>
        </div>
    )
}