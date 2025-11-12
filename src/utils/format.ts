import { format, parseISO } from "date-fns";

// utils/format.ts
export function formatDate(date?: Date | null) {
  if (!date) return "—";
  return format(date, "MMM d, yyyy");
}

export function formatPrice(amount: number, currency = "USD", cycle?: string) {
  // currency symbol basic handling; you may want to use Intl.NumberFormat for more robust behaviour
  const formatted = amount;
  let suffix = "mo";
  if (cycle === "yearly" || cycle === "year") suffix = "yr";
  else if (cycle === "quarterly") suffix = "qtr";
  else if (cycle === "weekly") suffix = "wk";
  return `$${formatted}/${suffix}`;
}
