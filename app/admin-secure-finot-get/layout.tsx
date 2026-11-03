'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, BookOpen, Layers, Users, CreditCard, BarChart2, Bell, Settings, Award, LogOut } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    const [adminSession, setAdminSession] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // የሎግ-ኢን ገፅ ላይ ከሆንን ቼክ ማድረግ አያስፈልግም
        if (pathname === '/admin-secure-finot-get/login') {
            setIsLoading(false)
            return
        }

        const sessionStr = localStorage.getItem('admin_session')
        if (!sessionStr) {
            router.push('/admin-secure-finot-get/login')
        } else {
            setAdminSession(JSON.parse(sessionStr))
            setIsLoading(false)
        }
    }, [pathname, router])

    const handleLogout = () => {
        localStorage.removeItem('admin_session')
        router.push('/admin-secure-finot-get/login')
    }

    if (pathname === '/admin-secure-finot-get/login') {
        return <>{children}</>
    }

    if (isLoading) {
        return (
            <div className="w-full min-h-screen bg-[#000E23] flex items-center justify-center text-white">
                ይጫናል...
            </div>
        )
    }

    return (
        <div className="w-full min-h-screen bg-[#000E23] text-[#FDFFFC] flex">
            {/* Sidebar */}
            <aside className="w-64 bg-[#001433] border-r border-white/10 p-6 flex flex-col justify-between hidden md:flex">
                <div className="space-y-6">
                    <div className="text-[#FE0E33] font-bold text-xl tracking-wider">FINOT ADMIN</div>
                    <nav className="space-y-2 text-sm">
                        <Link href="/admin-secure-finot-get/dashboard" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"><LayoutDashboard className="w-4 h-4 text-[#00EBD4]" /> Dashboard</Link>
                        <Link href="/admin-secure-finot-get/courses" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"><BookOpen className="w-4 h-4 text-[#00EBD4]" /> Courses</Link>
                        <Link href="/admin-secure-finot-get/modules" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"><Layers className="w-4 h-4 text-[#00EBD4]" /> Modules</Link>
                        <Link href="/admin-secure-finot-get/students" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"><Users className="w-4 h-4 text-[#00EBD4]" /> Students</Link>
                        <Link href="/admin-secure-finot-get/enrollments" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"><CreditCard className="w-4 h-4 text-[#00EBD4]" /> Enrollments</Link>
                        <Link href="/admin-secure-finot-get/certificates" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"><Award className="w-4 h-4 text-[#00EBD4]" /> Certificates</Link>
                        <Link href="/admin-secure-finot-get/announcements" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"><Bell className="w-4 h-4 text-[#00EBD4]" /> Announcements</Link>
                        <Link href="/admin-secure-finot-get/reports" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"><BarChart2 className="w-4 h-4 text-[#00EBD4]" /> Reports</Link>
                        <Link href="/admin-secure-finot-get/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition"><Settings className="w-4 h-4 text-[#00EBD4]" /> Settings</Link>
                    </nav>
                </div>
                <button onClick={handleLogout} className="flex items-center gap-3 p-3 rounded-xl text-red-400 hover:bg-red-500/10 transition text-sm">
                    <LogOut className="w-4 h-4" /> Logout ({adminSession?.username})
                </button>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}