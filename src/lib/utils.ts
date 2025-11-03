import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getNonEmptyString = (str: (string | undefined)[]) => {
  // return the first non-empty string (yes haha)
  for (const item of str) {
    if (item) return item
  }

  return ''
}
