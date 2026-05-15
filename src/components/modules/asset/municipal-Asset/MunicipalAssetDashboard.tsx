'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  Landmark,
  Building,
  Truck as TruckIcon,
  Plus,
  ChevronRight,
  Home,
  ArrowRight,
  BarChart3,
  Layers,
  BadgeInfo
} from 'lucide-react';
import { useRouter } from 'next/navigation';

// Mock data to match Figma logic
const mockMunicipalAssets = [
  { id: '1', category: 'building', status: 'Excellent', health: 95, valueLakhs: 500, subCategory: 'Municipal Office' },
  { id: '2', category: 'building', status: 'Good', health: 80, valueLakhs: 300, subCategory: 'School' },
  { id: '3', category: 'land', status: 'Excellent', health: 100, valueLakhs: 1000, subCategory: 'Public Park' },
  { id: '4', category: 'infrastructure', status: 'Good', health: 75, valueLakhs: 1500, subCategory: 'Bridge' },
  { id: '5', category: 'movable', status: 'Fair', health: 60, valueLakhs: 200, subCategory: 'Garbage Truck' },
];

export default function MunicipalAssetDashboard() {
  const router = useRouter();
  const [visibleExamples, setVisibleExamples] = useState<Record<string, number>>({
    building: 5,
    land: 5,
    infrastructure: 5,
    movable: 5
  });

  const assetCategories = [
    {
      id: 'building',
      name: 'Building Assets',
      icon: Building2,
      color: 'from-blue-500 to-blue-700',
      description: 'Municipal offices, hospitals, schools, community halls, staff quarters',
      examples: ['Municipal Office', 'Zonal Office', 'Ward Office', 'Hospital', 'Dispensary', 'School', 'Library']
    },
    {
      id: 'land',
      name: 'Land Assets',
      icon: Landmark,
      color: 'from-green-500 to-green-700',
      description: 'Municipal lands, plots, markets, parks, gardens, reserved lands',
      examples: ['Open Plot', 'Reserved Land', 'Public Garden', 'Playground', 'Parking Land']
    },
    {
      id: 'infrastructure',
      name: 'Infrastructural Assets',
      icon: Building,
      color: 'from-purple-500 to-purple-700',
      description: 'Roads, bridges, drains, water systems, street infrastructure',
      examples: ['Road', 'Bridge', 'Culvert', 'Drain', 'Water Tank', 'Street Light']
    },
    {
      id: 'movable',
      name: 'Movable Assets',
      icon: TruckIcon,
      color: 'from-orange-500 to-orange-700',
      description: 'Vehicles, machinery, equipment, computers, furniture',
      examples: ['Garbage Truck', 'Ambulance', 'Fire Engine', 'JCB', 'Tractor', 'Computer']
    }
  ];

  const themes: Record<string, any> = {
    building: {
      hero: 'from-[#1e3a8a] via-[#1d4ed8] to-[#3b82f6]',
      heroBorder: 'border-blue-400/30',
      iconRing: 'ring-blue-300/40',
      statBg: 'bg-blue-50', statBorder: 'border-blue-200',
      statText: 'text-blue-900', statLabel: 'text-blue-600',
      chipBg: 'bg-blue-50', chipBorder: 'border-blue-300',
      chipText: 'text-blue-900', chipHover: 'hover:bg-blue-100 hover:border-blue-500',
      dot: 'bg-blue-500', accentBar: 'bg-blue-500',
    },
    land: {
      hero: 'from-[#064e3b] via-[#059669] to-[#34d399]',
      heroBorder: 'border-emerald-400/30',
      iconRing: 'ring-emerald-300/40',
      statBg: 'bg-emerald-50', statBorder: 'border-emerald-200',
      statText: 'text-emerald-900', statLabel: 'text-emerald-700',
      chipBg: 'bg-emerald-50', chipBorder: 'border-emerald-300',
      chipText: 'text-emerald-900', chipHover: 'hover:bg-emerald-100 hover:border-emerald-500',
      dot: 'bg-emerald-500', accentBar: 'bg-emerald-500',
    },
    infrastructure: {
      hero: 'from-[#3b0764] via-[#7c3aed] to-[#a78bfa]',
      heroBorder: 'border-violet-400/30',
      iconRing: 'ring-violet-300/40',
      statBg: 'bg-violet-50', statBorder: 'border-violet-200',
      statText: 'text-violet-900', statLabel: 'text-violet-700',
      chipBg: 'bg-violet-50', chipBorder: 'border-violet-300',
      chipText: 'text-violet-900', chipHover: 'hover:bg-violet-100 hover:border-violet-500',
      dot: 'bg-violet-500', accentBar: 'bg-violet-500',
    },
    movable: {
      hero: 'from-[#7c2d12] via-[#ea580c] to-[#fb923c]',
      heroBorder: 'border-orange-400/30',
      iconRing: 'ring-orange-300/40',
      statBg: 'bg-orange-50', statBorder: 'border-orange-200',
      statText: 'text-orange-900', statLabel: 'text-orange-700',
      chipBg: 'bg-orange-50', chipBorder: 'border-orange-300',
      chipText: 'text-orange-900', chipHover: 'hover:bg-orange-100 hover:border-orange-500',
      dot: 'bg-orange-500', accentBar: 'bg-orange-500',
    },
  };

  const handleAddNew = () => {
    router.push('/asset/municipal-Asset/add-New-Asset/identification');
  };

  return (
    <div className="space-y-0 pb-4">
      {/* ── PAGE HEADER ── */}
      <div className="bg-white border-b border-municipal-primary/10 px-6 pt-4 pb-0 rounded-t-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 blur-[4px] opacity-40" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-700 flex items-center justify-center shadow-lg">
                <Building2 className="w-5 h-5 text-white drop-shadow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-[#1a1a2e] leading-tight tracking-tight">Asset Management</h1>
                <span className="px-1.5 py-0.5 rounded-full bg-violet-100 border border-violet-300 text-[8px] font-bold text-violet-700 tracking-wide uppercase">MC-EMS</span>
              </div>
              <p className="text-[10px] mt-0.5 flex items-center gap-1 font-medium">
                <span className="text-violet-600 font-bold">मालमत्ता व्यवस्थापन</span>
                <span className="w-0.5 h-0.5 rounded-full bg-slate-300 inline-block" />
                <span className="text-slate-400">Municipal Corporation Estate Management System</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-slate-50 to-violet-50 border border-violet-200/60 shadow-sm flex-shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse flex-shrink-0" />
              <div className="text-right">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-0.5">Updated</p>
                <p className="text-[10px] font-bold text-slate-700 leading-none">14 May 2026 • 03:30 pm</p>
              </div>
            </div>
            <motion.button
              whileHover={{ x: -2 }}
              onClick={() => router.back()}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-slate-200 transition-colors"
            >
              <ChevronRight className="w-3 h-3 rotate-180" />
              Back
            </motion.button>
          </div>
        </div>

        {/* ── ACTION TOOLBAR ── */}
        <div className="flex items-center justify-between py-2 border-t border-municipal-primary/8">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-lg border border-blue-100">
              <Building2 className="w-3 h-3 text-blue-600" />
              <span className="text-[10px] text-blue-600 font-bold">Total Assets:</span>
              <span className="text-[10px] text-blue-900 font-black">102</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 rounded-lg border border-emerald-100">
              <span className="text-[10px] text-emerald-700 font-bold">Categories:</span>
              <span className="text-[10px] text-emerald-800 font-black">4</span>
            </div>
          </div>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md hover:shadow-lg hover:opacity-95 transition-all text-[11px] font-bold"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Asset
          </button>
        </div>
      </div>

      {/* ── CATEGORY CARDS GRID ── */}
      <div className="px-8 pt-5 pb-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {assetCategories.map((category, cardIdx) => {
            const Icon = category.icon;
            const t = themes[category.id] || themes.building;
            const catAssets = mockMunicipalAssets.filter(a => a.category === category.id);
            const totalValueCr = (catAssets.reduce((s, a) => s + a.valueLakhs, 0) / 100).toFixed(2);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: cardIdx * 0.07 }}
                className={`group relative rounded-2xl overflow-hidden shadow-md border ${t.heroBorder} bg-white flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
              >
                {/* ── HERO BANNER ── */}
                <div className={`relative bg-gradient-to-br ${category.id === 'building' ? 'from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd]' :
                  category.id === 'land' ? 'from-[#f7fee7] via-[#ecfccb] to-[#d9f99d]' :
                    category.id === 'infrastructure' ? 'from-[#fdf4ff] via-[#fae8ff] to-[#f5d0fe]' :
                      'from-[#fffbeb] via-[#fef3c7] to-[#fde68a]'
                  } px-4 pt-4 pb-12 overflow-hidden flex-shrink-0`}>

                  <div className={`absolute inset-0 bg-gradient-to-br ${t.hero} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                  <div className="relative z-[2] flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 flex-1 min-w-0">
                      <div className={`relative w-10 h-10 rounded-lg ring-2 ${t.iconRing} flex items-center justify-center shadow-lg flex-shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden`}>
                        <div className={`absolute inset-0 ${t.dot} opacity-100 group-hover:opacity-0 transition-opacity duration-300`} />
                        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Icon className="relative z-10 w-5 h-5 text-white" />
                      </div>

                      <div className="min-w-0">
                        <h3 className={`text-slate-900 group-hover:text-white text-[15px] font-black leading-tight truncate transition-colors duration-300`}>
                          {category.name}
                        </h3>
                        <p className={`text-slate-500 group-hover:text-white/90 text-[9px] mt-0.5 font-medium leading-snug line-clamp-2 transition-colors duration-300`}>
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className={`flex-shrink-0 bg-white/70 group-hover:bg-white/15 group-hover:border-white/25 backdrop-blur-sm border rounded-lg px-2.5 py-1.5 text-right transition-all duration-300`}>
                      <p className={`text-slate-400 group-hover:text-white/80 text-[8px] font-bold uppercase tracking-widest leading-none transition-colors duration-300`}>
                        Value
                      </p>
                      <p className={`text-slate-900 group-hover:text-white text-xs font-black mt-0.5 leading-none transition-colors duration-300`}>
                        ₹{totalValueCr} Cr
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── STAT CARD ── */}
                <div className="relative -mt-7 mx-4 z-10 flex-shrink-0">
                  <div className={`${t.statBg} border ${t.statBorder} rounded-xl shadow-lg overflow-hidden p-2.5`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${t.statBg}`}>
                          <BarChart3 className={`w-3.5 h-3.5 ${t.statText}`} />
                        </div>
                        <div>
                          <p className={`text-[8px] font-bold uppercase tracking-widest ${t.statLabel} leading-none mb-0.5`}>
                            Assets
                          </p>
                          <p className={`text-lg font-black leading-none ${t.statText}`}>
                            {catAssets.length.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="h-6 w-px bg-slate-200" />
                      <div className="flex flex-col items-end">
                        <p className={`text-[8px] font-bold uppercase tracking-widest ${t.statLabel} leading-none mb-0.5`}>
                          Health
                        </p>
                        <p className={`text-lg font-black leading-none ${t.statText}`}>
                          92%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── BODY ── */}
                <div className="flex-1 px-4 pt-3 pb-4 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Layers className={`w-3 h-3 ${t.statLabel}`} />
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${t.statLabel}`}>
                      Asset Types
                    </p>
                    <div className={`flex-1 h-px opacity-30 ${t.accentBar}`} />
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {category.examples.slice(0, visibleExamples[category.id]).map((example, idx) => (
                      <div
                        key={idx}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all duration-150 ${t.chipBg} ${t.chipBorder} ${t.chipText} ${t.chipHover} hover:shadow-sm`}
                      >
                        <span className={`w-1 h-1 rounded-full flex-shrink-0 ${t.dot}`} />
                        {example}
                      </div>
                    ))}
                    {category.examples.length > visibleExamples[category.id] && (
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold text-white bg-slate-800 hover:opacity-90 transition-all duration-150`}>
                        +{category.examples.length - visibleExamples[category.id]} more
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end mt-auto pt-1">
                    <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${t.statLabel} hover:underline cursor-pointer`}>
                      View all assets <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
