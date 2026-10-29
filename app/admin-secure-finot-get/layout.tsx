'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    CheckSquare,
    Users,
    BookOpen,
    Layers,
    BellRing,
    BarChart3,
    Settings,
    LogOut,
    ShieldAlert,
    Menu,
    X,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const [adminRole, setAdminRole] = useState<string>('')
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    // Skip layout wrapper for the admin login page
    if (pathname === '/admin-secure-finot-get/login') {
        return <>{children}</>
    }

    useEffect(() => {
        async function checkAdminAuth() {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/admin-secure-finot-get/login')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single()

            if (profile && (profile.role === 'owner' || profile.role === 'assistant_admin')) {
                setIsAdmin(true)
                setAdminRole(profile.role)
            } else {
                setIsAdmin(false)
                router.push('/dashboard/student')
            }
        }
        checkAdminAuth()
    }, [])

    const adminNavItems = [
        { name: 'Dashboard Overview', href: '/admin-secure-finot-get/dashboard', icon: LayoutDashboard },
        { name: 'Manage Enrollments', href: '/admin-secure-finot-get/enrollments', icon: CheckSquare },
        { name: 'Manage Students', href: '/admin-secure-finot-get/students', icon: Users },
        { name: 'Manage Courses', href: '/admin-secure-finot-get/courses', icon: BookOpen },
        { name: 'Manage Modules', href: '/admin-secure-finot-get/modules', icon: Layers },
        { name: 'Announcements', href: '/admin-secure-finot-get/announcements', icon: BellRing },
        { name: 'Reports & Analytics', href: '/admin-secure-finot-get/reports', icon: BarChart3 },
        { name: 'Website Settings', href: '/admin-secure-finot-get/settings', icon: Settings },
    ]

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin-secure-finot-get/login')
    }

    if (isAdmin === null) {
        return (
            <div className="min-h-screen bg-[#000E23] flex items-center justify-center text-[#00EBD4]">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-2 border-[#00EBD4] border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs font-mono">Verifying Admin Security Clearance...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#000E23] flex text-[#FDFFFC]">
            {/* Mobile Toggle Button */}
            <div className="lg:hidden fixed top-4 right-4 z-50">
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="p-2.5 rounded-xl bg-[#000E23] border border-[#FE0E33]/40 text-[#FE0E33] shadow-lg"
                >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Admin Sidebar */}
            <aside
                className={`fixed lg:static top-0 left-0 bottom-0 z-40 w-64 bg-[#000E23] border-r border-[#FE0E33]/20 flex flex-col justify-between p-4 transition-transform duration-300 ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
            >
                <div className="space-y-6 pt-2">
                    {/* Logo Header */}
                    <Link href="/" className="flex items-center gap-3 px-2">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-[#FE0E33]/50">
                            <Image src="/assets/images/finot-logo.jpg" alt="Finot Logo" fill className="object-cover" />
                        </div>
                        <div>
                            <span className="font-extrabold text-sm text-white block tracking-wider font-main">
                                FINOT <span className="text-[#FE0E33]">ADMIN</span>
                            </span>
                            <span className="text-[9px] text-[#FE0E33] font-mono tracking-widest uppercase flex items-center gap-1">
                                <ShieldAlert className="w-2.5 h-2.5 inline" />
                                {adminRole === 'owner' ? 'Owner Access' : 'Assistant Admin'}
                            </span>
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <nav className="space-y-1 pt-2">
                        {adminNavItems.map((item) => {
                            const Icon = item.icon
                            const active = pathname === item.href
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${active
                                        ? 'bg-[#FE0E33]/15 text-[#FE0E33] border border-[#FE0E33]/40 shadow-[0_0_15px_rgba(254,14,51,0.2)]'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${active ? 'text-[#FE0E33]' : 'text-gray-400'}`} />
                                    <span>{item.name}</span>
                                </Link>
                            )
                        })}
                    </nav>
                </div>

                {/* Logout */}
                <div className="pt-4 border-t border-white/10">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-[#FE0E33] hover:bg-[#FE0E33]/10 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Admin Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content View Container */}
            <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto">
                <div className="max-w-7xl mx-auto space-y-6">{children}</div>
            </main>
        </div>
    )
}