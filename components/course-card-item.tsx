'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Users, Clock, ArrowRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export interface CourseCardProps {
    id: string
    title: string
    slug: string
    description: string
    price: number
    instructorName?: string
    enrolledCount: number
    imageSrc: string
}

export const CourseCardItem: React.FC<CourseCardProps> = ({
    title,
    slug,
    description,
    price,
    instructorName = 'Finot Team',
    enrolledCount,
    imageSrc,
}) => {
    return (
        <GlassCard variant="interactive" noPadding className="flex flex-col h-full group">
            {/* Course Image Thumbnail */}
            <div className="relative w-full h-48 overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000E23] via-transparent to-transparent opacity-80" />

                {/* Enrolled Badge Counter (Dynamic ++ Count from DB) */}
                <div className="absolute top-3 right-3 bg-[#000E23]/80 backdrop-blur-md border border-[#00EBD4]/40 px-3 py-1 rounded-full text-[11px] font-bold text-[#00EBD4] flex items-center gap-1.5 shadow-md">
                    <Users className="w-3.5 h-3.5 text-[#00EBD4]" />
                    <span>{enrolledCount} Enrolled</span>
                </div>

                {/* Price Tag Badge */}
                <div className="absolute bottom-3 left-3 bg-[#FE0E33] text-[#FDFFFC] font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-lg tracking-wider">
                    {price.toLocaleString()} ETB
                </div>
            </div>

            {/* Course Details Content */}
            <div className="p-6 flex flex-col flex-grow justify-between gap-4">
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>Instructor: <strong className="text-[#00EBD4] font-semibold">{instructorName}</strong></span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-[#FE0E33]" /> Self-Paced</span>
                    </div>

                    <h3 className="text-lg font-bold text-[#FDFFFC] group-hover:text-[#00EBD4] transition-colors line-clamp-1 font-main">
                        {title}
                    </h3>

                    <p className="text-xs text-[#FDFFFC]/70 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>

                {/* Action Button */}
                <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                    <Link href={`/courses/${slug}`} className="w-full">
                        <CustomButton
                            variant="outline"
                            fullWidth
                            size="sm"
                            rightIcon={<ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                        >
                            View Course Details
                        </CustomButton>
                    </Link>
                </div>
            </div>
        </GlassCard>
    )
}