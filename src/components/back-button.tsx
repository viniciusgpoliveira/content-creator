"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  label: string;
}

export function BackButton({ label }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1 hover:bg-transparent"
      onClick={() => router.back()}
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
}
