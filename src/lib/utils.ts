import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format } from "date-fns"

/**
 * Combines multiple class names using clsx and tailwind-merge
 * @param inputs - Class names to combine
 * @returns Combined class name string
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string or Date object into a human-readable format
 * @param date - Date to format
 * @param formatString - Format string (default: 'PPP')
 * @returns Formatted date string
 */
export function formatDate(date: string | Date, formatString: string = "PPP") {
  return format(new Date(date), formatString)
}

/**
 * Truncates a string to a specified length and adds ellipsis
 * @param str - String to truncate
 * @param length - Maximum length (default: 100)
 * @returns Truncated string
 */
export function truncateString(str: string, length: number = 100) {
  if (str.length <= length) return str
  return str.slice(0, length) + "..."
}

/**
 * Generates a random color in hex format
 * @returns Random color hex string
 */
export function getRandomColor() {
  return `#${Math.floor(Math.random() * 16777215).toString(16)}`
}

/**
 * Copies text to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 */
export async function copyToClipboard(text: string) {
  if (navigator.clipboard) {
    return navigator.clipboard.writeText(text)
  }

  // Fallback for older browsers
  const textArea = document.createElement("textarea")
  textArea.value = text
  textArea.style.position = "fixed"
  document.body.appendChild(textArea)
  textArea.focus()
  textArea.select()

  try {
    document.execCommand("copy")
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  } finally {
    document.body.removeChild(textArea)
  }
}

/**
 * Debounces a function call
 * @param fn - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce<T extends (...args: any[]) => any>(fn: T, delay: number) {
  let timeoutId: NodeJS.Timeout

  return function(...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  } as T
}
