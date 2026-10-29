'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
    CheckCircle2,
    XCircle,
    Eye,
    Clock,
    Search,
    CheckSquare,
    Filter,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'
import { ModalDialog } from '@/components/ui/modal-dialog'

export default function ManageEnrollmentsView() {
    const supabase = createClient()

    const [enrollments, setEnrollments] = useState<any[]>([])
    const [filterStatus, setFilterStatus] = useState<string>('pending')
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedEnrollment, setSelectedEnrollment] = useState<any | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)

    const loadEnrollments = async () => {
        const { data } = await supabase
            .from('enrollments')
            .select('*, profiles(full_name, phone, unique_id)')
            .order('created_at', { ascending: false })

        setEnrollments(data || [])
    }

    useEffect(() => {
        loadEnrollments()
    }, [])

    // State Machine Action: Update status to 'verified' or 'rejected'
    const handleUpdateStatus = async (id: string, newStatus: 'verified' | 'rejected') => {
        setIsProcessing(true)
        try {
            const { error } = await supabase
                .from('enrollments')
                .update({ status: newStatus })
                .eq('id', id)

            if (!error) {
                setIsModalOpen(false)
                loadEnrollments()
            }
        } catch (err) {
            console.error('Update status error:', err)
        } finally {
            setIsProcessing(false)
        }
    }

    const filtered = enrollments.filter((item) => {
        const matchesStatus = filterStatus === 'all' || item.status === filterStatus
        const matchesSearch =
            item.course_slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
    })

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የክፍያ ማረጋገጫዎች <span className="text-[#FE0E33]">(Manage Enrollments)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    ተማሪዎች የላኳቸውን የደመወዝ/ክፍያ ደረሰኞች (Receipts) በማረጋገጥ ወደ ኮርሱ ያስገቡ፡
                </p>
            </div>

            {/* Filter and Search Bar */}
            <GlassCard variant="default" className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="w-full sm:w-80">
                    <CustomInput
                        placeholder="በተማሪ ስም ወይም ኮርስ ፈልግ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4 text-[#FE0E33]" />}
                    />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                        onClick={() => setFilterStatus('pending')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterStatus === 'pending'
                            ? 'bg-yellow-500 text-black shadow-md'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setFilterStatus('verified')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterStatus === 'verified'
                            ? 'bg-[#00EBD4] text-[#000E23] shadow-md'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        Verified
                    </button>
                    <button
                        onClick={() => setFilterStatus('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${filterStatus === 'all'
                            ? 'bg-[#FE0E33] text-white shadow-md'
                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                    >
                        All
                    </button>
                </div>
            </GlassCard>

            {/* Enrollment Table */}
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
                        {filtered.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-bold text-white">
                                    {item.profiles?.full_name || 'N/A'}
                                    <span className="block text-[10px] text-gray-400 font-mono">
                                        {item.profiles?.unique_id || ''}
                                    </span>
                                </td>
                                <td className="p-4 capitalize">{item.course_slug.replace('-', ' ')}</td>
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
                                        onClick={() => {
                                            setSelectedEnrollment(item)
                                            setIsModalOpen(true)
                                        }}
                                        className="p-1.5 rounded-lg bg-white/10 hover:bg-[#00EBD4]/20 text-[#00EBD4] transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                                <td className="p-4 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(item.id, 'verified')}
                                            className="p-1.5 rounded-lg bg-[#00EBD4]/20 text-[#00EBD4] hover:bg-[#00EBD4] hover:text-[#000E23] transition-all"
                                            title="Approve"
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleUpdateStatus(item.id, 'rejected')}
                                            className="p-1.5 rounded-lg bg-[#FE0E33]/20 text-[#FE0E33] hover:bg-[#FE0E33] hover:text-white transition-all"
                                            title="Reject"
                                        >
                                            <XCircle className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassCard>

            {/* Receipt Preview Modal */}
            {selectedEnrollment && (
                <ModalDialog
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    title="የክፍያ ስክሪንሾት ማረጋገጫ (Receipt Preview)"
                    description={`Student: ${selectedEnrollment.profiles?.full_name || 'Student'}`}
                >
                    <div className="space-y-4">
                        <div className="relative w-full h-80 rounded-xl overflow-hidden border border-white/20 bg-black">
                            {selectedEnrollment.receipt_url ? (
                                <Image
                                    src={selectedEnrollment.receipt_url}
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
                                Approve & Unlock Course
                            </CustomButton>
                        </div>
                    </div>
                </ModalDialog>
            )}
        </div>
    )
}