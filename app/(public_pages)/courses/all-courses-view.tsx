'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, BookOpen, Palette, Video, Share2, Cpu, Sparkles } from 'lucide-react'
import { CourseCardItem } from '@/components/course-card-item'
import { CustomInput } from '@/components/ui/custom-input'
import { GlassCard } from '@/components/ui/glass-card'
import { createClient } from '@/lib/supabase/client'

// ምስል ከ slug ጋር በራስ-ሰር የሚያዛምድ helper
const getImageBySlug = (slug: string) => {
    switch (slug) {
        case 'graphics-design':
            return '/assets/images/course-placeholders/graphics-design.jpg'
        case 'video-editing':
            return '/assets/images/course-placeholders/video-editing.jpg'
        case 'smm-marketing':
            return '/assets/images/course-placeholders/smm-marketing.jpg'
        case 'prompt-engineering':
            return '/assets/images/course-placeholders/prompt-engineering.jpg'
        default:
            return '/assets/images/course-placeholders/graphics-design.jpg'
    }
}

// Category Helper
const getCategoryBySlug = (slug: string) => {
    if (slug.includes('graphics') || slug.includes('design')) return 'design'
    if (slug.includes('video') || slug.includes('edit')) return 'video'
    if (slug.includes('marketing') || slug.includes('smm')) return 'marketing'
    if (slug.includes('prompt') || slug.includes('ai')) return 'ai'
    return 'other'
}

export default function AllCoursesView() {
    const supabase = createClient()
    const [courses, setCourses] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<string>('all')
    const [isLoading, setIsLoading] = useState(true)

    // ከ Supabase ዳታቤዝ Live ማምጣት
    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('is_active', true)
                    .order('created_at', { ascending: true })

                if (!error && data) {
                    setCourses(data)
                }
            } catch (err) {
                console.error('Fetch All Courses Error:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourses()
    }, [])

    // Search and Category Filter Logic
    const filteredCourses = courses.filter((course) => {
        const category = getCategoryBySlug(course.slug)
        const matchesSearch =
            course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            course.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory =
            selectedCategory === 'all' || category === selectedCategory

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
                {isLoading ? (
                    <div className="py-16 text-center text-gray-400 text-sm">
                        ኮርሶች እየተጫኑ ነው...
                    </div>
                ) : filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {filteredCourses.map((course) => (
                            <CourseCardItem
                                key={course.id}
                                id={course.id}
                                title={course.title}
                                slug={course.slug}
                                description={course.description}
                                price={Number(course.price)}
                                instructorName={course.instructor_name || 'Finot Team'}
                                enrolledCount={course.enrolled_count || 0}
                                imageSrc={getImageBySlug(course.slug)}
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