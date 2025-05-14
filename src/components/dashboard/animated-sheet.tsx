/**
 * AnimatedSheet Component
 *
 * A custom mobile navigation drawer with smooth animations using Framer Motion.
 * This component replaces the default Sheet component to provide better
 * enter/exit animations and fixes the accessibility issues with the dialog.
 *
 * Key features:
 * - Smooth spring animations for natural feel
 * - Separate overlay animation
 * - Proper accessibility with screen reader support
 * - Staggered animation for nav items
 *
 * @bug Fixed: The default Sheet component had abrupt appearance/disappearance
 * @bug Fixed: Missing DialogTitle accessibility warning
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { DashboardNav } from "./dashboard-nav";
import { useTranslation } from "react-i18next";

interface AnimatedSheetProps {
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

export function AnimatedSheet({ isOpen, setOpen }: AnimatedSheetProps) {
  const { t } = useTranslation();

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">{t("common.toggleMenu")}</span>
        </Button>
      </SheetTrigger>
      {/* Custom overlay with fade animation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80"
            onClick={() => setOpen(false)} // Close when clicking outside
          />
        )}
      </AnimatePresence>

      {/* Custom drawer with spring physics for natural movement */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "-100%" }} // Start offscreen
            animate={{ x: 0 }} // Slide in
            exit={{ x: "-100%" }} // Slide out
            transition={{
              type: "spring",
              damping: 25, // Less damping for more bounce
              stiffness: 300 // Higher stiffness for faster initial movement
            }}
            className="fixed inset-y-0 left-0 z-50 h-full w-3/4 border-r bg-background p-6 sm:max-w-sm"
          >
            <SheetTitle className="sr-only">{t("common.navigation")}</SheetTitle>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="py-4"
            >
              <DashboardNav onItemClick={() => setOpen(false)} />
            </motion.div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
              onClick={() => setOpen(false)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </Sheet>
  );
}
