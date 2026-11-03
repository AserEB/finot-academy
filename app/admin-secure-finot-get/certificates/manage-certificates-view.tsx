'use client'

import React, { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'
import { Loader2, UploadCloud, CheckCircle, Clock } from 'lucide-react'

export default function ManageCertificatesView() {
    const supabase = createClient()
    const [requests, setRequests] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [uploadingId, setUploadingId] = useState<string | null>(null)

    const fetchRequests = async () => {
        setIsLoading(true)
        try {
            // የሰርተፊኬት ጥያቄዎችን ከተማሪው እና ከኮርሱ መረጃ ጋር እናመጣለን
            const { data, error } = await supabase
                .from('certificates')
                .select(`
                    id,
                    certificate_code,
                    certificate_pdf_url,
                    created_at,
                    profiles ( full_name, email ),
                    courses ( title )
                `)
                .order('created_at', { ascending: false })

            if (error) throw error
            setRequests(data || [])
        } catch (err) {
            console.error('Error fetching certificates:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, certId: string, certCode: string) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingId(certId)
        try {
            // 1. ፋይሉን Supabase Storage (certificates bucket) ላይ መጫን
            const fileExt = file.name.split('.').pop()
            const fileName = `${certCode}-${Date.now()}.${fileExt}`
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('certificates')
                .upload(fileName, file)

            if (uploadError) throw uploadError

            // 2. የፋይሉን Public URL ማግኘት
            const { data: { publicUrl } } = supabase.storage
                .from('certificates')
                .getPublicUrl(fileName)

            // 3. ዳታቤዙን በ Public URL ማዘመን (Grant ማድረግ)
            const { error: updateError } = await supabase
                .from('certificates')
                .update({
                    certificate_pdf_url: publicUrl,
                    issued_at: new Date().toISOString()
                })
                .eq('id', certId)

            if (updateError) throw updateError

            alert('ሰርተፊኬቱ በተሳካ ሁኔታ ተጭኗል (Granted)!')
            fetchRequests() // ሪፍሬሽ ለማድረግ
        } catch (err: any) {
            console.error('Upload error:', err)
            alert('ፋይሉን መጫን አልተቻለም: ' + err.message)
        } finally {
            setUploadingId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">የሰርተፊኬት ጥያቄዎች (Certificate Requests)</h1>
                <p className="text-sm text-gray-400">የተማሪዎችን ጥያቄ ይመልከቱ እና ሰርተፊኬቶችን (JPG) ይጫኑ</p>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-[#00EBD4] animate-spin" />
                </div>
            ) : requests.length === 0 ? (
                <GlassCard className="p-8 text-center text-gray-400">
                    ምንም የተጠየቀ ሰርተፊኬት የለም።
                </GlassCard>
            ) : (
                <div className="grid gap-4">
                    {requests.map((req) => (
                        <GlassCard key={req.id} className="p-4 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div>
                                <h3 className="text-white font-bold">{req.profiles?.full_name} <span className="text-xs text-gray-400">({req.profiles?.email})</span></h3>
                                <p className="text-sm text-[#00EBD4]">{req.courses?.title}</p>
                                <p className="text-xs text-gray-500 mt-1">Course ID / Cert Code: {req.certificate_code}</p>
                            </div>

                            <div className="flex items-center gap-3">
                                {!req.certificate_pdf_url ? (
                                    <>
                                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> Requested
                                        </span>
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/jpeg, image/png"
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                onChange={(e) => handleFileUpload(e, req.id, req.certificate_code)}
                                                disabled={uploadingId === req.id}
                                            />
                                            <CustomButton
                                                variant="primary"
                                                size="sm"
                                                isLoading={uploadingId === req.id}
                                                leftIcon={<UploadCloud className="w-4 h-4" />}
                                            >
                                                Upload & Grant
                                            </CustomButton>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" /> Granted
                                        </span>
                                        <a href={req.certificate_pdf_url} target="_blank" rel="noreferrer">
                                            <CustomButton variant="outline" size="sm">View File</CustomButton>
                                        </a>
                                    </>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            )}
        </div>
    )
}