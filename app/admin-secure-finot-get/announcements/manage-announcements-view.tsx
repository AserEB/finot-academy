'use client'

import React, { useState } from 'react'
import { BellRing, Save, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function ManageAnnouncementsView() {
    const [title, setTitle] = useState('አዲስ ምዝገባ')
    const [message, setMessage] = useState('ለ 2026 የኦንላይን ስልጠናዎች ምዝገባ ተጀምሯል። አሁኑኑ ተመዝግበው ትምህርት ይጀምሩ!')
    const [saved, setSaved] = useState(false)

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault()
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የማስታወቂያዎች መቆጣጠሪያ <span className="text-[#FE0E33]">(Announcements)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    በመነሻ ገፅ ከላይ የሚታየውን Pinned Announcement Banner ያካፍሉ፡
                </p>
            </div>

            <GlassCard variant="glow" className="p-8 max-w-xl space-y-6">
                <form onSubmit={handleSave} className="space-y-4">
                    <CustomInput
                        label="የማስታወቂያው ርዕስ (Banner Title)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />

                    <div className="flex flex-col gap-1.5 text-left">
                        <label className="text-xs font-medium text-[#FDFFFC]/80">የማስታወቂያው መልእክት</label>
                        <textarea
                            rows={3}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full bg-[#000E23] border border-[#00EBD4]/20 text-white text-sm rounded-xl p-3 outline-none focus:border-[#00EBD4]"
                        />
                    </div>

                    {saved && (
                        <div className="p-3 rounded-xl bg-[#00EBD4]/20 text-[#00EBD4] text-xs font-semibold text-center flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>ማስታወቂያው በስኬት ተቀይሯል!</span>
                        </div>
                    )}

                    <CustomButton type="submit" variant="danger" fullWidth leftIcon={<Save className="w-4 h-4" />}>
                        ማስታወቂያውን ለውጥ (Publish Banner)
                    </CustomButton>
                </form>
            </GlassCard>
        </div>
    )
}