"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, MessageSquare, Plus } from "lucide-react";
import { motion } from "framer-motion";

export function GenerateNewButton() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (path: string) => {
    // Add a small animation delay before navigation
    setIsOpen(false);
    
    // Use setTimeout to allow the dropdown to close before navigating
    setTimeout(() => {
      router.push(path);
    }, 150);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button className="gap-1">
          <Plus className="h-4 w-4" />
          <span>{t("common.generateNew")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2 py-2"
            onClick={() => handleNavigate("/tools/blog")}
          >
            <FileText className="h-4 w-4" />
            <span>{t("blogGenerator.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="cursor-pointer flex items-center gap-2 py-2"
            onClick={() => handleNavigate("/tools/caption")}
          >
            <MessageSquare className="h-4 w-4" />
            <span>{t("captionGenerator.title")}</span>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
