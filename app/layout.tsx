import type { Metadata } from 'next'
import './globals.css'
import { MainNavbar } from '@/components/main-navbar'
import { MainFooter } from '@/components/main-footer'

export const metadata: Metadata = {
    title: 'Finot Academy | Digital Skills & Enterprise LMS',
    description:
        'ለተማሪዎችና ለሌሎች የዲጂታል ክህሎቶችን ማዳበር ለሚፈልጉ ሰዎች ተደራሽና ጥራት ያለው የኦንላይን ትምህርት መድረክ። Graphics Design, Video Editing, SMM እና Prompt Engineering ይማሩ።',
    keywords: [
        'Finot Academy',
        'finotacademy.tech',
        'Ethiopia Online Learning',
        'Graphics Design Course Ethiopia',
        'Video Editing Premiere Pro',
        'Social Media Marketing Ethiopia',
        'Prompt Engineering Amharic',
    ],
    authors: [
        { name: 'Bereket' },
        { name: 'Nuhamin' },
        { name: 'Biruk' },
        { name: 'Lidet' },
    ],
    icons: {
        icon: '/favicon.ico',
    },
    manifest: '/site.webmanifest',
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" className="dark">
            <body className="bg-[#000E23] text-[#FDFFFC] min-h-screen flex flex-col antialiased selection:bg-[#FE0E33] selection:text-white">
                {/* Global Navigation Header */}
                <MainNavbar />

                {/* Main Route Content Shell */}
                <main className="flex-grow">{children}</main>

                {/* Global Footer */}
                <MainFooter />
            </body>
        </html>
    )
}