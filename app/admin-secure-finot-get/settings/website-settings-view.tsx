'use client'

import React, { useState } from 'react'
import { Settings, Save, CheckCircle2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'
import { CustomInput } from '@/components/ui/custom-input'
import { CustomButton } from '@/components/ui/custom-button'

export default function WebsiteSettingsView() {
  const [telebirr, setTelebirr] = useState('0911223344')
  const [cbe, setCbe] = useState('1000123456789')
  const [saved, setSaved] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="border-b border-white/10 pb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FDFFFC] font-main">
          የዌብሳይት ቅንብሮች <span className="text-[#FE0E33]">(Website Settings)</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          የክፍያ አካውንት ቁጥሮችንና አጠቃላይ የሲስተሙን መረጃዎች እዚህ ያስተካክሉ፡
        </p>
      </div>

      <GlassCard variant="glow" className="p-8 max-w-xl space-y-6">
        <form onSubmit={handleSave} className="space-y-4">
          <CustomInput
            label="Telebirr Account Number"
            value={telebirr}
            onChange={(e) => setTelebirr(e.target.value)}
            required
          />

          <CustomInput
            label="CBE Account Number"
            value={cbe}
            onChange={(e) => setCbe(e.target.value)}
            required
          />

          {saved && (
            <div className="p-3 rounded-xl bg-[#00EBD4]/20 text-[#00EBD4] text-xs font-semibold text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>ቅንብሮቹ በስኬት ተቀምጠዋል!</span>
            </div>
          )}

          <CustomButton type="submit" variant="danger" fullWidth leftIcon={<Save className="w-4 h-4" />}>
            ቅንብሮችን አዝምን (Save Settings)
          </CustomButton>
        </form>
      </GlassCard>
    </div>
  )
}