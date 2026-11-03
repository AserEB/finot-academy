'use client'

import React, { useEffect, useState } from 'react'
import { BellRing, Save, CheckCircle2, Pin, Trash2, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function ManageAnnouncementsView() {
    const supabase = createClient()
    const [announcements, setAnnouncements] = useState<any[]>([])
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const [targetAudience, setTargetAudience] = useState<'all' | 'enrolled' | 'rejected'>('all')
    const [isPinnedBanner, setIsPinnedBanner] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [savedMsg, setSavedMsg] = useState('')

    const fetchAnnouncements = async () => {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('created_at', { ascending: false })

        if (!error && data) {
            setAnnouncements(data)
        }
    }

    useEffect(() => {
        fetchAnnouncements()
    }, [])

    const handlePublish = async (e: React.FormEvent) => {
        e.preventDefault()
        setSavedMsg('')

        if (!title.trim() || !message.trim()) return

        setIsSubmitting(true)

        try {
            // የ Home ገጽ ማስታወቂያ (target_audience === 'all') Pin ሲሆን ብቻ ነው የድሮውን Home Banner unpin የሚያደርገው
            // ለ Enrolled ወይም ለ Rejected የሚለጠፍ ከሆነ የ Home ገጹ ባነር በጭራሽ አይነካም!
            if (isPinnedBanner && targetAudience === 'all') {
                await supabase
                    .from('announcements')
                    .update({ is_pinned_banner: false })
                    .eq('target_audience', 'all')
                    .eq('is_pinned_banner', true)
            } else if (isPinnedBanner && targetAudience !== 'all') {
                // ለተመሳሳይ ቡድን (enrolled ወይም rejected) የተሰካውን ብቻ ያወርዳል
                await supabase
                    .from('announcements')
                    .update({ is_pinned_banner: false })
                    .eq('target_audience', targetAudience)
                    .eq('is_pinned_banner', true)
            }

            // አዲስ ማስታወቂያ ማስገባት
            const { error } = await supabase.from('announcements').insert({
                title: title.trim(),
                message: message.trim(),
                target_audience: targetAudience,
                is_pinned_banner: isPinnedBanner,
                is_active: true,
            })

            if (error) throw error

            setSavedMsg('ማስታወቂያው በስኬት ተለጥፏል!')
            setTitle('')
            setMessage('')
            fetchAnnouncements()
            setTimeout(() => setSavedMsg(''), 3000)
        } catch (err: any) {
            console.error('Save announcement error:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Hide / Show (Active Toggle)
    const toggleActive = async (id: string, currentStatus: boolean) => {
        await supabase
            .from('announcements')
            .update({ is_active: !currentStatus })
            .eq('id', id)
        fetchAnnouncements()
    }

    // Pin / Unpin Toggle
    const togglePin = async (id: string, currentPinStatus: boolean, audience: string) => {
        if (!currentPinStatus) {
            // ለተመሳሳይ audience ብቻ የነበረውን Pin ያወርዳል
            await supabase
                .from('announcements')
                .update({ is_pinned_banner: false })
                .eq('target_audience', audience)
                .eq('is_pinned_banner', true)
        }

        await supabase
            .from('announcements')
            .update({ is_pinned_banner: !currentPinStatus })
            .eq('id', id)

        fetchAnnouncements()
    }

    const handleDelete = async (id: string) => {
        if (!confirm('ማስታወቂያውን መደለዝ ይፈልጋሉ?')) return
        await supabase.from('announcements').delete().eq('id', id)
        fetchAnnouncements()
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የማስታወቂያዎች መቆጣጠሪያ <span className="text-[#FE0E33]">(Announcements)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    በመነሻ ገፅ (All) እንዲሁም ለተማሪዎች (Enrolled/Rejected) የሚታዩ ማስታወቂያዎችን ያስተዳድሩ፡
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Form to Post New Banner */}
                <GlassCard variant="glow" className="p-6 space-y-6">
                    <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
                        <BellRing className="w-5 h-5 text-[#FE0E33]" />
                        <span>አዲስ ማስታወቂያ መለጠፊያ (Publish Banner)</span>
                    </h3>

                    <form onSubmit={handlePublish} className="space-y-4">
                        <CustomInput
                            label="የማስታወቂያው ርዕስ (Banner Title)"
                            placeholder="ምሳሌ: አዲስ ምዝገባ"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-xs font-medium text-[#FDFFFC]/80">የማስታወቂያው መልእክት</label>
                            <textarea
                                rows={3}
                                placeholder="የማስታወቂያው ሙሉ ፅሁፍ..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className="w-full bg-[#000E23] border border-[#00EBD4]/20 text-white text-xs rounded-xl p-3 outline-none focus:border-[#00EBD4]"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1 text-left">
                                <label className="text-xs font-medium text-[#FDFFFC]/80">የታላሚ አድማጮች (Audience)</label>
                                <select
                                    value={targetAudience}
                                    onChange={(e) => setTargetAudience(e.target.value as any)}
                                    className="w-full bg-[#000E23] border border-white/10 text-white text-xs rounded-xl p-2.5 outline-none"
                                >
                                    <option value="all">ሁሉም - Home ላይ የሚታይ (All Users)</option>
                                    <option value="enrolled">የተመዘገቡ ብቻ (Enrolled Students)</option>
                                    <option value="rejected">Rejected የተደረጉ ብቻ</option>
                                </select>
                            </div>

                            <div className="flex items-center gap-2 pt-6">
                                <input
                                    type="checkbox"
                                    id="pinned_check"
                                    checked={isPinnedBanner}
                                    onChange={(e) => setIsPinnedBanner(e.target.checked)}
                                    className="w-4 h-4 accent-[#FE0E33] rounded"
                                />
                                <label htmlFor="pinned_check" className="text-xs text-gray-300 font-semibold cursor-pointer">
                                    Pinned Banner ይሁን
                                </label>
                            </div>
                        </div>

                        {savedMsg && (
                            <div className="p-3 rounded-xl bg-[#00EBD4]/20 text-[#00EBD4] text-xs font-semibold text-center flex items-center justify-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                <span>{savedMsg}</span>
                            </div>
                        )}

                        <CustomButton type="submit" variant="danger" fullWidth isLoading={isSubmitting} leftIcon={<Save className="w-4 h-4" />}>
                            ማስታወቂያውን ለጥፍ (Publish Banner)
                        </CustomButton>
                    </form>
                </GlassCard>

                {/* List of Existing Announcements with Toggle */}
                <GlassCard variant="default" className="p-6 space-y-4">
                    <h3 className="text-base font-bold text-white border-b border-white/10 pb-3">
                        ያሉ ማስታወቂያዎችና ቁጥጥር (Manage & Toggle)
                    </h3>

                    <div className="space-y-3">
                        {announcements.length === 0 ? (
                            <p className="text-xs text-gray-400 text-center py-6">ምንም ማስታወቂያ የለም።</p>
                        ) : (
                            announcements.map((a) => (
                                <div key={a.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <h4 className="text-xs font-bold text-white">{a.title}</h4>
                                            {a.is_pinned_banner && (
                                                <span className="px-2 py-0.5 rounded-full bg-[#FE0E33]/20 text-[#FE0E33] text-[9px] font-bold flex items-center gap-1">
                                                    <Pin className="w-3 h-3" /> Pinned
                                                </span>
                                            )}
                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${a.is_active ? 'bg-[#00EBD4]/20 text-[#00EBD4]' : 'bg-gray-500/20 text-gray-400'}`}>
                                                {a.is_active ? 'Visible' : 'Hidden'}
                                            </span>
                                            <span className="px-2 py-0.5 rounded-full bg-white/10 text-gray-300 text-[9px] font-mono">
                                                {a.target_audience}
                                            </span>
                                        </div>

                                        {/* Action Buttons: Pin, Hide/Unhide, Delete */}
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => togglePin(a.id, a.is_pinned_banner, a.target_audience)}
                                                className={`p-1.5 rounded-lg border text-xs transition-colors ${a.is_pinned_banner ? 'bg-[#FE0E33]/20 border-[#FE0E33] text-[#FE0E33]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                                title={a.is_pinned_banner ? 'Unpin' : 'Pin'}
                                            >
                                                <Pin className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                                onClick={() => toggleActive(a.id, a.is_active)}
                                                className={`p-1.5 rounded-lg border text-xs transition-colors ${a.is_active ? 'bg-[#00EBD4]/20 border-[#00EBD4] text-[#00EBD4]' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'}`}
                                                title={a.is_active ? 'Hide from users' : 'Unhide / Show'}
                                            >
                                                {a.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                            </button>

                                            <button
                                                onClick={() => handleDelete(a.id)}
                                                className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-300">{a.message}</p>
                                    <span className="text-[10px] text-gray-400 block font-mono">
                                        {new Date(a.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </GlassCard>
            </div>
        </div>
    )
}