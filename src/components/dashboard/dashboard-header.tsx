"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useTranslation } from "react-i18next";
import { User, LogOut, Settings } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useState } from "react";
import { AnimatedSheet } from "./animated-sheet";
import { DashboardNav } from "./dashboard-nav";
import { useNotification } from "@/context/notification-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function DashboardHeader() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  const { showNotification } = useNotification();

  const handleComingSoonClick = (e: React.MouseEvent, feature: string) => {
    e.preventDefault();
    showNotification("info", t("dashboard.featureComingSoon"));
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background">
      <div className="container mx-auto max-w-7xl flex h-14 items-center justify-between py-4 px-4 md:px-6">
        <div className="flex items-center gap-2 md:gap-4 pl-0 md:pl-2">
          {isMobile && <AnimatedSheet isOpen={open} setOpen={setOpen} />}
          <Link href="/dashboard" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <span className="hidden font-bold sm:inline-block">
              {t("common.appName")}
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/avatar.jpg" alt="User avatar" />
                  <AvatarFallback>CC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t("common.profile")}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => handleComingSoonClick(e, "profile")}
              >
                <User className="mr-2 h-4 w-4" />
                <span>{t("common.profile")}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => handleComingSoonClick(e, "settings")}
              >
                <Settings className="mr-2 h-4 w-4" />
                <span>{t("common.settings")}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="cursor-pointer"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("common.logout")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
