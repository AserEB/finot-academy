'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    CheckCircle2,
    Lock,
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
import { createClient } from '@/lib/supabase/client'

interface CourseDetailsViewProps {
    slug: string
}

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

// የመማሪያ ውጤቶች እና ሞጁሎች Default Blueprint Backup
const defaultCurriculumMap: Record<string, { outcomes: string[], modules: any[] }> = {
    'graphics-design': {
        outcomes: [
            'የዲዛይን ህጎች፣ የቀለም ምርጫ (Color Theory) እና Typography',
            'Adobe Photoshop - Photo Editing & Creative Manipulation',
            'Adobe Illustrator - Vector Graphics & Illustration',
            'Professional Logo Design & Brand Identity Creation',
            'ለህትመት (Print) እና ለዲጂታል አየር ላይ የሚሆኑ ዲዛይኖችን ማዘጋጀት',
        ],
        modules: [
            { number: 1, title: 'Introduction to Graphic Design & Design Fundamentals', description: 'Learn basic principles of design, color theory, typography, and tool interfaces.' },
            { number: 2, title: 'Adobe Photoshop - Photo Editing & Manipulation', description: 'Working with layers, masks, selections, retouching, and background removal.' },
            { number: 3, title: 'Adobe Photoshop - Creative Design & Digital Artwork', description: 'Creating social media posts, posters, flyers, banners, and digital ads.' },
            { number: 4, title: 'Adobe Illustrator - Vector Graphics & Illustration', description: 'Master Pen Tool, Shape Builder, vectors, icons, and scalable graphics.' },
            { number: 5, title: 'Professional Branding & Real-World Design Projects', description: 'Applying skills to real projects, brand identity design, and client portfolio setup.' },
        ],
    },
    'video-editing': {
        outcomes: [
            'Adobe Premiere Pro Interface & Timeline Management',
            'Cutting, Trimming, and Speed Adjustment Techniques',
            'Cinematic Color Correction & Lumetri Color Grading',
            'Audio Noise Reduction & Professional Sound Mixing',
            'Advanced YouTube, Short-form & Commercial Export Formats',
        ],
        modules: [
            { number: 1, title: 'Introduction to Video Editing & Adobe Premiere Pro', description: 'Interface walkthrough, project setup, media import, and timeline structure.' },
            { number: 2, title: 'Basic Video Editing & Timeline Techniques', description: 'Cutting, trimming, splitting clips, speed ramps, and audio sync.' },
            { number: 3, title: 'Color Correction & Color Grading', description: 'Lumetri color wheel, cinematic LUTs, white balance, and exposure matching.' },
            { number: 4, title: 'Audio Editing, Effects & Motion Graphics', description: 'Audio cleaning, background score, text keyframing, and visual transitions.' },
            { number: 5, title: 'Advanced Editing, Exporting & Real-World Projects', description: 'Creating Reels/Documentaries, optimal bitrate export settings for high quality.' },
        ],
    },
    'smm-marketing': {
        outcomes: [
            'Social Media Platform Fundamentals & Audience Research',
            'Content Planning, Content Calendars & Copywriting',
            'Paid Advertising Strategy (Meta Ads, TikTok Ads)',
            'Analytics, Engagement Tracking & Conversion Optimization',
            'Business Brand Growth & Sales Lead Generation',
        ],
        modules: [
            { number: 1, title: 'Introduction to Social Media Marketing (SMM)', description: 'Understanding Facebook, TikTok, Instagram, and Telegram ecosystems.' },
            { number: 2, title: 'Content Creation & Social Media Management', description: 'Crafting viral captions, hashtags, content calendars, and community engagement.' },
            { number: 3, title: 'Social Media Advertising, Analytics & Growth', description: 'Setting up campaign budgets, retargeting audiences, and lead generation.' },
        ],
    },
    'prompt-engineering': {
        outcomes: [
            'Generative AI Core Concepts & Large Language Models',
            'Role Prompting, Zero-Shot & Few-Shot Prompt Frameworks',
            'Chain-of-Thought Prompting & Structured Outputs',
            'Multimodal Prompting for Text, Code, and Visuals',
            'Real-world Task Automation & Professional AI Workflows',
        ],
        modules: [
            { number: 1, title: 'Introduction to Prompt Engineering & Generative AI', description: 'Foundations of ChatGPT, Gemini, Claude, and clear instruction writing.' },
            { number: 2, title: 'Prompt Writing Techniques & Frameworks', description: 'Role prompting, few-shot examples, and chain-of-thought methods.' },
            { number: 3, title: 'Advanced Prompt Engineering & AI Tools', description: 'Prompt chaining, multimodal tasks, and structured outputs for coding/writing.' },
            { number: 4, title: 'Practical AI Applications & Real-World Projects', description: 'Building automated workflows, research, and client project execution.' },
        ],
    },
}

export default function CourseDetailsView({ slug }: CourseDetailsViewProps) {
    const supabase = createClient()
    const [dbCourse, setDbCourse] = useState<any | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // ከ Supabase ዳታቤዝ Live Course መረጃ ማምጣት
    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                const { data, error } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('slug', slug)
                    .single()

                if (!error && data) {
                    setDbCourse(data)
                }
            } catch (err) {
                console.error('Fetch Course Details Error:', err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourseDetails()
    }, [slug])

    const curriculum = defaultCurriculumMap[slug] || defaultCurriculumMap['graphics-design']

    const title = dbCourse?.title || (slug === 'video-editing' ? 'Video Editing & Motion Graphics' : 'Graphics Design Masterclass')
    const price = dbCourse?.price ? Number(dbCourse.price) : 4200
    const description = dbCourse?.description || 'ዘመናዊና ተፈላጊ የዲጂታል ክህሎቶችን በተግባር ላይ ባተኮረ መንገድ ይማሩ።'
    const enrolledCount = dbCourse?.enrolled_count || 0
    const imageSrc = getImageBySlug(slug)

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
                            {title}
                        </h1>

                        <p className="text-sm sm:text-base text-[#FDFFFC]/80 leading-relaxed">
                            {description}
                        </p>

                        <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-gray-300">
                            <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#00EBD4]" />
                                <span><strong className="text-white">{enrolledCount}</strong> ተማሪዎች ተመዝግበዋል</span>
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
                                {curriculum.outcomes.map((item: string, idx: number) => (
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
                                    src={imageSrc}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="space-y-2 text-center border-b border-white/10 pb-4">
                                <span className="text-xs text-gray-400">የኮርሱ ዋጋ (Course Price)</span>
                                <div className="text-3xl font-extrabold text-[#00EBD4]">
                                    {price.toLocaleString()} ETB
                                </div>
                                <p className="text-[11px] text-[#FE0E33] font-semibold">
                                    አንድ ጊዜ ብቻ የሚከፈል (Lifetime Access)
                                </p>
                            </div>

                            <div className="space-y-3">
                                <Link href={`/payment/enroll/${slug}`}>
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
                                    <span>{curriculum.modules.length} የተደራጁ ሞጁሎች</span>
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
                            በዚህ ኮርስ ስር የሚካተቱ {curriculum.modules.length} ሞጁሎች (ተማሪዎች ክፍያቸው አድሚን ሲያጸድቅ ገብተው የሚያዩአቸው ናቸው)።
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                        {curriculum.modules.map((mod: any) => (
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