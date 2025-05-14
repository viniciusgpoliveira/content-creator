"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface BlogPostPreviewProps {
  content: string;
}

export function BlogPostPreview({ content }: BlogPostPreviewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="prose prose-blue dark:prose-invert max-w-none"
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </motion.div>
  );
}
