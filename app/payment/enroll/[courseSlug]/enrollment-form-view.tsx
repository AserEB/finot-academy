'use client'

import React, { useEffect, useState, useMemo } from 'react'
import Image from 'next/image'
import {
    CheckCircle2,
    XCircle,
    Eye,
    Search,
    RefreshCw,
    Edit3,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'
import { ModalDialog } from '@/components/ui/modal-dialog'

export default function ManageEnrollmentsView() {
    const supabase = createClient()

    const [enrollments, setEnrollments] = useState<any[]>([])
    const [filterStatus, setFilterStatus] = useState<string>('all')
    const [searchTerm, setSearchTerm] = useState('')

    // Modal States
    const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null)
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)

    // Edit Form States
    const [editStatus, setEditStatus] = useState<'pending' | 'verified' | 'rejected'>('pending')
    const [editStudentId, setEditStudentId] = useState('')
    const [rejectionReason, setRejectionReason] = useState('')

    const [isProcessing, setIsProcessing] = useState(false)
    const [isLoadingData, setIsLoadingData] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    // 1. Fetch All Data Safely with explicit foreign keys
    const loadEnrollments = async () => {
        setIsLoadingData(true)
        setErrorMessage(null)
        try {
            const { data, error } = await supabase
                .from('enrollments')
                .select(`
                    id,
                    user_id,
                    course_id,
                    unique_student_id,
                    payment_receipt_url,
                    status,
                    rejection_reason,
                    created_at,
                    profiles:user_id (id, full_name, phone_number, email, unique_student_id),
                    courses:course_id (id, title, slug)
                `)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Fetch Enrollments Error:', error)
                setErrorMessage(error.message)
            } else if (data) {
                setEnrollments(data)
            }
        } catch (err: any) {
            console.error('Error loading enrollments:', err)
            setErrorMessage(err.message || 'Error loading enrollments')
        } finally {
            setIsLoadingData(false)
        }
    }

    useEffect(() => {
        loadEnrollments()
    }, [])

    // 2. Real-Time Filtering Logic
    const filteredEnrollments = useMemo(() => {
        return enrollments.filter((item) => {
            const matchesStatus = filterStatus === 'all' || item.status === filterStatus

            const query = searchTerm.toLowerCase().trim()
            if (!query) return matchesStatus

            const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
            const course = Array.isArray(item.courses) ? item.courses[0] : item.courses

            const studentName = String(profile?.full_name || '').toLowerCase()
            const studentPhone = String(profile?.phone_number || '').toLowerCase()
            const studentEmail = String(profile?.email || '').toLowerCase()
            const globalId = String(profile?.unique_student_id || '').toLowerCase()
            const courseSpecificId = String(item.unique_student_id || '').toLowerCase()
            const courseTitle = String(course?.title || '').toLowerCase()

            const matchesSearch =
                studentName.includes(query) ||
                studentPhone.includes(query) ||
                studentEmail.includes(query) ||
                globalId.includes(query) ||
                courseSpecificId.includes(query) ||
                courseTitle.includes(query)

            return matchesStatus && matchesSearch
        })
    }, [enrollments, filterStatus, searchTerm])

    // Open Edit Modal on Row Double Click
    const handleOpenEdit = (item: any) => {
        setSelectedEnrollment(item)
        setEditStatus(item.status)
        setEditStudentId(item.unique_student_id || '')
        setRejectionReason(item.rejection_reason || '')
        setIsEditModalOpen(true)
    }

    // Save Edit Changes
    const handleSaveEdit = async () => {
        if (!selectedEnrollment) return
        setIsProcessing(true)

        try {
            const updatePayload: any = {
                status: editStatus,
                unique_student_id: editStudentId,
                rejection_reason: editStatus === 'rejected' ? rejectionReason : null,
                updated_at: new Date().toISOString(),
            }

            const { error } = await supabase
                .from('enrollments')
                .update(updatePayload)
                .eq('id', selectedEnrollment.id)

            if (!error) {
                setIsEditModalOpen(false)
                await loadEnrollments()
            } else {
                alert('ማስተካከል አልተቻለም፡ ' + error.message)
            }
        } catch (err: any) {
            console.error('Save Edit Error:', err)
        } finally {
            setIsProcessing(false)
        }
    }

    // Update Status Directly
    const handleUpdateStatus = async (id: string, newStatus: 'verified' | 'rejected') => {
        setIsProcessing(true)
        try {
            const updatePayload: any = {
                status: newStatus,
                updated_at: new Date().toISOString(),
            }

            if (newStatus === 'rejected') {
                updatePayload.rejection_reason = rejectionReason.trim() || 'የተከፈለው ደረሰኝ አልተረጋገጠም'
            }

            const { error } = await supabase
                .from('enrollments')
                .update(updatePayload)
                .eq('id', id)

            if (!error) {
                setIsReceiptModalOpen(false)
                setRejectionReason('')
                await loadEnrollments()
            } else {
                alert('ስህተት አጋጥሟል፡ ' + error.message)
            }
        } catch (err: any) {
            console.error('Update status error:', err)
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        የክፍያ ማረጋገጫዎች <span className="text-[#FE0E33]">(Manage Enrollments)</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        ተማሪዎች ላይ <strong>Double-Click (ሁለት ጊዜ ጠቅ)</strong> በማድረግ መረጃዎችን ማስተካከል ይችላሉ፡
                    </p>
                </div>
                <CustomButton
                    variant="secondary"
                    size="sm"
                    onClick={loadEnrollments}
                    isLoading={isLoadingData}
                    leftIcon={<RefreshCw className="w-4 h-4" />}
                >
                    አድስ (Refresh)
                </CustomButton>
            </div>

            {errorMessage && (
                <div className="p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-200 text-xs">
                    <strong>ስህተት፡</strong> {errorMessage}
                </div>
            )}

            {/* Live Instant Search Bar */}
            <GlassCard variant="default" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-96">
                    <CustomInput
                        placeholder="በስም፣ በስልክ፣ በ Global ID፣ Course ID ወይም Email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4 text-[#00EBD4]" />}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === 'all'
                            ? 'bg-white text-black shadow-md'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        All ({enrollments.length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('pending')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === 'pending'
                            ? 'bg-yellow-500 text-black shadow-md'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        Pending ({enrollments.filter(e => e.status === 'pending').length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('verified')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === 'verified'
                            ? 'bg-[#00EBD4] text-[#000E23] shadow-md'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        Verified ({enrollments.filter(e => e.status === 'verified').length})
                    </button>
                    <button
                        onClick={() => setFilterStatus('rejected')}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${filterStatus === 'rejected'
                            ? 'bg-[#FE0E33] text-white shadow-md'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        Rejected ({enrollments.filter(e => e.status === 'rejected').length})
                    </button>
                </div>
            </GlassCard>

            {/* Table */}
            <GlassCard variant="default" className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-white/5 border-b border-white/10 text-[#00EBD4] uppercase tracking-wider">
                        <tr>
                            <th className="p-4">ተማሪ (Student)</th>
                            <th className="p-4">ኮርስ (Course)</th>
                            <th className="p-4">ቀን (Date)</th>
                            <th className="p-4">ሁኔታ (Status)</th>
                            <th className="p-4 text-center">Receipt</th>
                            <th className="p-4 text-center">ውሳኔ (Action)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {isLoadingData ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-gray-400">
                                    ዳታው እየተጫነ ነው...
                                </td>
                            </tr>
                        ) : filteredEnrollments.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="p-8 text-center text-yellow-400 font-semibold">
                                    {searchTerm ? `"${searchTerm}" የሚል መረጃ አልተገኘም!` : "ምንም አይነት የምዝገባ መረጃ አልተገኘም።"}
                                </td>
                            </tr>
                        ) : (
                            filteredEnrollments.map((item) => {
                                const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles
                                const course = Array.isArray(item.courses) ? item.courses[0] : item.courses

                                const globalId = profile?.unique_student_id || 'N/A'
                                const courseSpecificId = item.unique_student_id || 'N/A'

                                return (
                                    <tr
                                        key={item.id}
                                        onDoubleClick={() => handleOpenEdit(item)}
                                        title="Double click to edit student record"
                                        className="hover:bg-white/10 cursor-pointer transition-colors select-none"
                                    >
                                        <td className="p-4 font-bold text-white">
                                            {profile?.full_name || 'N/A'}
                                            <span className="block text-[10px] text-[#00EBD4] font-mono mt-0.5">
                                                Global ID: {globalId}
                                            </span>
                                            <span className="block text-[9px] text-gray-400 font-mono">
                                                Course ID: {courseSpecificId}
                                            </span>
                                        </td>
                                        <td className="p-4 capitalize font-medium text-gray-200">
                                            {course?.title || 'N/A'}
                                        </td>
                                        <td className="p-4 text-[11px]">{new Date(item.created_at).toLocaleDateString()}</td>
                                        <td className="p-4">
                                            {item.status === 'pending' && (
                                                <span className="px-2.5 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-[10px] font-bold">
                                                    Pending
                                                </span>
                                            )}
                                            {item.status === 'verified' && (
                                                <span className="px-2.5 py-1 rounded-full bg-[#00EBD4]/20 text-[#00EBD4] text-[10px] font-bold">
                                                    Verified
                                                </span>
                                            )}
                                            {item.status === 'rejected' && (
                                                <span className="px-2.5 py-1 rounded-full bg-[#FE0E33]/20 text-[#FE0E33] text-[10px] font-bold">
                                                    Rejected
                                                </span>
                                            )}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    setSelectedEnrollment(item)
                                                    setIsReceiptModalOpen(true)
                                                }}
                                                className="p-2 rounded-xl bg-white/10 hover:bg-[#00EBD4]/20 text-[#00EBD4] transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                        <td className="p-4 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleOpenEdit(item)
                                                    }}
                                                    className="p-2 rounded-xl bg-white/10 text-gray-300 hover:bg-white/20 transition-all"
                                                    title="Edit Record"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleUpdateStatus(item.id, 'verified')
                                                    }}
                                                    className="p-2 rounded-xl bg-[#00EBD4]/20 text-[#00EBD4] hover:bg-[#00EBD4] hover:text-[#000E23] transition-all font-bold text-[11px]"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        )}
                    </tbody>
                </table>
            </GlassCard>

            {/* Edit Modal */}
            {selectedEnrollment && (
                <ModalDialog
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    title="የተማሪ መረጃ ማስተካከያ (Edit Enrollment Data)"
                    description={`Student: ${(Array.isArray(selectedEnrollment.profiles) ? selectedEnrollment.profiles[0]?.full_name : selectedEnrollment.profiles?.full_name) || 'N/A'}`}
                >
                    <div className="space-y-4">
                        <CustomInput
                            label="Course Specific ID"
                            value={editStudentId}
                            onChange={(e) => setEditStudentId(e.target.value)}
                        />

                        <div className="flex flex-col gap-1.5 text-left">
                            <label className="text-xs font-medium text-[#FDFFFC]/80">የምዝገባ ሁኔታ (Enrollment Status)</label>
                            <select
                                value={editStatus}
                                onChange={(e) => setEditStatus(e.target.value as any)}
                                className="w-full bg-[#000E23] border border-white/10 text-white text-xs rounded-xl p-3 outline-none"
                            >
                                <option value="pending">Pending (በመጠባበቅ ላይ)</option>
                                <option value="verified">Verified (የጸደቀ)</option>
                                <option value="rejected">Rejected (ውድቅ የተደረገ)</option>
                            </select>
                        </div>

                        {editStatus === 'rejected' && (
                            <div className="space-y-1 text-left">
                                <label className="text-xs font-medium text-[#FDFFFC]/80">የመካጃ ምክንያት (Rejection Reason)</label>
                                <input
                                    type="text"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full bg-[#000E23] border border-white/10 text-white text-xs rounded-xl p-3 outline-none focus:border-[#FE0E33]"
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-3 pt-3">
                            <CustomButton variant="secondary" size="sm" onClick={() => setIsEditModalOpen(false)}>
                                ሰርዝ (Cancel)
                            </CustomButton>
                            <CustomButton variant="primary" size="sm" isLoading={isProcessing} onClick={handleSaveEdit}>
                                መረጃውን አዝምን (Save Changes)
                            </CustomButton>
                        </div>
                    </div>
                </ModalDialog>
            )}

            {/* Receipt Modal */}
            {selectedEnrollment && (
                <ModalDialog
                    isOpen={isReceiptModalOpen}
                    onClose={() => setIsReceiptModalOpen(false)}
                    title="የክፍያ ስክሪንሾት ማረጋገጫ (Receipt Preview)"
                    description={`Student: ${(Array.isArray(selectedEnrollment.profiles) ? selectedEnrollment.profiles[0]?.full_name : selectedEnrollment.profiles?.full_name) || 'Student'}`}
                >
                    <div className="space-y-4">
                        <div className="relative w-full h-80 rounded-xl overflow-hidden border border-white/20 bg-black">
                            {selectedEnrollment.payment_receipt_url ? (
                                <Image
                                    src={selectedEnrollment.payment_receipt_url}
                                    alt="Receipt"
                                    fill
                                    className="object-contain"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs">
                                    ምንም ስክሪንሾት አልተያያዘም
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-3 pt-2">
                            <CustomButton
                                variant="danger"
                                size="sm"
                                isLoading={isProcessing}
                                onClick={() => handleUpdateStatus(selectedEnrollment.id, 'rejected')}
                                leftIcon={<XCircle className="w-4 h-4" />}
                            >
                                Reject Receipt
                            </CustomButton>
                            <CustomButton
                                variant="primary"
                                size="sm"
                                isLoading={isProcessing}
                                onClick={() => handleUpdateStatus(selectedEnrollment.id, 'verified')}
                                leftIcon={<CheckCircle2 className="w-4 h-4" />}
                            >
                                Approve & Unlock
                            </CustomButton>
                        </div>
                    </div>
                </ModalDialog>
            )}
        </div>
    )
}