"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNotification } from "@/context/notification-context";
import { copyToClipboard } from "@/lib/utils";
import { Copy, Check, Send } from "lucide-react";

interface CaptionItemProps {
  caption: string;
  index: number;
  platform: string;
}

export function CaptionItem({ caption, index, platform }: CaptionItemProps) {
  const { t } = useTranslation();
  const { showNotification } = useNotification();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(caption);
      setCopied(true);
      showNotification("success", t("captionGenerator.captionCopied"));
      
      // Reset copied state after 2 seconds
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      showNotification("error", t("errors.general"));
    }
  };

  const handlePost = () => {
    // This would integrate with social media APIs in a real app
    showNotification("info", t("captionGenerator.mockPostMessage"));
  };

  // Format caption based on platform
  const formattedCaption = () => {
    if (platform === "twitter" || platform === "linkedin") {
      return caption;
    } else if (platform === "instagram" || platform === "facebook") {
      return caption.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line}
        </span>
      ));
    }
    return caption;
  };

  // Get platform-specific icon color
  const getPlatformColor = () => {
    switch (platform) {
      case "twitter":
        return "text-blue-400";
      case "linkedin":
        return "text-blue-700";
      case "instagram":
        return "text-pink-500";
      case "facebook":
        return "text-blue-600";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <p className="text-sm whitespace-pre-line">{formattedCaption()}</p>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                aria-label={t("captionGenerator.copy")}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePost}
                aria-label={t("captionGenerator.post")}
              >
                <Send className={`h-4 w-4 ${getPlatformColor()}`} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
