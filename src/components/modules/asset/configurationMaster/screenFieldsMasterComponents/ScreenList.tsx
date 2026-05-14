'use client';

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Monitor } from 'lucide-react';
import type { ScreenConfig, ScreenListProps } from '@/types/asset.types';
import { Card, CardContent, CardHeader } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';

export function ScreenList({ screens, selectedScreenId, onScreenSelect }: ScreenListProps) {
  return (
    <Card className="h-full flex flex-col border border-gray-200 overflow-visible rounded-lg">
      <div className="-mt-6 -mx-[24px]">
        <CardHeader className="bg-slate-900 px-5 py-3 border border-slate-700 shadow-md rounded-t-lg">
          <div className="flex items-center gap-3 text-sm font-semibold text-white">
            <Monitor className="w-4 h-4" />
            Screens
          </div>
        </CardHeader>
      </div>
      <CardContent className="p-0 space-y-2 flex-1 overflow-y-auto -mx-3">
        {screens.length === 0 ? (
          <div className="text-center py-6 text-sm text-gray-500">
            No screens configured
          </div>
        ) : (
          screens.map((screen, index) => {
            const isActive = selectedScreenId === screen.id;
            const sectionsCount = screen.sections.length;
            const fieldsCount = screen.sections.reduce(
              (total, section) => total + section.fields.length,
              0
            );

            return (
              <motion.button
                key={screen.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04, duration: 0.25 }}
                whileHover={{ x: 4 }}
                onClick={() => onScreenSelect(screen.id)}
                className={`w-full rounded-md border ${
                  isActive
                    ? 'border-transparent bg-blue-600 text-white shadow'
                    : 'border-gray-200 bg-white text-gray-800 hover:bg-blue-50'
                } px-3 py-3 flex items-start gap-3 transition duration-200 relative`}
              >
                
                <div className="w-9 h-9 rounded-md flex items-center justify-center bg-blue-500 text-white flex-shrink-0">
                  <Monitor className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className={`text-xs font-semibold ${isActive ? 'text-white' : 'text-gray-900'}`}>
                    {screen.displayName}
                  </p>
                  <p className={`text-[10px] ${isActive ? 'text-blue-200' : 'text-gray-500'} mb-2`}>
                    {screen.module}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={isActive ? 'success' : 'secondary'} size="sm">
                      {sectionsCount} sections
                    </Badge>
                    <Badge variant="warning" size="sm">
                      {fieldsCount} fields
                    </Badge>
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </CardContent>
    </Card>

  );
}

type ScreenListWithSelectionProps = {
  screens: ScreenConfig[];
};

export function ScreenListWithSelection({ screens }: ScreenListWithSelectionProps) {
  const [selectedScreenId, setSelectedScreenId] = useState<string | null>(screens[0]?.id ?? null);

  useEffect(() => {
    setSelectedScreenId(screens[0]?.id ?? null);
  }, [screens]);

  const handleSelect = (screenId: string) => {
    setSelectedScreenId(screenId);
  };

  return (
    <ScreenList
      screens={screens}
      selectedScreenId={selectedScreenId}
      onScreenSelect={handleSelect}
    />
  );
}
