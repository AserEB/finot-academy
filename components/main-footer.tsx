'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Send, Mail, Youtube, Linkedin, Twitter, Instagram, ShieldCheck, Heart } from 'lucide-react'

export const MainFooter: React.FC = () => {
    return (
        <footer className="bg-[#000E23] border-t border-[#00EBD4]/20 text-[#FDFFFC] relative overflow-hidden">
            {/* Background Decorative Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#FE0E33]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#00EBD4]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

                    {/* Column 1: Brand Info */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-[#00EBD4]/40">
                                <Image
                                    src="/assets/images/finot-logo.jpg"
                                    alt="Finot Academy Logo"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <span className="text-xl font-extrabold tracking-wider font-main">
                                FINOT <span className="text-[#FE0E33]">ACADEMY</span>
                            </span>
                        </Link>
                        <p className="text-xs text-[#FDFFFC]/70 leading-relaxed">
                            ዛሬ እውቀትን ያግኙ፣ ነገን በብቃት ይፍጠሩ! በግራፊክስ፣ ቪዲዮ አርትዖት፣ SMM እና Prompt Engineering የዲጂታል ክህሎቶችዎን በከፍተኛ ጥራት ያዳብሩ።
                        </p>
                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://t.me/finotacademy"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#00EBD4] hover:bg-[#00EBD4] hover:text-[#000E23] transition-all"
                                title="Telegram"
                            >
                                <Send className="w-4 h-4" />
                            </a>
                            <a
                                href="https://youtube.com/@finotacademy"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#FE0E33] hover:bg-[#FE0E33] hover:text-white transition-all"
                                title="YouTube"
                            >
                                <Youtube className="w-4 h-4" />
                            </a>
                            <a
                                href="https://instagram.com/finotacademy"
                                target="_blank"
                                rel="noreferrer"
                                className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-[#00EBD4] hover:bg-[#00EBD4] hover:text-[#000E23] transition-all"
                                title="Instagram"
                            >
                                <Instagram className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#00EBD4] uppercase tracking-wider">
                            Quick Links
                        </h4>
                        <ul className="space-y-2 text-xs text-[#FDFFFC]/80">
                            <li>
                                <Link href="/courses" className="hover:text-[#00EBD4] transition-colors">
                                    All Courses
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="hover:text-[#00EBD4] transition-colors">
                                    About Us (ስለ እኛ)
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-[#00EBD4] transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-[#00EBD4] transition-colors">
                                    FAQ (ጥያቄዎች)
                                </Link>
                            </li>
                            <li>
                                <Link href="/verify-certificate" className="hover:text-[#00EBD4] transition-colors">
                                    Verify Certificate
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Legal & Support */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#00EBD4] uppercase tracking-wider">
                            Legal & Policies
                        </h4>
                        <ul className="space-y-2 text-xs text-[#FDFFFC]/80">
                            <li>
                                <Link href="/terms" className="hover:text-[#00EBD4] transition-colors">
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-[#00EBD4] transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li className="pt-2 text-[11px] text-gray-400">
                                <span className="text-[#FE0E33] font-semibold">Security Note:</span> Screen recording and downloads are strictly restricted for safety.
                            </li>
                        </ul>
                    </div>

                    {/* Column 4: Contact & Team Info */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-[#00EBD4] uppercase tracking-wider">
                            Official Support
                        </h4>
                        <div className="space-y-2.5 text-xs text-[#FDFFFC]/80">
                            <div className="flex items-center gap-2">
                                <Send className="w-4 h-4 text-[#00EBD4]" />
                                <span>Telegram Support: <strong className="text-[#FDFFFC]">@BereketPixels</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[#FE0E33]" />
                                <span>Email: <strong className="text-[#FDFFFC]">nuhitavisuals@gmail.com</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-4 h-4 text-[#00EBD4]" />
                                <span>Social Handle: <strong className="text-[#FDFFFC]">@finotacademy</strong></span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-4">
                    <p>© 2026 Finot Academy. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Built with <Heart className="w-3.5 h-3.5 text-[#FE0E33] fill-current inline" /> by <span className="text-[#00EBD4] font-semibold">Bereket, Nuhamin, Biruk & Lidet</span>
                    </p>
                </div>
            </div>
        </footer>
    )
}