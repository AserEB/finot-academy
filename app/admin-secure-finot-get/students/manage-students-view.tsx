'use client'

import React, { useEffect, useState } from 'react'
import { Search, Edit3, RefreshCw, AlertCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'
import { ModalDialog } from '@/components/ui/modal-dialog'

export default function ManageStudentsView() {
    const supabase = createClient()
    const [students, setStudents] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [activeSearch, setActiveSearch] = useState('')
    const [isLoading, setIsLoading] = useState(true)
    const [fetchError, setFetchError] = useState<string | null>(null)

    // Edit Modal State
    const [selectedStudent, setSelectedStudent] = useState<any | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Form Edit States
    const [editFullName, setEditFullName] = useState('')
    const [editPhone, setEditPhone] = useState('')
    const [editGender, setEditGender] = useState<'male' | 'female'>('male')
    const [editRole, setEditRole] = useState<'student' | 'owner_admin' | 'assistant_admin'>('student')
    const [editGlobalId, setEditGlobalId] = useState('')

    const fetchStudents = async () => {
        setIsLoading(true)
        setFetchError(null)
        try {
            // Foreign Key Constraint 'enrollments_user_id_fkey' በመጥቀስ ግንኙነቱን ያለምንም ግጭት ያመጣል
            const { data, error } = await supabase
                .from('profiles')
                .select(`
                    id,
                    full_name,
                    email,
                    phone_number,
                    gender,
                    role,
                    unique_student_id,
                    created_at,
                    enrollments:enrollments!enrollments_user_id_fkey (
                        id,
                        unique_student_id,
                        status
                    )
                `)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Fetch Students Error:', error)
                setFetchError(error.message)
            } else if (data) {
                setStudents(data)
            }
        } catch (err: any) {
            console.error('Fetch Students Catch Error:', err)
            setFetchError(err.message || 'ተማሪዎችን መጫን አልተቻለም')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const handleSearch = () => {
        setActiveSearch(searchTerm.trim())
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch()
        }
    }

    // Double Click Row Handler
    const handleOpenEdit = (student: any) => {
        setSelectedStudent(student)
        setEditFullName(student.full_name || '')
        setEditPhone(student.phone_number || '')
        setEditGender(student.gender || 'male')
        setEditRole(student.role || 'student')
        setEditGlobalId(student.unique_student_id || '')
        setIsEditModalOpen(true)
    }

    // Save Updated Profile
    const handleSaveStudentProfile = async () => {
        if (!selectedStudent) return
        setIsSaving(true)

        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: editFullName.trim(),
                    phone_number: editPhone.trim(),
                    gender: editGender,
                    role: editRole,
                    unique_student_id: editGlobalId.trim(),
                    updated_at: new Date().toISOString(),
                })
                .eq('id', selectedStudent.id)

            if (!error) {
                setIsEditModalOpen(false)
                await fetchStudents()
            } else {
                alert('የተማሪ መረጃ ማዘመን አልተቻለም፡ ' + error.message)
            }
        } catch (err: any) {
            console.error('Save profile error:', err)
        } finally {
            setIsSaving(false)
        }
    }

    const filtered = students.filter((s) => {
        const globalId = String(s.unique_student_id || '').toLowerCase()
        const enrollmentList = Array.isArray(s.enrollments) ? s.enrollments : []
        const enrollmentId = String(enrollmentList.find((e: any) => e.unique_student_id)?.unique_student_id || '').toLowerCase()
        const name = String(s.full_name || '').toLowerCase()
        const email = String(s.email || '').toLowerCase()
        const phone = String(s.phone_number || '').toLowerCase()

        const search = activeSearch.toLowerCase()
        if (!search) return true

        return (
            name.includes(search) ||
            email.includes(search) ||
            phone.includes(search) ||
            globalId.includes(search) ||
            enrollmentId.includes(search)
        )
    })

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        የተማሪዎች አስተዳደር <span className="text-[#FE0E33]">(Manage Students)</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        የተማሪ ረድፍ ላይ <strong>Double-Click (ሁለት ጊዜ ጠቅ)</strong> በማድረግ መረጃዎችን ማስተካከል ይችላሉ፡
                    </p>
                </div>
                <CustomButton
                    variant="secondary"
                    size="sm"
                    onClick={fetchStudents}
                    isLoading={isLoading}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                    አድስ (Refresh)
                </CustomButton>
            </div>

            {fetchError && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-200 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                    <span><strong>ስህተት፡</strong> {fetchError}</span>
                </div>
            )}

            {/* Explicit Search Bar */}
            <GlassCard variant="default" className="p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 w-full sm:w-auto flex-1 max-w-md">
                    <div className="flex-1">
                        <CustomInput
                            placeholder="በስም፣ ኢሜይል፣ Global ID ወይም ስልክ ፈልግ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                            leftIcon={<Search className="w-4 h-4 text-[#FE0E33]" />}
                        />
                    </div>
                    <CustomButton variant="primary" size="md" onClick={handleSearch}>
                        Search
                    </CustomButton>
                </div>
            </GlassCard>

            {/* Students Table */}
            <GlassCard variant="default" className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-white/5 border-b border-white/10 text-[#00EBD4] uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Global ID / Course ID</th>
                            <th className="p-4">ሙሉ ስም (Full Name)</th>
                            <th className="p-4">ኢሜይል (Email)</th>
                            <th className="p-4">ስልክ (Phone)</th>
                            <th className="p-4">ጾታ (Gender)</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">የተመዘገበበት ቀን</th>
                            <th className="p-4 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {isLoading ? (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">
                                    የተማሪዎች መረጃ እየተጫነ ነው...
                                </td>
                            </tr>
                        ) : filtered.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="p-8 text-center text-gray-400">
                                    ምንም አይነት የተማሪ መረጃ አልተገኘም።
                                </td>
                            </tr>
                        ) : (
                            filtered.map((student) => {
                                const globalId = student.unique_student_id || 'N/A'
                                const enrollmentList = Array.isArray(student.enrollments) ? student.enrollments : []
                                const courseId = enrollmentList.find((e: any) => e.unique_student_id)?.unique_student_id || 'N/A'

                                return (
                                    <tr
                                        key={student.id}
                                        onDoubleClick={() => handleOpenEdit(student)}
                                        title="Double click to edit student profile"
                                        className="hover:bg-white/10 cursor-pointer transition-colors select-none"
                                    >
                                        <td className="p-4 font-mono font-bold text-[#00EBD4]">
                                            {globalId}
                                            {courseId !== 'N/A' && (
                                                <span className="block text-[9px] text-gray-400 font-mono">
                                                    Course ID: {courseId}
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 font-bold text-white">{student.full_name || 'N/A'}</td>
                                        <td className="p-4 font-mono text-[11px] text-gray-300">{student.email || 'N/A'}</td>
                                        <td className="p-4">{student.phone_number || 'N/A'}</td>
                                        <td className="p-4 capitalize">{student.gender || 'N/A'}</td>
                                        <td className="p-4">
                                            {student.role === 'owner_admin' && (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#FE0E33]/20 text-[#FE0E33]">
                                                    Owner Admin
                                                </span>
                                            )}
                                            {student.role === 'assistant_admin' && (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-yellow-500/20 text-yellow-400">
                                                    Assistant Admin
                                                </span>
                                            )}
                                            {(!student.role || student.role === 'student') && (
                                                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#00EBD4]/20 text-[#00EBD4]">
                                                    Student
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-[11px]">{new Date(student.created_at).toLocaleDateString()}</td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleOpenEdit(student)
                                                }}
                                                className="p-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
                                                title="Edit Student Profile"
                                            >
                                                <Edit3 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </GlassCard>

            {/* Double Click Edit Student Modal */}
            {selectedStudent && (
                <ModalDialog
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="የተማሪ መረጃ ማስተካከያ (Edit Student Profile)"
                    description={`Email: ${selectedStudent.email || 'N/A'}`}
                >
                    <div className="space-y-4">
                        <CustomInput
                            label="ሙሉ ስም (Full Name)"
                            value={editFullName}
                            onChange={(e) => setEditFullName(e.target.value)}
                        />

                        <CustomInput
                            label="ስልክ ቁጥር (Phone Number)"
                            value={editPhone}
                            onChange={(e) => setEditPhone(e.target.value)}
                        />

                        <CustomInput
                            label="Global Student ID"
                            value={editGlobalId}
                            onChange={(e) => setEditGlobalId(e.target.value)}
                        />

                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-xs font-medium text-[#FDFFFC]/80">ጾታ (Gender)</label>
                                <select
                                    value={editGender}
                                    onChange={(e) => setEditGender(e.target.value as 'male' | 'female')}
                                    className="w-full bg-[#000E23] border border-white/10 text-white text-xs rounded-xl p-3 outline-none"
                                >
                                    <option value="male">ወንድ (Male)</option>
                                    <option value="female">ሴት (Female)</option>
                                </select>
                            </div>

                            <div className="flex flex-col gap-1.5 text-left">
                                <label className="text-xs font-medium text-[#FDFFFC]/80">የአካውንት ሮል (Role)</label>
                                <select
                                    value={editRole}
                                    onChange={(e) => setEditRole(e.target.value as any)}
                                    className="w-full bg-[#000E23] border border-white/10 text-white text-xs rounded-xl p-3 outline-none"
                                >
                                    <option value="student">Student</option>
                                    <option value="assistant_admin">Assistant Admin</option>
                                    <option value="owner_admin">Owner Admin</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-3">
                            <CustomButton variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
                                ሰርዝ (Cancel)
                            </CustomButton>
                            <CustomButton variant="primary" size="sm" isLoading={isSaving} onClick={handleSaveStudentProfile}>
                                መረጃውን አዝምን (Save Changes)
                            </CustomButton>
                        </div>
                    </div>
                </ModalDialog>
            )}
        </div>
    )
}