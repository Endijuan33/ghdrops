import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function calculateActivityScore(accountAgeInYears: number, pullRequests: number, followers: number): number {
  const score = (accountAgeInYears * 0.3) + (pullRequests * 0.4) + (followers * 0.3);
  return parseFloat(score.toFixed(2));
}

export function calculateTokenAllocation(activityScore: number): number {
  const allocation = activityScore / 0.0025;
  return Math.round(allocation);
}

export function getAccountAgeInYears(createdAt: string): number {
  const createdDate = new Date(createdAt);
  const now = new Date();
  const diff = now.getTime() - createdDate.getTime();
  const ageInYears = diff / (1000 * 60 * 60 * 24 * 365.25);
  return parseFloat(ageInYears.toFixed(2));
}
