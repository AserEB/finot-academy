'use client'

import React, { useEffect, useState } from 'react'
import { Layers, Plus, Edit, Trash2, Video, Youtube } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'
import { ModalDialog } from '@/components/ui/modal-dialog'
import { CustomInput } from '@/components/ui/custom-input'

export default function ManageModulesView() {
    const supabase = createClient()
    const [courses, setCourses] = useState<any[]>([])
    const [modules, setModules] = useState<any[]>([])
    const [selectedCourseId, setSelectedCourseId] = useState<string>('all')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingModule, setEditingModule] = useState<any | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Form States
    const [courseId, setCourseId] = useState('')
    const [moduleNumber, setModuleNumber] = useState('1')
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [youtubeUrl, setYoutubeUrl] = useState('')

    const fetchData = async () => {
        // Fetch courses list for drop-downs
        const { data: courseData } = await supabase.from('courses').select('id, title, slug')
        setCourses(courseData || [])

        // Fetch modules with joined course title
        const { data: moduleData } = await supabase
            .from('modules')
            .select('*, courses(title, slug)')
            .order('module_number', { ascending: true })

        setModules(moduleData || [])
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleOpenModal = (mod?: any) => {
        setErrorMsg('')
        if (mod) {
            setEditingModule(mod)
            setCourseId(mod.course_id || '')
            setModuleNumber(mod.module_number?.toString() || '1')
            setTitle(mod.title || '')
            setDescription(mod.description || '')
            setYoutubeUrl(mod.youtube_url || '')
        } else {
            setEditingModule(null)
            setCourseId(courses[0]?.id || '')
            setModuleNumber((modules.length + 1).toString())
            setTitle('')
            setDescription('')
            setYoutubeUrl('')
        }
        setIsModalOpen(true)
    }

    const handleSaveModule = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')

        if (!courseId || !title.trim() || !youtubeUrl.trim()) {
            setErrorMsg('እባክዎን አስፈላጊዎቹን መረጃዎች (ኮርስ፣ ርዕስ እና የ YouTube ሊንክ) ይሙሉ!')
            return
        }

        setIsSubmitting(true)

        try {
            const payload = {
                course_id: courseId,
                module_number: parseInt(moduleNumber, 10),
                title: title.trim(),
                description: description.trim(),
                youtube_url: youtubeUrl.trim(),
            }

            if (editingModule) {
                const { error } = await supabase
                    .from('modules')
                    .update(payload)
                    .eq('id', editingModule.id)

                if (error) throw error
            } else {
                const { error } = await supabase
                    .from('modules')
                    .insert(payload)

                if (error) throw error
            }

            setIsModalOpen(false)
            fetchData()
        } catch (err: any) {
            setErrorMsg('ሞጁሉን ማስቀመጥ አልተቻለም፡ ' + (err.message || ''))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDeleteModule = async (id: string) => {
        if (!confirm('ይህንን ሞጁል እርግጠኛ ሆነው መደለዝ ይፈልጋሉ?')) return

        await supabase.from('modules').delete().eq('id', id)
        fetchData()
    }

    const filteredModules = modules.filter((m) =>
        selectedCourseId === 'all' ? true : m.course_id === selectedCourseId
    )

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        የሞጁሎች አስተዳደር <span className="text-[#FE0E33]">(Manage Modules)</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        የቪዲዮ ትምህርቶችን እና የ YouTube ሊንኮችን ማስተካከያ (Supabase Real DB Data)፡
                    </p>
                </div>
                <CustomButton
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenModal()}
                    leftIcon={<Plus className="w-4 h-4" />}
                >
                    አዲስ ሞጁል አክል
                </CustomButton>
            </div>

            {/* Filter by Course */}
            <GlassCard variant="default" className="p-4 flex items-center gap-4">
                <span className="text-xs text-gray-300 font-semibold">በኮርስ አፊልትር፡</span>
                <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="bg-[#000E23] border border-white/10 text-white text-xs rounded-xl px-3 py-2 outline-none focus:border-[#00EBD4]"
                >
                    <option value="all">ሁሉም ኮርሶች (All Courses)</option>
                    {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.title}
                        </option>
                    ))}
                </select>
            </GlassCard>

            {/* Modules List */}
            {filteredModules.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredModules.map((m) => (
                        <GlassCard key={m.id} variant="default" className="p-5 space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <span className="text-[10px] font-mono font-bold text-[#00EBD4] uppercase">
                                        {m.courses?.title || 'Course'} — Module {m.module_number}
                                    </span>
                                    <h3 className="text-sm font-bold text-white mt-0.5">{m.title}</h3>
                                </div>
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => handleOpenModal(m)}
                                        className="p-1.5 rounded-lg bg-white/10 hover:bg-[#00EBD4]/20 text-[#00EBD4] transition-colors"
                                    >
                                        <Edit className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteModule(m.id)}
                                        className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/20 text-red-400 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            {m.description && (
                                <p className="text-xs text-gray-400 line-clamp-2">{m.description}</p>
                            )}

                            <div className="pt-2 border-t border-white/10 flex items-center gap-2 text-[11px] text-gray-300 font-mono">
                                <Youtube className="w-4 h-4 text-[#FE0E33] shrink-0" />
                                <span className="truncate">{m.youtube_url}</span>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <GlassCard variant="default" className="p-8 text-center space-y-3">
                    <Layers className="w-10 h-10 text-gray-500 mx-auto" />
                    <p className="text-sm font-bold text-gray-300">ምንም የተመዘገበ ሞጁል አልተገኘም</p>
                </GlassCard>
            )}

            {/* Modal for Add / Edit Module */}
            <ModalDialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingModule ? 'ሞጁል ማስተካከያ' : 'አዲስ ሞጁል መፍጠሪያ'}
                description="የቪዲዮ ትምህርቱን መረጃዎች ያስገቡ"
            >
                <form onSubmit={handleSaveModule} className="space-y-4 text-left">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-[#FDFFFC]/80">ኮርስ ይምረጡ (Select Course)</label>
                        <select
                            value={courseId}
                            onChange={(e) => setCourseId(e.target.value)}
                            className="w-full bg-[#000E23] border border-white/10 text-white text-xs rounded-xl p-3 outline-none focus:border-[#00EBD4]"
                            required
                        >
                            {courses.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <CustomInput
                            label="የሞጁል ተራ ቁጥር (Module Number)"
                            type="number"
                            value={moduleNumber}
                            onChange={(e) => setModuleNumber(e.target.value)}
                            placeholder="1"
                            required
                        />

                        <CustomInput
                            label="የ YouTube Link / URL"
                            value={youtubeUrl}
                            onChange={(e) => setYoutubeUrl(e.target.value)}
                            placeholder="https://youtu.be/..."
                            required
                        />
                    </div>

                    <CustomInput
                        label="የሞጁሉ ርዕስ (Module Title)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="ምሳሌ: Introduction to Design"
                        required
                    />

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-[#FDFFFC]/80">መግለጫ (Description - Optional)</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="የቪዲዮው ይዘት መግለጫ..."
                            className="w-full bg-[#000E23] border border-white/10 text-white text-xs rounded-xl p-3 outline-none focus:border-[#00EBD4]"
                        />
                    </div>

                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-[#FE0E33]/15 border border-[#FE0E33]/40 text-xs text-[#FE0E33] font-semibold text-center">
                            {errorMsg}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <CustomButton type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
                            ሰርዝ (Cancel)
                        </CustomButton>
                        <CustomButton type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
                            {editingModule ? 'አስቀምጥ (Save)' : 'ፍጠር (Create)'}
                        </CustomButton>
                    </div>
                </form>
            </ModalDialog>
        </div>
    )
}