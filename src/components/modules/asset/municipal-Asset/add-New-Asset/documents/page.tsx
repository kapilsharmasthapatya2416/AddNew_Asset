"use client";

import React, { useState } from "react";
import { DocumentUploadList } from "./DocumentUploadList";
import { AssetMediaGallery } from "./AssetMediaGallery";
import { useAssetForm } from "../AssetFormContext";

export default function DocumentsPage() {
  const { updateFormData } = useAssetForm();
  
  // Local state for UI responsiveness, but could be synced to context
  const [documents, setDocuments] = useState([
    { id: "1", name: "Title Deed / Sanad", isRequired: true, isUploaded: false, fileName: "" },
    { id: "2", name: "Possession Certificate", isRequired: true, isUploaded: false, fileName: "" },
    { id: "3", name: "NA Order", isRequired: false, isUploaded: false, fileName: "" },
    { id: "4", name: "Layout Approval Plan", isRequired: true, isUploaded: false, fileName: "" },
    { id: "5", name: "Structural Audit Report", isRequired: false, isUploaded: false, fileName: "" },
  ]);

  const [photos, setPhotos] = useState<any[]>([]);

  const handleUpload = (id: string, file: File) => {
    const updatedDocs = documents.map(doc => 
      doc.id === id ? { ...doc, isUploaded: true, fileName: file.name } : doc
    );
    setDocuments(updatedDocs);
    updateFormData({ documents: updatedDocs });
  };

  const handleAddPhoto = (file: File) => {
    const url = URL.createObjectURL(file);
    const newPhotos = [...photos, { id: Math.random().toString(), url }];
    setPhotos(newPhotos);
    updateFormData({ photos: newPhotos });
  };

  const handleRemovePhoto = (id: string) => {
    const newPhotos = photos.filter(p => p.id !== id);
    setPhotos(newPhotos);
    updateFormData({ photos: newPhotos });
  };

  return (
    <div className="space-y-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <DocumentUploadList documents={documents} onUpload={handleUpload} />
      <AssetMediaGallery photos={photos} onAddPhoto={handleAddPhoto} onRemovePhoto={handleRemovePhoto} />
      
      <div className="mt-8 p-4 bg-slate-100/80 rounded-xl border border-slate-200 flex items-center gap-3">
        <div className="bg-slate-500 size-2 rounded-full animate-pulse" />
        <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
          Media Storage: Files will be securely stored in the Municipal Asset Cloud
        </p>
      </div>
    </div>
  );
}
