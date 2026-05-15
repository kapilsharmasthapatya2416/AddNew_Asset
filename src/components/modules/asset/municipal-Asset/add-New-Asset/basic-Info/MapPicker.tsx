"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, X, Check, Search, Crosshair } from "lucide-react";
import { Button } from "@/components/common";

interface MapPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lat: string, lng: string) => void;
  initialLat?: string;
  initialLng?: string;
}

export function MapPicker({ isOpen, onClose, onSelect, initialLat, initialLng }: MapPickerProps) {
  const [markerPos, setMarkerPos] = useState({ 
    x: 50, 
    y: 50,
    lat: initialLat || "19.0760",
    lng: initialLng || "72.8777"
  });

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    // Simulate lat/long calculation based on click
    const lat = (19.0760 + (50 - y) * 0.001).toFixed(6);
    const lng = (72.8777 + (x - 50) * 0.001).toFixed(6);
    
    setMarkerPos({ x, y, lat, lng });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[80vh]"
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
                <MapPin className="size-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-slate-800 uppercase tracking-tight">Geo-Tagging Tool</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Pin asset location on municipal map</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X className="size-5 text-slate-400" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="p-4 bg-slate-50 border-b border-slate-100 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search location, landmark or ward..." 
                className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <Button variant="secondary" className="px-4">
               <Crosshair className="size-4 mr-2" /> Locate Me
            </Button>
          </div>

          {/* Map Area */}
          <div className="flex-1 relative bg-slate-100 overflow-hidden cursor-crosshair" onClick={handleMapClick}>
            {/* Stylized CSS Map Background */}
            <div className="absolute inset-0 bg-[#f8fafc]" 
                 style={{ 
                   backgroundImage: `
                     linear-gradient(#e2e8f0 1px, transparent 1px),
                     linear-gradient(90deg, #e2e8f0 1px, transparent 1px)
                   `,
                   backgroundSize: '40px 40px'
                 }} 
            />
            
            {/* Simulated Map Features */}
            <div className="absolute top-1/4 left-1/4 w-32 h-40 bg-blue-50/50 border border-blue-100 rounded-lg rotate-12" />
            <div className="absolute bottom-1/3 right-1/4 w-48 h-24 bg-emerald-50/50 border border-emerald-100 rounded-2xl -rotate-6" />
            <div className="absolute top-1/2 left-1/2 w-64 h-12 bg-slate-200/40 border border-slate-300 rounded-full" />
            
            {/* Grid Overlay (Fine) */}
            <div className="absolute inset-0 pointer-events-none opacity-40" 
                 style={{ backgroundImage: 'radial-gradient(#94a3b8 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} 
            />

            {/* Marker */}
            <motion.div 
              animate={{ left: `${markerPos.x}%`, top: `${markerPos.y}%` }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
              className="absolute -translate-x-1/2 -translate-y-full pointer-events-none"
            >
              <div className="relative">
                 <MapPin className="size-10 text-blue-600 fill-blue-600/20 drop-shadow-lg" />
                 <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap shadow-xl">
                    LAT: {markerPos.lat} <br/> LNG: {markerPos.lng}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                 </div>
              </div>
            </motion.div>

            {/* Hint */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg border border-white flex items-center gap-3">
               <div className="bg-blue-100 p-1 rounded-full">
                  <MapPin className="size-3 text-blue-600" />
               </div>
               <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Click anywhere on the map to pin the asset location</p>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-white flex items-center justify-between">
            <div className="flex gap-8">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Latitude</p>
                <p className="font-mono text-lg font-bold text-slate-800">{markerPos.lat}</p>
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Longitude</p>
                <p className="font-mono text-lg font-bold text-slate-800">{markerPos.lng}</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" onClick={onClose} className="rounded-2xl px-6">Cancel</Button>
              <Button 
                variant="primary" 
                onClick={() => onSelect(markerPos.lat, markerPos.lng)}
                className="rounded-2xl px-8 shadow-lg shadow-blue-200"
              >
                <Check className="size-4 mr-2" /> Confirm Location
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
