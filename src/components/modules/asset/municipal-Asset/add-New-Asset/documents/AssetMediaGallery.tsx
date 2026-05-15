"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/common";
import { Camera, Video, Plus, X } from "lucide-react";

interface AssetMediaGalleryProps {
  photos: any[];
  onAddPhoto: (file: File) => void;
  onRemovePhoto: (id: string) => void;
}

export function AssetMediaGallery({ photos, onAddPhoto, onRemovePhoto }: AssetMediaGalleryProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-violet-100 mt-4">
      <CardHeader className="flex items-center gap-2 border-b border-violet-50 pb-3 mb-4">
        <div className="bg-violet-600 p-1.5 rounded-lg">
          <Camera className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          B) Asset Photos & Video Clips
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Photos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {photos.map((photo) => (
            <div key={photo.id} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
              <img 
                src={photo.url} 
                alt="Asset" 
                className="w-full h-full object-cover transition-transform group-hover:scale-110" 
              />
              <button 
                onClick={() => onRemovePhoto(photo.id)}
                className="absolute top-1 right-1 bg-white/80 backdrop-blur-sm p-1 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="size-3" />
              </button>
            </div>
          ))}
          
          <label className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 hover:border-violet-400 transition-all group">
            <Plus className="size-6 text-slate-300 group-hover:text-violet-500 mb-1" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-violet-600">ADD PHOTO</span>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) onAddPhoto(file);
              }}
            />
          </label>
        </div>

        {/* Video Upload Placeholder */}
        <div className="p-4 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <div className="bg-white p-2 rounded-lg shadow-sm">
               <Video className="size-5 text-slate-400" />
             </div>
             <div>
               <p className="text-xs font-bold text-slate-700 uppercase tracking-tighter">Site Survey Video</p>
               <p className="text-[9px] text-slate-500 uppercase tracking-[0.1em]">Max size: 50MB | Formats: MP4, MOV</p>
             </div>
           </div>
           <button className="px-4 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-600 uppercase tracking-widest hover:bg-slate-100 transition-all">
             SELECT VIDEO
           </button>
        </div>
      </CardContent>
    </Card>
  );
}
