"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

  const navItems = [
    {
      title: t("common.dashboard"),
      href: "/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      title: t("blogGenerator.title"),
      href: "/tools/blog",
      icon: <FileText className="mr-2 h-4 w-4" />,
    },
    {
      title: t("captionGenerator.title"),
      href: "/tools/caption",
      icon: <MessageSquare className="mr-2 h-4 w-4" />,
    },
    {
      title: t("common.engagementMetrics"),
      href: "/dashboard/metrics",
      icon: <BarChart className="mr-2 h-4 w-4" />,
    },
    {
      title: t("common.profile"),
      href: "/dashboard/profile",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      title: t("common.settings"),
      href: "/dashboard/settings",
      icon: <Settings className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <nav className="grid items-start gap-2 px-2 py-4">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "default" : "ghost"}
          className={cn(
            "justify-start",
            pathname === item.href && "bg-primary text-primary-foreground"
          )}
          asChild
          onClick={onItemClick}
        >
          <Link href={item.href}>
            {item.icon}
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  );
}
