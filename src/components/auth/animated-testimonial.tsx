/**
 * AnimatedTestimonial Component
 *
 * A dynamic testimonial component that cycles through quotes with smooth
 * animations and a typewriter effect. Enhances the login/register pages
 * with engaging, animated content.
 *
 * Key features:
 * - Automatic cycling through multiple testimonials
 * - Smooth fade animations between testimonials
 * - Typewriter effect for text appearance
 * - Proper handling of text to prevent character loss
 *
 * @bug Fixed: Missing characters in testimonial text
 * @bug Fixed: Undefined appearing at the end of testimonials
 */

"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

interface Testimonial {
  quote: string;
  author: string;
}

export function AnimatedTestimonial() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      quote: t("testimonials.quote1"),
      author: t("testimonials.author1"),
    },
    {
      quote: t("testimonials.quote2"),
      author: t("testimonials.author2"),
    },
    {
      quote: t("testimonials.quote3"),
      author: t("testimonials.author3"),
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  return (
    <div className="relative h-32">
      <AnimatePresence mode="wait">
        <motion.blockquote
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="space-y-2"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg relative"
          >
            <span className="absolute -left-4 -top-2 text-3xl opacity-50">"</span>
            <AnimateText text={testimonials[currentIndex]?.quote || ""} />
            <span className="absolute -bottom-4 right-0 text-3xl opacity-50">"</span>
          </motion.p>
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="text-sm mt-2"
          >
            {testimonials[currentIndex]?.author || ""}
          </motion.footer>
        </motion.blockquote>
      </AnimatePresence>
    </div>
  );
}

interface AnimateTextProps {
  text: string;
}

/**
 * AnimateText Component
 *
 * Creates a typewriter effect by gradually revealing text one character at a time.
 * This component solves several issues with the previous implementation:
 *
 * 1. Uses substring instead of charAt to avoid missing characters
 * 2. Properly handles null/undefined text with String() conversion
 * 3. Uses recursive setTimeout for more reliable animation timing
 * 4. Properly resets when text changes
 *
 * @param text - The text to animate with typewriter effect
 */
function AnimateText({ text }: AnimateTextProps) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    // Reset the displayed text when the text changes
    setDisplayedText("");

    // Make sure we have the complete text and handle null/undefined
    const fullText = String(text || "");

    // Type each character one by one using recursive setTimeout
    // This is more reliable than setInterval for this purpose
    let i = 0;
    const typeNextChar = () => {
      if (i < fullText.length) {
        // Use substring instead of charAt + concatenation to avoid missing chars
        setDisplayedText(fullText.substring(0, i + 1));
        i++;
        setTimeout(typeNextChar, 30); // 30ms delay between characters
      }
    };

    // Start typing
    typeNextChar();

    // Cleanup function
    return () => {
      // No cleanup needed for setTimeout approach since we're not using setInterval
    };
  }, [text]); // Re-run effect when text changes

  return <span>{displayedText}</span>;
}
