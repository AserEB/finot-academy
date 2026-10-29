'use client'

import React from 'react'
import { Layers, Plus, Video, Link as LinkIcon } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomButton } from '@/components/ui/custom-button'

export default function ManageModulesView() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
                        የሞጁሎች አስተዳደር <span className="text-[#FE0E33]">(Manage Modules)</span>
                    </h1>
                    <p className="text-xs text-gray-400 mt-1">
                        የቪዲዮ ትምህርቶችን እና የ YouTube ሊንኮችን ማስተካከያ፡
                    </p>
                </div>
                <CustomButton variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                    አዲስ ሞጁል አክል
                </CustomButton>
            </div>

            <GlassCard variant="default" className="p-6 text-center space-y-3">
                <Layers className="w-10 h-10 text-[#00EBD4] mx-auto" />
                <h3 className="text-base font-bold text-white">የሞጁሎች ማውጫ</h3>
                <p className="text-xs text-gray-400">
                    የተደራጁትን የ 4ቱን ኮርሶች የትምህርት ቪዲዮዎች እዚህ ማስተካከል ይችላሉ።
                </p>
            </GlassCard>
        </div>
    )
}