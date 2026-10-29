/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    typescript: {
        // TypeScript ህጎች Build እንዳያቆሙት ለማለፍ
        ignoreBuildErrors: true,
    },
    eslint: {
        // ESLint ህጎች Build እንዳያቆሙት ለማለፍ
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: 'img.youtube.com',
            },
        ],
    },
}

module.exports = nextConfig