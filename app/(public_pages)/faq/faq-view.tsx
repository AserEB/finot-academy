'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, ChevronDown, Sparkles, MessageCircleQuestion } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

export default function FAQView() {
    const [openIndex, setOpenIndex] = useState<number | null>(0)

    const faqs = [
        {
            question: 'የ Finot Academy ኮርሶችን እንዴት መማር እችላለሁ?',
            answer:
                'የሚፈልጉትን ኮርስ ከተመለከቱ በኋላ "Enroll Now" የሚለውን ቁልፍ በመጫን የክፍያ ስክሪንሾት (Receipt) ይልካሉ። የአድሚን ቡድናችን መረጃዎን ከተመለከተ እና ካረጋገጠ በኋላ ወዲያውኑ ወደ ኮርሱ ቪዲዮዎች መዳረሻ ያገኛሉ።',
        },
        {
            question: 'ክፍያ የምፈጽመው በምን ዓይነት መንገዶች ነው?',
            answer:
                'ክፍያዎችን በ Telebirr ወይም በ Commercial Bank of Ethiopia (CBE) የባንክ አካውንታችን መፈጸም ይችላሉ። ክፍያ ሲፈጽሙ ደረሰኙን ፎቶ/Screenshot በማንሳት በምዝገባ ቅጹ ላይ ያያይዛሉ።',
        },
        {
            question: 'ቪዲዮዎችን ማውረድ ወይም በስልክ ቪዲዮ መቅረፅ ይቻላል?',
            answer:
                'በፍፁም አይቻልም! የ Finot Academy ቪዲዮዎች ከፍተኛ ጥበቃ የተደረገላቸው ሲሆን፣ በቪዲዮዎቹ ላይ የተማሪው ስም፣ የስልክ ቁጥር እና ልዩ ID የሚያሳይ Dynamic Watermark አየር ላይ ይንሳፈፋል። በተጨማሪም Screen Recording እና Download ተገድቧል።',
        },
        {
            question: 'የምስክር ወረቀት (Certificate) የምወስደው መቼ ነው?',
            answer:
                'የምስክር ወረቀት የሚሰጠው የተማሪው የትምህርት እድገት (Progress) 80% እና ከዚያ በላይ ሲደርስ እንዲሁም የ Capstone Project ሰርተው በአድሚን ሲጸድቅላችሁ ብቻ ነው።',
        },
        {
            question: 'ትምህርቱን በምማርበት ጊዜ ጥያቄ ካለኝ ማን ይረዳኛል?',
            answer:
                'በእያንዳንዱ ኮርስ ስር እና በቴሌግራም ግሩፓችን የ Finot Academy አሰልጣኞች እና የቴክኒክ ቡድን አባላት የሚነሱ ጥያቄዎችን ለመመለስ ዝግጁ ናቸው።',
        },
    ]

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index)
    }

    return (
        <div className="w-full min-h-screen py-12 md:py-20 relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">

                {/* Header */}
                <div className="text-center space-y-4">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#000E23]/80 border border-[#00EBD4]/30 text-[#00EBD4] text-xs font-semibold"
                    >
                        <HelpCircle className="w-4 h-4 text-[#FE0E33]" />
                        <span>Finot Academy FAQ</span>
                    </motion.div>

                    <h1 className="text-3xl sm:text-5xl font-extrabold text-[#FDFFFC] font-main">
                        ተደጋጋሚ ጥያቄዎች <span className="text-[#00EBD4]">(FAQ)</span>
                    </h1>

                    <p className="text-sm text-[#FDFFFC]/80 leading-relaxed font-secondary">
                        ስለ መድረካችን፣ ስለ ክፍያ እና ትምህርት አሰጣጥ ተደጋግመው የሚነሱ ጥያቄዎችና ምላሾቻቸው፡
                    </p>
                </div>

                {/* FAQ Accordion List */}
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <GlassCard
                            key={idx}
                            variant={openIndex === idx ? 'glow' : 'default'}
                            noPadding
                            className="overflow-hidden transition-all duration-300 cursor-pointer"
                        >
                            <button
                                onClick={() => toggleFAQ(idx)}
                                className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                            >
                                <span className="text-base font-bold text-[#FDFFFC] flex items-center gap-3">
                                    <MessageCircleQuestion className="w-5 h-5 text-[#00EBD4] shrink-0" />
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-[#00EBD4] transition-transform duration-300 shrink-0 ${openIndex === idx ? 'rotate-180 text-[#FE0E33]' : ''
                                        }`}
                                />
                            </button>

                            <AnimatePresence>
                                {openIndex === idx && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-6 pt-0 border-t border-white/10"
                                    >
                                        <p className="text-sm text-gray-300 leading-relaxed pt-4">
                                            {faq.answer}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </GlassCard>
                    ))}
                </div>

            </div>
        </div>
    )
}