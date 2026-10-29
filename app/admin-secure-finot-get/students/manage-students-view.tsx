'use client'

import React, { useEffect, useState } from 'react'
import { Search, Users, Shield, Phone, Mail, Award } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'

export default function ManageStudentsView() {
    const supabase = createClient()
    const [students, setStudents] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        async function fetchStudents() {
            const { data } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })

            setStudents(data || [])
        }
        fetchStudents()
    }, [])

    const filtered = students.filter(
        (s) =>
            s.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.unique_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            s.phone?.includes(searchTerm)
    )

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የተማሪዎች አስተዳደር <span className="text-[#FE0E33]">(Manage Students)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    በሲስተሙ የተመዘገቡ ተማሪዎች ዝርዝር እና መረጃዎቻቸው፡
                </p>
            </div>

            <GlassCard variant="default" className="p-4">
                <div className="w-full sm:w-80">
                    <CustomInput
                        placeholder="በስም፣ በ Unique ID ወይም ስልክ ፈልግ..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        leftIcon={<Search className="w-4 h-4 text-[#FE0E33]" />}
                    />
                </div>
            </GlassCard>

            <GlassCard variant="default" className="p-0 overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                    <thead className="bg-white/5 border-b border-white/10 text-[#00EBD4] uppercase tracking-wider">
                        <tr>
                            <th className="p-4">Unique ID</th>
                            <th className="p-4">ሙሉ ስም (Full Name)</th>
                            <th className="p-4">ስልክ (Phone)</th>
                            <th className="p-4">ጾታ (Gender)</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">የተመዘገበበት ቀን</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {filtered.map((student) => (
                            <tr key={student.id} className="hover:bg-white/5 transition-colors">
                                <td className="p-4 font-mono font-bold text-[#00EBD4]">{student.unique_id || 'N/A'}</td>
                                <td className="p-4 font-bold text-white">{student.full_name || 'N/A'}</td>
                                <td className="p-4">{student.phone || 'N/A'}</td>
                                <td className="p-4">{student.gender || 'N/A'}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${student.role === 'owner' ? 'bg-[#FE0E33]/20 text-[#FE0E33]' : 'bg-[#00EBD4]/20 text-[#00EBD4]'
                                        }`}>
                                        {student.role || 'student'}
                                    </span>
                                </td>
                                <td className="p-4 text-[11px]">{new Date(student.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </GlassCard>
        </div>
    )
}