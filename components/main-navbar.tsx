'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, BookOpen, User, LogIn, Sparkles } from 'lucide-react'
import { CustomButton } from '@/components/ui/custom-button'

export const MainNavbar: React.FC = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const pathname = usePathname()

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'All Courses', href: '/courses' },
        { name: 'About Us', href: '/about' },
        { name: 'Contact Us', href: '/contact' },
        { name: 'FAQ', href: '/faq' },
    ]

    const isActive = (path: string) => pathname === path

    return (
        <header className="sticky top-0 z-40 w-full bg-[#000E23]/90 backdrop-blur-md border-b border-[#00EBD4]/15 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">

                    {/* Logo Section */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#00EBD4]/40 group-hover:border-[#FE0E33] transition-colors shadow-[0_0_15px_rgba(0,235,212,0.2)]">
                            <Image
                                src="/assets/images/finot-logo.jpg"
                                alt="Finot Academy Logo"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-xl font-extrabold text-[#FDFFFC] tracking-wider font-main group-hover:text-[#00EBD4] transition-colors">
                                FINOT <span className="text-[#FE0E33]">ACADEMY</span>
                            </span>
                            <span className="text-[10px] text-[#00EBD4] tracking-widest font-mono uppercase">
                                Digital Skills
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex items-center gap-1 bg-white/5 p-1.5 rounded-2xl border border-white/10">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 relative ${isActive(link.href)
                                    ? 'text-[#00EBD4] bg-[#00EBD4]/10 shadow-[0_0_10px_rgba(0,235,212,0.2)]'
                                    : 'text-[#FDFFFC]/80 hover:text-[#FDFFFC] hover:bg-white/5'
                                    }`}
                            >
                                {link.name}
                                {isActive(link.href) && (
                                    <motion.div
                                        layoutId="activeNavIndicator"
                                        className="absolute bottom-0 left-2 right-2 h-0.5 bg-[#00EBD4] rounded-full"
                                    />
                                )}
                            </Link>
                        ))}
                    </nav>

                    {/* Auth Action Buttons */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link href="/login">
                            <CustomButton
                                variant="ghost"
                                size="sm"
                                leftIcon={<LogIn className="w-4 h-4 text-[#00EBD4]" />}
                            >
                                Login
                            </CustomButton>
                        </Link>
                        <Link href="/signup">
                            <CustomButton
                                variant="primary"
                                size="sm"
                                leftIcon={<Sparkles className="w-4 h-4 animate-spin" />}
                            >
                                Sign Up
                            </CustomButton>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 rounded-xl text-[#FDFFFC] bg-white/5 border border-white/10 hover:text-[#00EBD4] transition-colors"
                        >
                            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-[#00EBD4]/15 bg-[#000E23]/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-3"
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className={`block px-4 py-3 rounded-xl text-base font-semibold transition-colors ${isActive(link.href)
                                    ? 'text-[#00EBD4] bg-[#00EBD4]/10 border border-[#00EBD4]/30'
                                    : 'text-[#FDFFFC]/80 hover:bg-white/5 hover:text-[#FDFFFC]'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}

                        <div className="pt-4 border-t border-white/10 flex flex-col gap-2.5">
                            <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                                <CustomButton variant="outline" fullWidth leftIcon={<LogIn className="w-4 h-4" />}>
                                    Login
                                </CustomButton>
                            </Link>
                            <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                                <CustomButton variant="primary" fullWidth leftIcon={<Sparkles className="w-4 h-4" />}>
                                    Sign Up
                                </CustomButton>
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}