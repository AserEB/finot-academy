'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Sparkles, GraduationCap, ShieldCheck, Zap, ArrowRight, Video, Palette, Share2, Cpu } from 'lucide-react'
import { CustomButton } from '@/components/ui/custom-button'
import { GlassCard } from '@/components/ui/glass-card'
import { CourseCardItem } from '@/components/course-card-item'
import { PinnedAnnouncementBanner } from '@/components/pinned-announcement-banner'

export default function HomeView() {
    // Demo course list matching exact prices & specifications from blueprint
    const featuredCourses = [
        {
            id: '1',
            title: 'Graphics Design',
            slug: 'graphics-design',
            description: 'Learn Adobe Photoshop & Illustrator from fundamentals to advanced professional branding and artwork composition.',
            price: 4200,
            instructorName: 'Bereket & Team',
            enrolledCount: 142,
            imageSrc: '/assets/images/course-placeholders/graphics-design.jpg',
            icon: Palette,
        },
        {
            id: '2',
            title: 'Video Editing',
            slug: 'video-editing',
            description: 'Master Premiere Pro, timeline techniques, color grading, Lumetri color, motion graphics, and sound design.',
            price: 7000,
            instructorName: 'Nuhamin & Team',
            enrolledCount: 98,
            imageSrc: '/assets/images/course-placeholders/video-editing.jpg',
            icon: Video,
        },
        {
            id: '3',
            title: 'Social Media Marketing (SMM)',
            slug: 'smm-marketing',
            description: 'Master paid ads, audience targeting, content creation strategies, account management, and growth analytics.',
            price: 3500,
            instructorName: 'Biruk & Team',
            enrolledCount: 185,
            imageSrc: '/assets/images/course-placeholders/smm-marketing.jpg',
            icon: Share2,
        },
        {
            id: '4',
            title: 'Prompt Engineering',
            slug: 'prompt-engineering',
            description: 'Master Generative AI models (ChatGPT, Gemini, Claude), zero-shot/few-shot prompting, and workflow automation.',
            price: 2500,
            instructorName: 'Lidet & Team',
            enrolledCount: 210,
            imageSrc: '/assets/images/course-placeholders/prompt-engineering.jpg',
            icon: Cpu,
        },
    ]

    return (
        <div className="w-full flex flex-col min-h-screen">
            {/* 1. Top Pinned Announcement Banner */}
            <PinnedAnnouncementBanner
                title="አዲስ ምዝገባ"
                message="ለ 2026 የኦንላይን ስልጠናዎች ምዝገባ ተጀምሯል። አሁኑኑ ተመዝግበው ትምህርት ይጀምሩ!"
                actionUrl="/courses"
                actionText="ኮርሶችን ይመልከቱ"
                isActive={true}
            />

            {/* 2. Hero Section */}
            <section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden flex items-center justify-center">
                {/* Neon Glow Effects */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-tr from-[#FE0E33]/15 via-[#00EBD4]/15 to-transparent rounded-full blur-[120px] pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">

                    {/* Badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#000E23]/80 border border-[#00EBD4]/40 text-[#00EBD4] text-xs font-semibold shadow-[0_0_15px_rgba(0,235,212,0.2)]"
                    >
                        <Sparkles className="w-4 h-4 text-[#FE0E33] animate-spin" />
                        <span>Finot Academy — Digital Skills Platform</span>
                    </motion.div>

                    {/* Main Headline */}
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-[#FDFFFC] tracking-tight font-main leading-tight"
                    >
                        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FE0E33] via-[#FDFFFC] to-[#00EBD4]">FINOT ACADEMY</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-3xl mx-auto text-base sm:text-lg text-[#FDFFFC]/80 leading-relaxed font-secondary"
                    >
                        ዛሬ እውቀትን ያግኙ፣ ነገን በብቃት ይፍጠሩ! በግራፊክስ ዲዛይን፣ ቪዲዮ አርትዖት፣ ዲጂታል ማርኬቲንግ እና ፕሮምፕት ኢንጂነሪንግ ዘመናዊና ተፈላጊ ክህሎቶችን በተግባር ላይ ባተኮረ መንገድ ይማሩ።
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
                    >
                        <Link href="/courses">
                            <CustomButton
                                variant="primary"
                                size="lg"
                                rightIcon={<ArrowRight className="w-5 h-5" />}
                            >
                                ኮርሶችን ይመልከቱ (All Courses)
                            </CustomButton>
                        </Link>
                        <Link href="/about">
                            <CustomButton
                                variant="outline"
                                size="lg"
                                leftIcon={<GraduationCap className="w-5 h-5" />}
                            >
                                ስለ እኛ (About Us)
                            </CustomButton>
                        </Link>
                    </motion.div>

                    {/* Core Feature Stats */}
                    <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        <GlassCard variant="default" className="text-center p-4">
                            <p className="text-2xl font-extrabold text-[#00EBD4]">4+</p>
                            <p className="text-xs text-gray-400 mt-1">Specialized Courses</p>
                        </GlassCard>
                        <GlassCard variant="default" className="text-center p-4">
                            <p className="text-2xl font-extrabold text-[#FE0E33]">600+</p>
                            <p className="text-xs text-gray-400 mt-1">Active Students</p>
                        </GlassCard>
                        <GlassCard variant="default" className="text-center p-4">
                            <p className="text-2xl font-extrabold text-[#00EBD4]">100%</p>
                            <p className="text-xs text-gray-400 mt-1">Practical Projects</p>
                        </GlassCard>
                        <GlassCard variant="default" className="text-center p-4">
                            <p className="text-2xl font-extrabold text-[#FE0E33]">80%+</p>
                            <p className="text-xs text-gray-400 mt-1">Certificate Benchmark</p>
                        </GlassCard>
                    </div>
                </div>
            </section>

            {/* 3. Featured Courses Section */}
            <section className="py-20 bg-[#000E23]/60 relative border-t border-b border-[#00EBD4]/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-xs font-bold text-[#00EBD4] tracking-widest uppercase">
                                Featured Programs
                            </span>
                            <h2 className="text-3xl font-bold text-[#FDFFFC] font-main mt-1">
                                ተፈላጊ የዲጂታል ክህሎቶች (Our Courses)
                            </h2>
                        </div>
                        <Link href="/courses">
                            <CustomButton variant="ghost" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                View All Courses
                            </CustomButton>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredCourses.map((course) => (
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
                </div>
            </section>

            {/* 4. Team & Platform Mission Section */}
            <section className="py-24 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        {/* Team Image Preview */}
                        <div className="relative rounded-2xl overflow-hidden border border-[#00EBD4]/30 shadow-[0_0_30px_rgba(0,235,212,0.15)] group">
                            <div className="aspect-video relative w-full">
                                <Image
                                    src="/assets/images/finot-team-photo.jpg"
                                    alt="Finot Academy Founding Team"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000E23] via-transparent to-transparent opacity-70" />
                            <div className="absolute bottom-4 left-4 right-4 p-4 bg-[#000E23]/80 backdrop-blur-md rounded-xl border border-white/10">
                                <p className="text-sm font-bold text-[#00EBD4]">የ Finot Academy መስራች ቡድን</p>
                                <p className="text-xs text-gray-300">በረከት፣ ኑኃሚን፣ ብሩክ እና ልደት — የ 3ኛ ዓመት የኮምፒውተር ሳይንስ ተማሪዎች</p>
                            </div>
                        </div>

                        {/* Mission Text */}
                        <div className="space-y-6">
                            <span className="text-xs font-bold text-[#FE0E33] tracking-widest uppercase">
                                About Finot Academy
                            </span>
                            <h2 className="text-3xl font-extrabold text-[#FDFFFC] font-main leading-snug">
                                ቴክኖሎጂን እና ፈጠራን በመጠቀም የዲጂታል ክህሎቶችን ተደራሽ እናደርጋለን!
                            </h2>
                            <p className="text-sm text-[#FDFFFC]/80 leading-relaxed">
                                እኛ የ 3ኛ ዓመት የኮምፒውተር ሳይንስ ተማሪዎች ስንሆን፣ ቴክኖሎጂን እና ፈጠራን በመጠቀም ለተማሪዎችና ለሌሎች የዲጂታል ክህሎቶችን ማዳበር ለሚፈልጉ ሰዎች ተደራሽና ጥራት ያለው የኦንላይን ትምህርት መድረክ እየገነባን እንገኛለን።
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-[#00EBD4]/10 text-[#00EBD4] shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#FDFFFC]">Safe & Protected Content</h4>
                                        <p className="text-xs text-gray-400">ከስርቆትና ከውርድ የተጠበቀ የቪዲዮ ትምህርት።</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="p-2 rounded-lg bg-[#FE0E33]/10 text-[#FE0E33] shrink-0">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-[#FDFFFC]">Verified Certificates</h4>
                                        <p className="text-xs text-gray-400">80%+ Progress እና የ Capstone Project ማረጋገጫ።</p>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Link href="/about">
                                    <CustomButton variant="secondary" rightIcon={<ArrowRight className="w-4 h-4" />}>
                                        ስለ እኛ ሙሉ መረጃ ያንብቡ
                                    </CustomButton>
                                </Link>
                            </div>
                        </div>

                    </div>
                </div>
            </section>
        </div>
    )
}