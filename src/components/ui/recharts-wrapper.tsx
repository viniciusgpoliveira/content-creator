"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

interface RechartsWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function RechartsWrapper({
  children,
  className,
}: RechartsWrapperProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before rendering to avoid hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className={className} />;
  }

  return (
    <div className={className} data-theme={theme}>
      {children}
    </div>
  );
}
