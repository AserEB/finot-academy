'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    Users,
    Target,
    Eye,
    Sparkles,
    ShieldCheck,
    Code,
    CheckCircle2,
    ArrowRight,
    Heart,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function AboutUsView() {
    // Founding Team Members details matching exact project blueprint
    const teamMembers = [
        {
            name: 'በረከት (Bereket)',
            role: 'Lead Frontend Developer & UI/UX Specialist',
            gender: 'Female',
            bio: 'የ Finot Academy የፊት ለፊት ዲዛይንና የተማሪዎችን ምቹ ተሞክሮ (UI/UX) የመምራት ኃላፊነት።',
            badge: 'Frontend Lead',
        },
        {
            name: 'ኑኃሚን (Nuhamin)',
            role: 'Backend Developer & Database Architect',
            gender: 'Female',
            bio: 'የ Supabase ዳታቤዝ አወቃቀር፣ የደህንነት ህጎች እና የ SQL ሎጂክ መሃንዲስ።',
            badge: 'Backend & DB Lead',
        },
        {
            name: 'ብሩክ (Biruk)',
            role: 'Full-Stack Developer & Security / Payment Logic Lead',
            gender: 'Male',
            bio: 'የቪዲዮ ጥበቃ፣ የስክሪንሾት እገዳ ሎጂክ እና የክፍያ ስራዎች (Telebirr/CBE) ተቆጣጣሪ።',
            badge: 'Security Lead',
        },
        {
            name: 'ልደት (Lidet)',
            role: 'Content Workflow, SEO & QA Lead',
            gender: 'Female',
            bio: 'የኮርሶች ይዘት፣ የዩቲዩብ ቪዲዮ ውቅር፣ SEO እና የሲስተሙ ጥራት ማረጋገጫ ኃላፊ።',
            badge: 'SEO & Content QA',
        },
    ]

    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#FE0E33]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00EBD4]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">

                {/* Header Section */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#000E23]/80 border border-[#00EBD4]/30 text-[#00EBD4] text-xs font-semibold"
                    >
                        <Users className="w-4 h-4 text-[#FE0E33]" />
                        <span>Finot Academy — About Us</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl sm:text-5xl font-extrabold text-[#FDFFFC] font-main"
                    >
                        ስለ እኛ <span className="text-[#00EBD4]">(About Us)</span>
                    </motion.h1>

                    <p className="text-base text-[#00EBD4] font-bold tracking-wide">
                        ዛሬ እውቀትን ያግኙ፣ ነገን በብቃት ይፍጠሩ!
                    </p>
                </div>

                {/* Hero Main Description Card */}
                <GlassCard variant="glow" className="p-8 sm:p-10 space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                        {/* Team Image Showcase */}
                        <div className="relative rounded-2xl overflow-hidden border border-[#00EBD4]/40 shadow-[0_0_30px_rgba(0,235,212,0.2)]">
                            <div className="aspect-video relative w-full">
                                <Image
                                    src="/assets/images/finot-team-photo.jpg"
                                    alt="Finot Academy Founding Team Photo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#000E23] via-transparent to-transparent opacity-60" />
                        </div>

                        {/* Main Text Content */}
                        <div className="space-y-4 text-[#FDFFFC]/90 text-sm sm:text-base leading-relaxed">
                            <p className="text-lg font-bold text-[#FDFFFC] leading-snug">
                                እኛ የ 3ኛ ዓመት የኮምፒውተር ሳይንስ ተማሪዎች ስንሆን፣ ቴክኖሎጂን እና ፈጠራን በመጠቀም ለተማሪዎችና ለሌሎች የዲጂታል ክህሎቶችን ማዳበር ለሚፈልጉ ሰዎች ተደራሽና ጥራት ያለው የኦንላይን ትምህርት መድረክ እየገነባን እንገኛለን።
                            </p>
                            <p className="text-xs sm:text-sm text-gray-300">
                                በመድረካችን የግራፊክስ ዲዛይን፣ የቪዲዮ አርትዖት፣ የፕሮምፕት ኢንጂነሪንግ እና የዲጂታል ግብይት የመሳሰሉ ዘመናዊና ተፈላጊ ክህሎቶችን በተደራጀ እና በተግባር ላይ ባተኮረ መንገድ ለማቅረብ እንተጋለን።
                            </p>
                            <div className="pt-2 flex items-center gap-3">
                                <span className="px-3 py-1 rounded-full bg-[#FE0E33]/20 border border-[#FE0E33]/40 text-[#FE0E33] text-xs font-semibold">
                                    Computer Science Students
                                </span>
                                <span className="px-3 py-1 rounded-full bg-[#00EBD4]/20 border border-[#00EBD4]/40 text-[#00EBD4] text-xs font-semibold">
                                    Full Stack LMS Platform
                                </span>
                            </div>
                        </div>

                    </div>
                </GlassCard>

                {/* Mission and Vision Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Mission Card */}
                    <GlassCard variant="interactive" className="p-8 space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-[#00EBD4]/10 border border-[#00EBD4]/30 text-[#00EBD4] flex items-center justify-center">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#FDFFFC] font-main">
                            ተልዕኳችን (Our Mission)
                        </h3>
                        <p className="text-sm text-[#FDFFFC]/80 leading-relaxed">
                            ሰዎች በቀላሉ እውቀት እንዲያገኙ፣ ተግባራዊ ክህሎቶቻቸውን እንዲያዳብሩ እና በዲጂታል ዓለም ያሉ የትምህርትና የሥራ ዕድሎችን እንዲጠቀሙ ማገዝ ነው።
                        </p>
                    </GlassCard>

                    {/* Vision Card */}
                    <GlassCard variant="interactive" className="p-8 space-y-4">
                        <div className="w-12 h-12 rounded-xl bg-[#FE0E33]/10 border border-[#FE0E33]/30 text-[#FE0E33] flex items-center justify-center">
                            <Eye className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-[#FDFFFC] font-main">
                            ራዕያችን (Our Vision)
                        </h3>
                        <p className="text-sm text-[#FDFFFC]/80 leading-relaxed">
                            እውቀትን ተደራሽ በማድረግ፣ ፈጠራን በማበረታታት እና የዲጂታል ክህሎቶችን በማሳደግ ሰዎች ለተሻለ የወደፊት ዕድል እንዲዘጋጁ ማስቻል ነው።
                        </p>
                    </GlassCard>

                </div>

                {/* Founding Team Members Section */}
                <div className="space-y-8">
                    <div className="text-center space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                            የቡድናችን አባላት <span className="text-[#00EBD4]">(The Founders)</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-400">
                            Finot Academyን የገነቡት 4ቱ የ 3ኛ ዓመት የኮምፒውተር ሳይንስ ተማሪዎች፡
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member, idx) => (
                            <GlassCard key={idx} variant="default" className="p-6 space-y-4 flex flex-col justify-between">
                                <div className="space-y-3">
                                    <div className="w-12 h-12 rounded-full bg-[#000E23] border border-[#00EBD4]/40 text-[#00EBD4] font-bold text-lg flex items-center justify-center shadow-md">
                                        {member.name.charAt(0)}
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-[#FE0E33] uppercase tracking-wider">
                                            {member.badge}
                                        </span>
                                        <h4 className="text-base font-bold text-[#FDFFFC] mt-0.5">{member.name}</h4>
                                        <p className="text-xs text-[#00EBD4] font-semibold">{member.role}</p>
                                    </div>
                                    <p className="text-xs text-gray-400 leading-relaxed">{member.bio}</p>
                                </div>

                                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-gray-500">
                                    <span>Finot Co-Founder</span>
                                    <Code className="w-3.5 h-3.5 text-[#00EBD4]" />
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>

                {/* CTA Banner */}
                <GlassCard variant="default" className="p-8 text-center space-y-4">
                    <h3 className="text-2xl font-bold text-[#FDFFFC] font-main">
                        ትምህርት ለመጀመር ዝግጁ ኖት?
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
                        አሁኑኑ የፍላጎትዎን ኮርስ ይምረጡና የዲጂታል ክህሎትዎን ማዳበር ይጀምሩ!
                    </p>
                    <div className="pt-2">
                        <Link href="/courses">
                            <CustomButton variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                ኮርሶችን ይመልከቱ (Explore Courses)
                            </CustomButton>
                        </Link>
                    </div>
                </GlassCard>

            </div>
        </div>
    )
}