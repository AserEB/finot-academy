'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingCart, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function PaymentCheckoutView() {
    const [selectedSlug, setSelectedSlug] = useState('graphics-design')

    const availableCourses = [
        { slug: 'graphics-design', title: 'Graphics Design Masterclass', price: 4200 },
        { slug: 'video-editing', title: 'Video Editing & Motion Graphics', price: 7000 },
        { slug: 'smm-marketing', title: 'Social Media Marketing (SMM)', price: 3500 },
        { slug: 'prompt-engineering', title: 'Prompt Engineering & Generative AI', price: 2500 },
    ]

    const currentCourse = availableCourses.find((c) => c.slug === selectedSlug) || availableCourses[0]

    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">

                <div className="text-center space-y-3">
                    <h1 className="text-3xl font-extrabold text-[#FDFFFC] font-main">
                        Checkout <span className="text-[#00EBD4]">(የክፍያ ማጠቃለያ)</span>
                    </h1>
                    <p className="text-xs text-gray-400">
                        ለመመዝገብ የሚፈልጉትን ኮርስ ይምረጡና ክፍያዎን ይፈጽሙ፡
                    </p>
                </div>

                <GlassCard variant="glow" className="p-8 space-y-6">
                    <div className="space-y-3">
                        <label className="text-xs font-medium text-white block">ኮርስ ይምረጡ (Select Course):</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {availableCourses.map((c) => (
                                <button
                                    key={c.slug}
                                    onClick={() => setSelectedSlug(c.slug)}
                                    className={`p-4 rounded-xl text-left border transition-all flex flex-col justify-between ${selectedSlug === c.slug
                                        ? 'bg-[#00EBD4]/15 border-[#00EBD4] text-white'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                        }`}
                                >
                                    <span className="text-xs font-bold block">{c.title}</span>
                                    <span className="text-sm font-mono font-extrabold text-[#00EBD4] mt-2">
                                        {c.price.toLocaleString()} ETB
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                        <div>
                            <span className="text-xs text-gray-400 block">የሚከፈል አጠቃላይ ሂሳብ</span>
                            <strong className="text-2xl font-extrabold text-[#00EBD4]">
                                {currentCourse.price.toLocaleString()} ETB
                            </strong>
                        </div>
                        <span className="text-[11px] text-[#FE0E33] font-semibold">Lifetime Course Access</span>
                    </div>

                    <div className="pt-2">
                        <Link href={`/payment/enroll/${currentCourse.slug}`}>
                            <CustomButton variant="primary" fullWidth size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                                ወደ ክፍያ መክፈያ ሂድ (Proceed to Payment)
                            </CustomButton>
                        </Link>
                    </div>
                </GlassCard>

            </div>
        </div>
    )
}