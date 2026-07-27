import { matches } from "@/db/schema";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getOtherUser = (
  match: typeof matches.$inferSelect & {
    partner: { id: string; name: string; imageUrl: string | null };
  }
) => {
  return {
    id: match.partner.id || "",
    name: match.partner.name || "Partner",
    imageUrl: match.partner.imageUrl ?? undefined,
  };
};
