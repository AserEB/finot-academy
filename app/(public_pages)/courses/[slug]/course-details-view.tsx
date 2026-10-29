'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    CheckCircle2,
    Lock,
    PlayCircle,
    Clock,
    ShieldCheck,
    Users,
    BookOpen,
    ArrowRight,
    Award,
    Sparkles,
    Zap,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

interface CourseDetailsViewProps {
    slug: string
}

export default function CourseDetailsView({ slug }: CourseDetailsViewProps) {
    // Database of Course Details matching PDF technical blueprint
    const courseDataMap: Record<string, any> = {
        'graphics-design': {
            title: 'Graphics Design Masterclass',
            slug: 'graphics-design',
            price: 4200,
            instructor: 'Bereket & Team',
            imageSrc: '/assets/images/course-placeholders/graphics-design.jpg',
            enrolledCount: 142,
            description:
                'የግራፊክስ ዲዛይን መሰረታዊ ህጎችን፣ Adobe Photoshop እና Adobe Illustrator ሶፍትዌሮችን በመጠቀም ፕሮፌሽናል ፖስተሮች፣ አርማዎች (Logo)፣ የማህበራዊ ሚዲያ ማስታወቂያዎች እና ብራንዲንግ መፍጠር ይማሩ።',
            learningOutcomes: [
                'የዲዛይን ህጎች፣ የቀለም ምርጫ (Color Theory) እና Typography',
                'Adobe Photoshop - Photo Editing & Creative Manipulation',
                'Adobe Illustrator - Vector Graphics & Illustration',
                'Professional Logo Design & Brand Identity Creation',
                'ለህትመት (Print) እና ለዲጂታል አየር ላይ የሚሆኑ ዲዛይኖችን ማዘጋጀት',
            ],
            modules: [
                {
                    number: 1,
                    title: 'Introduction to Graphic Design & Design Fundamentals',
                    description: 'Learn basic principles of design, color theory, typography, and tool interfaces.',
                    url: 'https://youtu.be/GQS7wPujL2k?si=DmwWtfwZBBXeejBz',
                },
                {
                    number: 2,
                    title: 'Adobe Photoshop - Photo Editing & Manipulation',
                    description: 'Working with layers, masks, selections, retouching, and background removal.',
                    url: 'https://youtu.be/uSUpLsZTrdM?si=xpm9wP32YL94198u',
                },
                {
                    number: 3,
                    title: 'Adobe Photoshop - Creative Design & Digital Artwork',
                    description: 'Creating social media posts, posters, flyers, banners, and digital ads.',
                    url: 'https://youtu.be/HHRHVaerKtE?si=NE13-_QovbfbTCIo',
                },
                {
                    number: 4,
                    title: 'Adobe Illustrator - Vector Graphics & Illustration',
                    description: 'Master Pen Tool, Shape Builder, vectors, icons, and scalable graphics.',
                    url: 'https://youtu.be/3NBKRYwEbNs?si=-dWIbZ9gDecGnujZ',
                },
                {
                    number: 5,
                    title: 'Professional Branding & Real-World Design Projects',
                    description: 'Applying skills to real projects, brand identity design, and client portfolio setup.',
                    url: 'https://youtu.be/y_2P5o_msuo?si=Wt7sbGgb4qax0uL4',
                },
            ],
        },
        'video-editing': {
            title: 'Video Editing & Motion Graphics',
            slug: 'video-editing',
            price: 7000,
            instructor: 'Nuhamin & Team',
            imageSrc: '/assets/images/course-placeholders/video-editing.jpg',
            enrolledCount: 98,
            description:
                'Adobe Premiere Pro ሶፍትዌርን በመጠቀም የዩቲዩብ ቪዲዮዎች፣ ሪልስ (Reels)፣ ሲነማቲክ ፕሮጀክቶች፣ Color Grading፣ Sound Design እና ኤፌክቶችን በከፍተኛ ጥራት መስራት ይማሩ።',
            learningOutcomes: [
                'Adobe Premiere Pro Interface & Timeline Management',
                'Cutting, Trimming, and Speed Adjustment Techniques',
                'Cinematic Color Correction & Lumetri Color Grading',
                'Audio Noise Reduction & Professional Sound Mixing',
                'Advanced YouTube, Short-form & Commercial Export Formats',
            ],
            modules: [
                {
                    number: 1,
                    title: 'Introduction to Video Editing & Adobe Premiere Pro',
                    description: 'Interface walkthrough, project setup, media import, and timeline structure.',
                    url: 'https://youtu.be/oUlpbue-Gw0?si=VlmWhAAOmtDBE31F',
                },
                {
                    number: 2,
                    title: 'Basic Video Editing & Timeline Techniques',
                    description: 'Cutting, trimming, splitting clips, speed ramps, and audio sync.',
                    url: 'https://youtu.be/954L0eVIdaE?si=BJv4h09LQ3hJmlg4',
                },
                {
                    number: 3,
                    title: 'Color Correction & Color Grading',
                    description: 'Lumetri color wheel, cinematic LUTs, white balance, and exposure matching.',
                    url: 'https://youtu.be/TMnBLZy3WFg?si=ZG-N7OHt68NZWTTh',
                },
                {
                    number: 4,
                    title: 'Audio Editing, Effects & Motion Graphics',
                    description: 'Audio cleaning, background score, text keyframing, and visual transitions.',
                    url: 'https://youtu.be/bDf477GaMtA?si=Ad2CbKZgibDXgb44',
                },
                {
                    number: 5,
                    title: 'Advanced Editing, Exporting & Real-World Projects',
                    description: 'Creating Reels/Documentaries, optimal bitrate export settings for high quality.',
                    url: 'https://www.youtube.com/live/wEFRWiKr0BM?si=cKi_ISpdDDGosPbj',
                },
            ],
        },
        'smm-marketing': {
            title: 'Social Media Marketing (SMM)',
            slug: 'smm-marketing',
            price: 3500,
            instructor: 'Biruk & Team',
            imageSrc: '/assets/images/course-placeholders/smm-marketing.jpg',
            enrolledCount: 185,
            description:
                'በፌስቡክ፣ ኢንስታግራም፣ ቲክቶክ እና ቴሌግራም የደንበኞችን ቁጥር መጨመር፣ የሚከፈሉ ማስታወቂያዎችን (Paid Ads) መስራት እና የንግድ ውጤቶችን ማሳደግ ይማሩ።',
            learningOutcomes: [
                'Social Media Platform Fundamentals & Audience Research',
                'Content Planning, Content Calendars & Copywriting',
                'Paid Advertising Strategy (Meta Ads, TikTok Ads)',
                'Analytics, Engagement Tracking & Conversion Optimization',
                'Business Brand Growth & Sales Lead Generation',
            ],
            modules: [
                {
                    number: 1,
                    title: 'Introduction to Social Media Marketing (SMM)',
                    description: 'Understanding Facebook, TikTok, Instagram, and Telegram ecosystems.',
                    url: 'https://youtu.be/I2pwcAVonKI?si=dJukcO3NxmK3AnFr',
                },
                {
                    number: 2,
                    title: 'Content Creation & Social Media Management',
                    description: 'Crafting viral captions, hashtags, content calendars, and community engagement.',
                    url: 'https://youtu.be/y-n1RUbYq6Q?si=QU9CMcpdBYq_zrUW',
                },
                {
                    number: 3,
                    title: 'Social Media Advertising, Analytics & Growth',
                    description: 'Setting up campaign budgets, retargeting audiences, and lead generation.',
                    url: 'https://youtu.be/I2pwcAVonKI?si=tR3U4SzdH9jfHFQY',
                },
            ],
        },
        'prompt-engineering': {
            title: 'Prompt Engineering & Generative AI',
            slug: 'prompt-engineering',
            price: 2500,
            instructor: 'Lidet & Team',
            imageSrc: '/assets/images/course-placeholders/prompt-engineering.jpg',
            enrolledCount: 210,
            description:
                'የ AI ሞዴሎችን (ChatGPT, Gemini, Claude) በከፍተኛ ብቃት በመጠቀም የስራ ሂደቶችዎን ማፍጠን፣ ይዘቶችን መፍጠር እና ውስብስብ ችግሮችን በጥራት መፍታት ይማሩ።',
            learningOutcomes: [
                'Generative AI Core Concepts & Large Language Models',
                'Role Prompting, Zero-Shot & Few-Shot Prompt Frameworks',
                'Chain-of-Thought Prompting & Structured Outputs',
                'Multimodal Prompting for Text, Code, and Visuals',
                'Real-world Task Automation & Professional AI Workflows',
            ],
            modules: [
                {
                    number: 1,
                    title: 'Introduction to Prompt Engineering & Generative AI',
                    description: 'Foundations of ChatGPT, Gemini, Claude, and clear instruction writing.',
                    url: 'https://youtu.be/_ZvnD73m400?si=Zia4VHsJdxixVAGk',
                },
                {
                    number: 2,
                    title: 'Prompt Writing Techniques & Frameworks',
                    description: 'Role prompting, few-shot examples, and chain-of-thought methods.',
                    url: 'https://youtu.be/P08jrZhyNxw?si=BzKnNK5UmpMrADHb',
                },
                {
                    number: 3,
                    title: 'Advanced Prompt Engineering & AI Tools',
                    description: 'Prompt chaining, multimodal tasks, and structured outputs for coding/writing.',
                    url: 'https://youtu.be/pwWBcsxEoLk?si=lsTti3j6LDj40KjC',
                },
                {
                    number: 4,
                    title: 'Practical AI Applications & Real-World Projects',
                    description: 'Building automated workflows, research, and client project execution.',
                    url: 'https://youtu.be/pwWBcsxEoLk?si=TnUt97sE59fIZTvg',
                },
            ],
        },
    }

    const course = courseDataMap[slug] || courseDataMap['graphics-design']

    return (
        <div className="w-full min-h-screen py-10 md:py-16 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-20 right-10 w-96 h-96 bg-[#FE0E33]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 left-10 w-96 h-96 bg-[#00EBD4]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

                {/* Top Breadcrumb & Title Hero */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Main Details (Left 2 Columns) */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00EBD4]/10 border border-[#00EBD4]/30 text-[#00EBD4] text-xs font-semibold">
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Finot Academy Verified Course</span>
                        </div>

                        <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FDFFFC] font-main leading-tight">
                            {course.title}
                        </h1>

                        <p className="text-sm sm:text-base text-[#FDFFFC]/80 leading-relaxed">
                            {course.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-gray-300">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#00EBD4]" />
                                <span><strong className="text-white">{course.enrolledCount}</strong> ተማሪዎች ተመዝግበዋል</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#FE0E33]" />
                                <span>በራሶ ፍጥነት (Self-Paced)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-[#00EBD4]" />
                                <span>የምስክር ወረቀት (Verified Certificate)</span>
                            </div>
                        </div>

                        {/* What you will learn */}
                        <GlassCard variant="default" className="mt-6 p-6 space-y-4">
                            <h3 className="text-lg font-bold text-[#FDFFFC] flex items-center gap-2">
                                <Zap className="w-5 h-5 text-[#FE0E33]" />
                                <span>በዚህ ኮርስ ምን ይማራሉ? (What You Will Learn)</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {course.learningOutcomes.map((item: string, idx: number) => (
                                    <div key={idx} className="flex items-start gap-2.5 text-xs text-[#FDFFFC]/90">
                                        <CheckCircle2 className="w-4 h-4 text-[#00EBD4] shrink-0 mt-0.5" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </GlassCard>
                    </div>

                    {/* Pricing & Enrollment Action Card (Right Column) */}
                    <div className="lg:col-span-1">
                        <GlassCard variant="glow" className="p-6 sticky top-28 space-y-6">
                            <div className="relative w-full h-44 rounded-xl overflow-hidden border border-white/10">
                                <Image
                                    src={course.imageSrc}
                                    alt={course.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="space-y-2 text-center border-b border-white/10 pb-4">
                                <span className="text-xs text-gray-400">የኮርሱ ዋጋ (Course Price)</span>
                                <div className="text-3xl font-extrabold text-[#00EBD4]">
                                    {course.price.toLocaleString()} ETB
                                </div>
                                <p className="text-[11px] text-[#FE0E33] font-semibold">
                                    አንድ ጊዜ ብቻ የሚከፈል (Lifetime Access)
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Link href={`/payment/enroll/${course.slug}`}>
                                    <CustomButton
                                        variant="primary"
                                        fullWidth
                                        size="lg"
                                        rightIcon={<ArrowRight className="w-5 h-5" />}
                                    >
                                        አሁኑኑ ተመዝገብ (Enroll Now)
                                    </CustomButton>
                                </Link>
                                <p className="text-[11px] text-gray-400 text-center">
                                    Telebirr እና CBE ክፍያዎችን ይቀበላል።
                                </p>
                            </div>

                            <div className="space-y-2 pt-2 text-xs text-gray-300">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4 text-[#00EBD4]" />
                                    <span>ደህንነቱ የተጠበቀ የቪዲዮ ትምህርት</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <BookOpen className="w-4 h-4 text-[#FE0E33]" />
                                    <span>{course.modules.length} የተደራጁ ሞጁሎች</span>
                                </div>
                            </div>
                        </GlassCard>
                    </div>

                </div>

                {/* Modules Directory Section */}
                <div className="space-y-6 pt-6">
                    <div className="border-b border-white/10 pb-4">
                        <h2 className="text-2xl font-bold text-[#FDFFFC] font-main flex items-center gap-2">
                            <BookOpen className="w-6 h-6 text-[#00EBD4]" />
                            <span>የኮርሱ ሞጁሎች (Course Curriculum)</span>
                        </h2>
                        <p className="text-xs text-gray-400 mt-1">
                            በዚህ ኮርስ ስር የሚካተቱ {course.modules.length} ሞጁሎች (ተማሪዎች ክፍያቸው አድሚን ሲያጸድቅ ገብተው የሚያዩአቸው ናቸው)።
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {course.modules.map((mod: any) => (
                            <GlassCard key={mod.number} variant="default" className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#00EBD4]/10 border border-[#00EBD4]/30 text-[#00EBD4] font-extrabold flex items-center justify-center shrink-0">
                                        M{mod.number}
                                    </div>
                                    <div>
                                        <h4 className="text-base font-bold text-[#FDFFFC]">{mod.title}</h4>
                                        <p className="text-xs text-gray-400 mt-1">{mod.description}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-gray-400 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 shrink-0">
                                    <Lock className="w-3.5 h-3.5 text-[#FE0E33]" />
                                    <span>Requires Enrollment</span>
                                </div>
                            </GlassCard>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}