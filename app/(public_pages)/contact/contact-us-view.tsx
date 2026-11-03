'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import {
    Mail,
    Send,
    Youtube,
    Instagram,
    Linkedin,
    Twitter,
    MessageSquare,
    CheckCircle2,
    Sparkles,
} from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function ContactUsView() {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: '',
    })
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate messaging submission
        setTimeout(() => {
            setIsLoading(false)
            setIsSubmitted(true)
            setFormData({ fullName: '', email: '', subject: '', message: '' })
        }, 1200)
    }

    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-20 left-10 w-96 h-96 bg-[#00EBD4]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FE0E33]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">

                {/* Header Section */}
                <div className="text-center space-y-4 max-w-3xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#000E23]/80 border border-[#00EBD4]/30 text-[#00EBD4] text-xs font-semibold"
                    >
                        <MessageSquare className="w-4 h-4 text-[#FE0E33]" />
                        <span>Finot Academy Support</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-3xl sm:text-5xl font-extrabold text-[#FDFFFC] font-main"
                    >
                        አግኙን <span className="text-[#00EBD4]">(Contact Us)</span>
                    </motion.h1>

                    <p className="text-sm text-[#FDFFFC]/80 leading-relaxed font-secondary">
                        ስለ ስልጠናዎች፣ ክፍያዎች ወይም ሌሎች ጉዳዮች ጥያቄ ካለዎት ያውሩን፤ በፍጥነት እንመልሳለን!
                    </p>
                </div>

                {/* Main Contact Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                    {/* Contact Details & Social Links (Left Column) */}
                    <div className="space-y-6 lg:col-span-1">

                        {/* Telegram Support Card */}
                        <GlassCard variant="interactive" className="p-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30">
                                    <Send className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#FDFFFC]">Telegram Support</h4>
                                    <p className="text-xs text-[#00EBD4] font-semibold">@BereketPixels</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">
                                ለፈጣን ጥያቄዎችና ድጋፍ በቴሌግራም በቀጥታ ያውሩን።
                            </p>
                            <a
                                href="https://t.me/BereketPixels"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex text-xs font-bold text-[#00EBD4] hover:underline"
                            >
                                በቴሌግራም መልእክት ላክ →
                            </a>
                        </GlassCard>

                        {/* Email Support Card */}
                        <GlassCard variant="interactive" className="p-6 space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-[#FE0E33]/10 text-[#FE0E33] border border-[#FE0E33]/30">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-[#FDFFFC]">Official Email</h4>
                                    <p className="text-xs text-[#FE0E33] font-semibold">nuhitavisuals@gmail.com</p>
                                </div>
                            </div>
                            <p className="text-xs text-gray-400">
                                ለኦፊሴላዊ ጥያቄዎች፣ የክፍያ ማረጋገጫ ወይም ድርጅታዊ አጋርነት።
                            </p>
                            <a
                                href="mailto:nuhitavisuals@gmail.com"
                                className="inline-flex text-xs font-bold text-[#FE0E33] hover:underline"
                            >
                                ኢሜይል ጻፍ →
                            </a>
                        </GlassCard>

                        {/* Social Media Links Card */}
                        <GlassCard variant="default" className="p-6 space-y-4">
                            <h4 className="text-sm font-bold text-[#00EBD4] uppercase tracking-wider">
                                Social Media Handle (@finotacademy)
                            </h4>
                            <p className="text-xs text-gray-400">
                                በማህበራዊ ሚዲያ ገጾቻችን ይከተሉን፡
                            </p>
                            <div className="grid grid-cols-2 gap-3 pt-1">
                                <a
                                    href="https://youtube.com/@finotacademy"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-[#FE0E33]/20 border border-white/10 text-xs text-[#FDFFFC] transition-colors"
                                >
                                    <Youtube className="w-4 h-4 text-[#FE0E33]" />
                                    <span>YouTube</span>
                                </a>
                                <a
                                    href="https://instagram.com/finotacademy"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-[#00EBD4]/20 border border-white/10 text-xs text-[#FDFFFC] transition-colors"
                                >
                                    <Instagram className="w-4 h-4 text-[#00EBD4]" />
                                    <span>Instagram</span>
                                </a>
                                <a
                                    href="https://linkedin.com/company/finotacademy"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-[#00EBD4]/20 border border-white/10 text-xs text-[#FDFFFC] transition-colors"
                                >
                                    <Linkedin className="w-4 h-4 text-[#00EBD4]" />
                                    <span>LinkedIn</span>
                                </a>
                                <a
                                    href="https://twitter.com/finotacademy"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 hover:bg-[#00EBD4]/20 border border-white/10 text-xs text-[#FDFFFC] transition-colors"
                                >
                                    <Twitter className="w-4 h-4 text-[#00EBD4]" />
                                    <span>Twitter (X)</span>
                                </a>
                            </div>
                        </GlassCard>

                    </div>

                    {/* Contact Message Form (Right 2 Columns) */}
                    <div className="lg:col-span-2">
                        <GlassCard variant="glow" className="p-8 space-y-6">
                            <div className="space-y-1 border-b border-white/10 pb-4">
                                <h3 className="text-xl font-bold text-[#FDFFFC]">
                                    መልእክት ይላኩልን (Send Us a Message)
                                </h3>
                                <p className="text-xs text-gray-400">
                                    ከታች ያለውን ቅፅ በመሙላት ጥያቄዎትን ወይም አስተያየትዎትን ይላኩልን።
                                </p>
                            </div>

                            {isSubmitted ? (
                                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                                    <div className="w-16 h-16 rounded-full bg-[#00EBD4]/20 border border-[#00EBD4] text-[#00EBD4] mx-auto flex items-center justify-center">
                                        <CheckCircle2 className="w-8 h-8" />
                                    </div>
                                    <h4 className="text-xl font-bold text-[#FDFFFC]">
                                        መልእክትዎ በትክክል ተልኳል!
                                    </h4>
                                    <p className="text-xs text-gray-300 max-w-md mx-auto">
                                        ስለተገናኙን እናመሰግናለን። የ Finot Academy ቡድን አባላት በተቻለ ፍጥነት በኢሜይልዎ ምላሽ ይሰጡዎታል።
                                    </p>
                                    <CustomButton
                                        variant="outline"
                                        onClick={() => setIsSubmitted(false)}
                                        className="mt-2"
                                    >
                                        ሌላ መልእክት ላክ
                                    </CustomButton>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <CustomInput
                                            label="ሙሉ ስም (Full Name)"
                                            placeholder="ስምዎን ያስገቡ"
                                            value={formData.fullName}
                                            onChange={(e) =>
                                                setFormData({ ...formData, fullName: e.target.value })
                                            }
                                            required
                                        />
                                        <CustomInput
                                            label="ኢሜይል አድራሻ (Gmail)"
                                            type="email"
                                            placeholder="example@gmail.com"
                                            value={formData.email}
                                            onChange={(e) =>
                                                setFormData({ ...formData, email: e.target.value })
                                            }
                                            required
                                        />
                                    </div>

                                    <CustomInput
                                        label="የጉዳዩ ርዕስ (Subject)"
                                        placeholder="ለምሳሌ፡ ስለ ቪዲዮ አርትዖት ኮርስ ጥያቄ"
                                        value={formData.subject}
                                        onChange={(e) =>
                                            setFormData({ ...formData, subject: e.target.value })
                                        }
                                        required
                                    />

                                    <div className="flex flex-col gap-1.5 text-left">
                                        <label className="text-xs font-medium text-[#FDFFFC]/80">
                                            ዝርዝር መልእክት (Your Message)
                                        </label>
                                        <textarea
                                            rows={5}
                                            placeholder="ጥያቄዎን ወይም አስተያየትዎን እዚህ ይጻፉ..."
                                            value={formData.message}
                                            onChange={(e) =>
                                                setFormData({ ...formData, message: e.target.value })
                                            }
                                            required
                                            className="w-full bg-[#000E23]/80 border border-[#00EBD4]/20 text-[#FDFFFC] text-sm rounded-xl p-4 outline-none focus:border-[#00EBD4] focus:ring-2 focus:ring-[#00EBD4]/30 backdrop-blur-md placeholder:text-gray-500 transition-all resize-none"
                                        />
                                    </div>

                                    <CustomButton
                                        type="submit"
                                        variant="primary"
                                        fullWidth
                                        size="lg"
                                        isLoading={isLoading}
                                        rightIcon={<Send className="w-4 h-4" />}
                                    >
                                        መልእክት ላክ (Send Message)
                                    </CustomButton>
                                </form>
                            )}
                        </GlassCard>
                    </div>

                </div>

            </div>
        </div>
    )
}