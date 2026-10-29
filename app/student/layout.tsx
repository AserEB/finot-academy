'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    BookOpen,
    TrendingUp,
    Award,
    Bell,
    User,
    Key,
    LogOut,
    Menu,
    X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

    const studentNavItems = [
        { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
        { name: 'My Courses', href: '/student/my-courses', icon: BookOpen },
        { name: 'My Progress', href: '/student/my-progress', icon: TrendingUp },
        { name: 'Certificates', href: '/student/certificates', icon: Award },
        { name: 'Notifications', href: '/student/notifications', icon: Bell },
        { name: 'Profile Settings', href: '/student/profile', icon: User },
        { name: 'Change Password', href: '/student/change-password', icon: Key },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const isActive = (href: string) => pathname === href

    return (
        <div className="min-h-screen bg-[#000E23] flex text-[#FDFFFC]">
            {/* Mobile Menu Toggle Button */}
            <div className="lg:hidden fixed top-20 right-4 z-50">
                <button
                    onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    className="p-2.5 rounded-xl bg-[#000E23]/90 border border-[#00EBD4]/40 text-[#00EBD4] shadow-lg backdrop-blur-md"
                >
                    {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Sidebar Navigation Container */}
            <aside
                className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-64 bg-[#000E23]/95 border-r border-[#00EBD4]/15 flex flex-col justify-between p-4 transition-transform duration-300 ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="space-y-6 pt-4">
                    {/* Logo Brand Header */}
                    <Link href="/" className="flex items-center gap-3 px-2">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#00EBD4]/40">
                            <Image
                                src="/assets/images/finot-logo.jpg"
                                alt="Finot Logo"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div>
                            <span className="font-extrabold text-sm text-white block tracking-wider">
                                FINOT <span className="text-[#FE0E33]">STUDENT</span>
                            </span>
                            <span className="text-[9px] text-[#00EBD4] font-mono tracking-widest uppercase">
                                Learning Portal
                            </span>
                        </div>
                    </Link>

                    {/* Nav Items List */}
                    <nav className="space-y-1.5 pt-2">
                        {studentNavItems.map((item) => {
                            const Icon = item.icon
                            const active = isActive(item.href)
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileSidebarOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${active
                                        ? 'bg-[#00EBD4]/15 text-[#00EBD4] border border-[#00EBD4]/30 shadow-[0_0_15px_rgba(0,235,212,0.15)]'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${active ? 'text-[#00EBD4]' : 'text-gray-400'}`} />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Sidebar Footer - Logout */}
                <div className="pt-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#FE0E33] hover:bg-[#FE0E33]/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto space-y-6">{children}</div>
            </main>
        </div>
    )
}