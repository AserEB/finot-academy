'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Award, Download, Lock, ExternalLink, ShieldCheck, Clock, CheckCircle, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function ClaimCertificateView() {
    const supabase = createClient()
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [studentProfile, setStudentProfile] = useState<any>(null)
    const [certificatesList, setCertificatesList] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [requestingCourseId, setRequestingCourseId] = useState<string | null>(null)

    const loadCertificatesData = async () => {
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) return
            setCurrentUser(user)

            // 1. Fetch Student Profile
            const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            setStudentProfile(profile)

            // 2. Fetch Student Verified Enrollments with Course Info
            const { data: enrollData } = await supabase
                .from('enrollments')
                .select('*, courses(id, title, slug)')
                .eq('user_id', user.id)
                .eq('status', 'verified')

            // 3. Fetch Generated/Requested Certificates for User
            const { data: certsData } = await supabase
                .from('certificates')
                .select('*')
                .eq('user_id', user.id)

            if (enrollData) {
                const combined = enrollData.map((enroll) => {
                    const existingCert = certsData?.find((c) => c.course_id === enroll.course_id)
                    const progress = enroll.progress_percentage || 0
                    const courseTitle = enroll.courses?.title || enroll.course_slug?.replace('-', ' ') || 'Course'

                    let certState = 'locked'
                    if (progress >= 80) {
                        if (!existingCert) {
                            certState = 'eligible' // 80% ደርሷል, ግን ገና አልጠየቀም
                        } else if (!existingCert.certificate_pdf_url) {
                            certState = 'requested' // ጠይቋል, አድሚን ገና አልጫነም
                        } else {
                            certState = 'granted' // አድሚን ጭኖለታል
                        }
                    }

                    return {
                        id: enroll.id,
                        courseId: enroll.course_id,
                        uniqueCourseId: enroll.unique_student_id, // ምዝገባ ላይ የፈጠርነው Course ID
                        courseTitle: courseTitle,
                        progress: progress,
                        state: certState,
                        certificateCode: existingCert?.certificate_code || enroll.unique_student_id || 'N/A',
                        issuedDate: existingCert?.issued_at ? new Date(existingCert.issued_at).toLocaleDateString() : 'Pending',
                        pdfUrl: existingCert?.certificate_pdf_url || '#',
                    }
                })

                setCertificatesList(combined)
            }
        } catch (err) {
            console.error('Error loading certificates:', err)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadCertificatesData()
    }, [])

    const handleAskCertificate = async (courseId: string, uniqueCourseId: string) => {
        if (!currentUser) return
        setRequestingCourseId(courseId)

        try {
            // "Ask Certificate" ሲል በ certificates table ላይ አዲስ ጥያቄ (Request) እንመዘግባለን
            const { error } = await supabase
                .from('certificates')
                .insert({
                    user_id: currentUser.id,
                    course_id: courseId,
                    certificate_code: uniqueCourseId, // የተማሪው Course ID እንደ ሰርተፍኬት ኮድ ያገለግላል
                })

            if (error) {
                console.error("Failed to request certificate:", error.message)
                alert("ጥያቄውን መላክ አልተቻለም! እባክዎ እንደገና ይሞክሩ።")
            } else {
                // ዳታውን ድጋሚ እናነባለን (ስቴቱን ለማዘመን)
                await loadCertificatesData()
            }
        } catch (err) {
            console.error("Error:", err)
        } finally {
            setRequestingCourseId(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="border-b border-white/10 pb-4">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                    የምስክር ወረቀቶች <span className="text-[#00EBD4]">(My Certificates)</span>
                </h1>
                <p className="text-xs text-gray-400 mt-1">
                    ከ 80% በላይ ባጠናቀቋቸው ኮርሶች የተዘጋጁ ህጋዊ የምስክር ወረቀቶችዎ ዝርዝር፡
                </p>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-10">
                    <Loader2 className="w-8 h-8 text-[#00EBD4] animate-spin" />
                </div>
            ) : certificatesList.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {certificatesList.map((cert) => (
                        <GlassCard
                            key={cert.id}
                            variant={cert.state === 'granted' ? 'glow' : 'default'}
                            className="p-6 space-y-4 flex flex-col justify-between"
                        >
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div className="p-2.5 rounded-xl bg-[#00EBD4]/10 text-[#00EBD4] border border-[#00EBD4]/30">
                                        <Award className="w-6 h-6" />
                                    </div>

                                    {cert.state === 'granted' && (
                                        <span className="px-3 py-1 rounded-full bg-[#00EBD4]/20 border border-[#00EBD4]/40 text-[#00EBD4] text-[10px] font-bold uppercase flex items-center gap-1">
                                            <ShieldCheck className="w-3.5 h-3.5" />
                                            <span>Verified & Ready</span>
                                        </span>
                                    )}
                                    {cert.state === 'requested' && (
                                        <span className="px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" />
                                            <span>Pending Admin</span>
                                        </span>
                                    )}
                                    {cert.state === 'eligible' && (
                                        <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                            <CheckCircle className="w-3.5 h-3.5" />
                                            <span>Eligible (80%+)</span>
                                        </span>
                                    )}
                                    {cert.state === 'locked' && (
                                        <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-gray-400 text-[10px] font-bold uppercase flex items-center gap-1">
                                            <Lock className="w-3 h-3 text-[#FE0E33]" />
                                            <span>Locked ({cert.progress}%)</span>
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <h3 className="text-lg font-bold text-white capitalize">{cert.courseTitle}</h3>
                                    <p className="text-xs text-gray-400 mt-0.5">
                                        ባለቤት፡ <strong className="text-white">{studentProfile?.full_name || 'Student'}</strong>
                                    </p>
                                </div>

                                {(cert.state === 'granted' || cert.state === 'requested') ? (
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-1 font-mono text-xs">
                                        <div className="flex justify-between text-gray-400 text-[11px]">
                                            <span>Course ID Code:</span>
                                            <strong className="text-[#00EBD4]">{cert.uniqueCourseId}</strong>
                                        </div>
                                        <div className="flex justify-between text-gray-400 text-[11px]">
                                            <span>Status:</span>
                                            <span className={cert.state === 'granted' ? "text-[#00EBD4]" : "text-yellow-400"}>
                                                {cert.state === 'granted' ? "Approved" : "In Review"}
                                            </span>
                                        </div>
                                    </div>
                                ) : cert.state === 'eligible' ? (
                                    <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
                                        <p>እንኳን ደስ አሎት! 80% አጠናቀዋል። ከታች ያለውን አዝራር በመጫን ሰርተፍኬትዎን ይጠይቁ። (Course ID: {cert.uniqueCourseId})</p>
                                    </div>
                                ) : (
                                    <div className="p-3 rounded-xl bg-[#FE0E33]/10 border border-[#FE0E33]/30 text-xs text-gray-300">
                                        <p>ሰርተፊኬቱን ለማስከፈት የትምህርት እድገትዎን ቢያንስ 80% ማድረስ አለብዎት (አሁን ያለዎቱ፡ {cert.progress}%)።</p>
                                    </div>
                                )}
                            </div>

                            <div className="pt-3 border-t border-white/10 flex items-center gap-2">
                                {cert.state === 'granted' && (
                                    <>
                                        <a href={cert.pdfUrl} target="_blank" rel="noreferrer" className="w-full">
                                            <CustomButton variant="primary" size="sm" fullWidth leftIcon={<Download className="w-4 h-4" />}>
                                                Download (.jpg)
                                            </CustomButton>
                                        </a>
                                        <Link href="/verify-certificate" className="w-full">
                                            <CustomButton variant="outline" size="sm" fullWidth leftIcon={<ExternalLink className="w-4 h-4" />}>
                                                Verify Code
                                            </CustomButton>
                                        </Link>
                                    </>
                                )}

                                {cert.state === 'requested' && (
                                    <CustomButton variant="outline" size="sm" fullWidth disabled>
                                        አድሚን እያረጋገጠ ነው...
                                    </CustomButton>
                                )}

                                {cert.state === 'eligible' && (
                                    <CustomButton
                                        variant="primary"
                                        size="sm"
                                        fullWidth
                                        onClick={() => handleAskCertificate(cert.courseId, cert.uniqueCourseId)}
                                        isLoading={requestingCourseId === cert.courseId}
                                    >
                                        Ask Certificate
                                    </CustomButton>
                                )}

                                {cert.state === 'locked' && (
                                    <CustomButton variant="ghost" size="sm" fullWidth disabled>
                                        ተቆልፏል (Completion &lt; 80%)
                                    </CustomButton>
                                )}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <GlassCard variant="default" className="p-8 text-center space-y-3">
                    <Award className="w-10 h-10 text-gray-500 mx-auto" />
                    <p className="text-sm font-bold text-gray-300">እስካሁን የተፈቀደ የተመዘገቡበት ኮርስ የለም</p>
                    <Link href="/courses" className="inline-block pt-1">
                        <CustomButton variant="outline" size="sm">
                            ኮርሶችን ይመልከቱ
                        </CustomButton>
                    </Link>
                </GlassCard>
            )}
        </div>
    )
}