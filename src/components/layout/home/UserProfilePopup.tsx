import React from 'react';
import { User, Shield, Building, Globe, Hash, Clock, Mail } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { Badge } from '@/components/common/Badge';
import { Label } from '@/components/common/label';

interface UserProfilePopupProps {
    isOpen: boolean;
    onClose: () => void;
}

export const UserProfilePopup: React.FC<UserProfilePopupProps> = ({ isOpen }) => {
    if (!isOpen) return null;

    return (
        <div className={cn(
            "absolute top-12 right-0 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50",
            "profile-dropdown-container animate-in fade-in zoom-in-95 duration-200"
        )}>
            {/* Header */}
            <div className="p-4 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50 rounded-t-lg">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <User className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-gray-900">Rajesh Kumar</h3>
                    <p className="text-xs text-gray-500">rajesh.kumar@propertytax.gov.in</p>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                    <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                        <Label className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">User ID</Label>
                        <p className="text-sm font-medium text-gray-900">USR-2025-1047</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Shield className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                        <Label className="text-[10px] text-gray-500 uppercase font-bold mb-1">Role</Label>
                        <Badge variant="default" size="sm" className="bg-blue-50 text-blue-700 border-blue-100">
                            Tax Assessment Officer
                        </Badge>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Building className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div className="flex-1">
                        <Label className="text-[10px] text-gray-500 uppercase font-bold mb-0.5">Department</Label>
                        <p className="text-sm font-medium text-gray-900">Property Tax Department</p>
                    </div>
                </div>

                <div className="border-t border-gray-100 my-2"></div>

                <div className="flex items-start gap-3">
                    <Globe className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold">Public IP Address</p>
                        <p className="text-sm font-medium text-gray-900 font-mono">115.242.194.254</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Hash className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold">Session ID</p>
                        <p className="text-sm font-medium text-gray-900 font-mono truncate w-48">SES-1767942012755-w0ehgm4ps</p>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Clock className="w-4 h-4 text-gray-400 mt-0.5" />
                    <div>
                        <p className="text-[10px] text-gray-500 uppercase font-semibold">Login Time</p>
                        <p className="text-sm font-medium text-gray-900">09/01/2026, 12:30:12</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-3 bg-blue-50/50 rounded-b-lg border-t border-blue-100">
                <div className="flex gap-2 text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                    <p>All operations are logged and monitored for security purposes.</p>
                </div>
            </div>
        </div>
    );
};
