"use client";

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Skeleton } from '@/components/ui/skeleton';

interface QRCodeProps {
  value: string;
  size?: number;
}

export default function QRCodeComponent({ value, size = 256 }: QRCodeProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !value) {
    return <Skeleton className="h-64 w-64 rounded-lg" />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <QRCodeSVG 
        value={value} 
        size={size} 
        level="H" 
        includeMargin={true}
        bgColor="#FFFFFF"
        fgColor="#000000"
      />
    </div>
  );
}