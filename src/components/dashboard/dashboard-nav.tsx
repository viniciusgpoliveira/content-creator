"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/context/notification-context";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  BarChart,
  Settings,
  User,
} from "lucide-react";

interface DashboardNavProps {
  onItemClick?: () => void;
}

export function DashboardNav({ onItemClick }: DashboardNavProps) {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { showNotification } = useNotification();

  const navItems = [
    {
      title: t("common.dashboard"),
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
      isMock: false,
    },
    {
      title: t("blogGenerator.title"),
      href: "/tools/blog",
      icon: <FileText className="mr-2 h-4 w-4" />,
      isMock: false,
    },
    {
      title: t("captionGenerator.title"),
      href: "/tools/caption",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
      isMock: false,
    },
    {
      title: t("common.engagementMetrics"),
      href: "/dashboard/metrics",
      icon: <BarChart className="mr-2 h-4 w-4" />,
      isMock: true,
    },
    {
      title: t("common.profile"),
      href: "/dashboard/profile",
      icon: <User className="mr-2 h-4 w-4" />,
      isMock: true,
    },
    {
      title: t("common.settings"),
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
      isMock: true,
    },
  ];

  const handleNavItemClick = (item: typeof navItems[0], e: React.MouseEvent) => {
    if (item.isMock) {
      e.preventDefault();
      showNotification("info", t("dashboard.featureComingSoon"));
      if (onItemClick) onItemClick();
    } else if (onItemClick) {
      onItemClick();
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.nav
      className="grid items-start gap-2 px-2 py-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {navItems.map((navItem) => (
        <motion.div key={navItem.href} variants={item}>
          {navItem.isMock ? (
            <Button
              variant={"ghost"}
              className="justify-start w-full"
              onClick={(e) => handleNavItemClick(navItem, e)}
            >
              {navItem.icon}
              {navItem.title}
            </Button>
          ) : (
            <Button
              variant={pathname === navItem.href ? "default" : "ghost"}
              className={cn(
                "justify-start w-full",
                pathname === navItem.href && "bg-primary text-primary-foreground"
              )}
              asChild
              onClick={onItemClick}
            >
              <Link href={navItem.href}>
                {navItem.icon}
                {navItem.title}
              </Link>
            </Button>
          )}
        </motion.div>
      ))}
    </motion.nav>
  );
}
