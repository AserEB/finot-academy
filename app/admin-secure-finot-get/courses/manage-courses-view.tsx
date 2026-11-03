'use client'

import React, { useEffect, useState } from 'react'
import { Plus, Edit, Users } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'
import { ModalDialog } from '@/components/ui/modal-dialog'
import { CustomInput } from '@/components/ui/custom-input'

export default function ManageCoursesView() {
    const supabase = createClient()
    const [courses, setCourses] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingCourse, setEditingCourse] = useState<any | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    // Form states
    const [title, setTitle] = useState('')
    const [slug, setSlug] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState('')
    const [instructorName, setInstructorName] = useState('Finot Team')
    const [isActive, setIsActive] = useState(true)

    const fetchCourses = async () => {
        setIsLoading(true)
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('created_at', { ascending: true })

        if (!error && data) {
            setCourses(data)
        }
        setIsLoading(false)
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    const handleOpenModal = (course?: any) => {
        setErrorMsg('')
        if (course) {
            setEditingCourse(course)
            setTitle(course.title || '')
            setSlug(course.slug || '')
            setDescription(course.description || '')
            setPrice(course.price?.toString() || '')
            setInstructorName(course.instructor_name || 'Finot Team')
            setIsActive(course.is_active ?? true)
        } else {
            setEditingCourse(null)
            setTitle('')
            setSlug('')
            setDescription('')
            setPrice('')
            setInstructorName('Finot Team')
            setIsActive(true)
        }
        setIsModalOpen(true)
    }

    const handleSaveCourse = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMsg('')

        if (!title.trim() || !slug.trim() || !description.trim() || !price) {
            setErrorMsg('እባክዎን ሁሉንም አስፈላጊ መረጃዎች ይሙሉ!')
            return
        }

        setIsSubmitting(true)

        try {
            const payload = {
                title: title.trim(),
                slug: slug.trim().toLowerCase().replace(/\s+/g, '-'),
                description: description.trim(),
                price: parseFloat(price),
                instructor_name: instructorName.trim() || 'Finot Team',
                is_active: isActive,
            }

            if (editingCourse) {
                // Update existing course
                const { error } = await supabase
                    .from('courses')
                    .update(payload)
                    .eq('id', editingCourse.id)

                if (error) throw error
            } else {
                // Insert new course
                const { error } = await supabase
                    .from('courses')
                    .insert(payload)

                if (error) throw error
            }

            setIsModalOpen(false)
            fetchCourses()
        } catch (err: any) {
            setErrorMsg('ኮርሱን ማስቀመጥ አልተቻለም፡ ' + (err.message || ''))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        የኮርሶች አስተዳደር <span className="text-[#FE0E33]">(Manage Courses)</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        በ Finot Academy የሚሰጡ ኮርሶች፣ ዋጋዎች እና የነቁ ተማሪዎች ብዛት (Real-time DB Data)፡
                    </p>
                </div>
                <CustomButton
                    variant="danger"
                    size="sm"
                    onClick={() => handleOpenModal()}
                    leftIcon={<Plus className="w-4 h-4" />}
                >
                    አዲስ ኮርስ ጨምር
                </CustomButton>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {courses.map((c) => (
                    <GlassCard key={c.id} variant="default" className="p-6 space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white">{c.title}</h3>
                                    <p className="text-[11px] text-[#00EBD4] font-mono mt-0.5">
                                        Instructor: {c.instructor_name || 'Finot Team'}
                                    </p>
                                </div>
                                <span className="text-sm font-extrabold text-[#00EBD4] font-mono shrink-0">
                                    {Number(c.price)?.toLocaleString()} ETB
                                </span>
                            </div>

                            <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">
                                {c.description}
                            </p>
                        </div>

                        <div className="space-y-3 pt-3 border-t border-white/10">
                            <div className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 text-gray-300 font-semibold">
                                    <Users className="w-4 h-4 text-[#00EBD4]" />
                                    <span>የተመዘገቡ ተማሪዎች: <strong className="text-white font-mono">{c.enrolled_count || 0}</strong></span>
                                </span>

                                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${c.is_active ? 'bg-[#00EBD4]/20 text-[#00EBD4]' : 'bg-red-500/20 text-red-400'
                                    }`}>
                                    {c.is_active ? 'Active' : 'Inactive'}
                                </span>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1">
                                <span className="text-[11px] text-gray-400 font-mono">Slug: {c.slug}</span>
                                <button
                                    onClick={() => handleOpenModal(c)}
                                    className="px-3 py-1.5 rounded-lg bg-white/10 text-xs text-[#00EBD4] hover:bg-[#00EBD4]/20 transition-colors flex items-center gap-1 font-semibold"
                                >
                                    <Edit className="w-3.5 h-3.5" />
                                    <span>አስተካክል (Edit)</span>
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            {/* Create/Edit Course Modal */}
            <ModalDialog
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCourse ? 'ኮርስ ማስተካከያ (Edit Course)' : 'አዲስ ኮርስ መፍጠሪያ (Add Course)'}
                description="የኮርሱን መረጃዎች እና ዋጋ ያስገቡ"
            >
                <form onSubmit={handleSaveCourse} className="space-y-4 text-left">
                    <CustomInput
                        label="የኮርሱ ርዕስ (Course Title)"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="ለምሳሌ፡ Graphics Design Masterclass"
                        required
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <CustomInput
                            label="Slug"
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="graphics-design"
                            required
                        />

                        <CustomInput
                            label="ዋጋ (Price in ETB)"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="4200"
                            required
                        />
                    </div>

                    <CustomInput
                        label="አስተማሪ (Instructor Name)"
                        value={instructorName}
                        onChange={(e) => setInstructorName(e.target.value)}
                        placeholder="Finot Team"
                    />

                    <div className="space-y-1">
                        <label className="text-xs font-medium text-[#FDFFFC]/80">መግለጫ (Description)</label>
                        <textarea
                            rows={3}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="የኮርሱ ዝርዝር መግለጫ..."
                            className="w-full bg-[#000E23] border border-white/10 text-white text-xs rounded-xl p-3 outline-none focus:border-[#00EBD4]"
                            required
                        />
                    </div>

                    <div className="flex items-center gap-2 pt-1">
                        <input
                            type="checkbox"
                            id="is_active_check"
                            checked={isActive}
                            onChange={(e) => setIsActive(e.target.checked)}
                            className="w-4 h-4 accent-[#00EBD4] rounded"
                        />
                        <label htmlFor="is_active_check" className="text-xs text-gray-300 font-semibold cursor-pointer">
                            ኮርሱ ንቁ ይሁን (Active Status)
                        </label>
                    </div>

                    {errorMsg && (
                        <div className="p-3 rounded-xl bg-[#FE0E33]/15 border border-[#FE0E33]/40 text-xs text-[#FE0E33] font-semibold text-center">
                            {errorMsg}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <CustomButton
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setIsModalOpen(false)}
                        >
                            ሰርዝ (Cancel)
                        </CustomButton>
                        <CustomButton
                            type="submit"
                            variant="primary"
                            size="sm"
                            isLoading={isSubmitting}
                        >
                            {editingCourse ? 'አስቀምጥ (Save)' : 'ፍጠር (Create)'}
                        </CustomButton>
                    </div>
                </form>
            </ModalDialog>
        </div>
    )
}