"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent, Button } from "@/components/common";
import { FileText, Upload, CheckCircle2, AlertCircle } from "lucide-react";

interface DocumentUploadListProps {
  documents: any[];
  onUpload: (id: string, file: File) => void;
}

export function DocumentUploadList({ documents, onUpload }: DocumentUploadListProps) {
  return (
    <Card variant="bordered" padding="sm" className="shadow-sm border-blue-100">
      <CardHeader className="flex items-center gap-2 border-b border-blue-50 pb-3 mb-4">
        <div className="bg-blue-600 p-1.5 rounded-lg">
          <FileText className="size-4 text-white" />
        </div>
        <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wide">
          A) Required Document Uploads
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {documents.map((doc) => (
          <div 
            key={doc.id} 
            className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors group"
          >
            <div className="flex items-center gap-3">
              {doc.isUploaded ? (
                <div className="bg-emerald-100 p-1.5 rounded-full">
                  <CheckCircle2 className="size-4 text-emerald-600" />
                </div>
              ) : doc.isRequired ? (
                <div className="bg-red-100 p-1.5 rounded-full">
                  <AlertCircle className="size-4 text-red-600" />
                </div>
              ) : (
                <div className="bg-slate-100 p-1.5 rounded-full">
                  <FileText className="size-4 text-slate-400" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-700 uppercase tracking-tighter">
                  {doc.name}
                  {doc.isRequired && <span className="text-red-500 ml-1">*</span>}
                </p>
                <p className="text-[10px] text-slate-500">{doc.fileName || "No file selected"}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
               <input
                type="file"
                id={`file-${doc.id}`}
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(doc.id, file);
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-[10px] font-black border-slate-200 group-hover:border-blue-400 group-hover:text-blue-600 transition-all"
                onClick={() => document.getElementById(`file-${doc.id}`)?.click()}
              >
                <Upload className="size-3 mr-1.5" />
                {doc.isUploaded ? "REPLACE" : "UPLOAD"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
