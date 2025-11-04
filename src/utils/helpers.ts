import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

export const addDays = (d?: Date | null, days = 0) => {
  if (!d) return null;
  const res = new Date(d.getTime());
  res.setDate(res.getDate() + days);
  return res;
};
