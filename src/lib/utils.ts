import { API_URL } from "@/services/apiClient";
import { clsx, type ClassValue } from "clsx";
import moment, { Moment } from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isEmail(email: string) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function getOrCreateSessionId(): string {
  const key = "session_id";
  let sessionId = sessionStorage.getItem(key);

  if (!sessionId) {
    sessionId = safeUUID();
    sessionStorage.setItem(key, sessionId);
  }

  return sessionId;
}

function safeUUID(): string {
  if (typeof crypto !== "undefined") {
    if (typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }

    if (typeof crypto.getRandomValues === "function") {
      const buf = new Uint8Array(16);
      crypto.getRandomValues(buf);

      // Format UUID v4
      buf[6] = (buf[6] & 0x0f) | 0x40;
      buf[8] = (buf[8] & 0x3f) | 0x80;

      return [...buf]
        .map((b, i) => {
          const hex = b.toString(16).padStart(2, "0");
          return [4, 6, 8, 10].includes(i) ? "-" + hex : hex;
        })
        .join("");
    }
  }

  // Fallback to non-crypto random UUID
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const safeParseJSON = (str: string, fallback = []) => {
  try {
    return str ? JSON.parse(str) : fallback;
  } catch {
    console.warn("Failed to parse JSON:", str);
    return fallback;
  }
};

export const safeBase64JsonParse = (encoded: string | undefined | null) => {
  if (!encoded) return null;

  try {
    const decoded = atob(encoded);
    // console.log({ decoded });
    return typeof decoded === "string"
      ? decoded?.includes("xml")
        ? decoded
        : JSON.parse(decoded)
      : null;
  } catch (error) {
    console.error("Failed to decode or parse base64 JSON:", error);
    return null;
  }
};

export const formatAvatar = (avatar: string) => {
  if (avatar === null || avatar === "" || avatar === undefined) return null;
  let cleanedFilePath = "";
  if (avatar.includes("http")) {
    cleanedFilePath = avatar;
  } else {
    cleanedFilePath = API_URL + avatar;
  }
  return cleanedFilePath;
};

export const formatBookingTime = (date: string | Moment | Date | null) => {
  if (!date) return "";
  return moment(date).format("DD MMM YYYY, hh:mm A");
};

export const isBookingPassed = (date: string | Moment | Date | null) => {
  if (!date) return false;
  const now = moment();
  const bookingEndTime = moment(date);
  return now.isAfter(bookingEndTime);
};
export function getRandomColor(seed?: string): string {
  // Optional seed-based color generation
  if (seed) {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }

    const color =
      "#" +
      ((hash >> 24) & 0xff).toString(16).padStart(2, "0") +
      ((hash >> 16) & 0xff).toString(16).padStart(2, "0") +
      ((hash >> 8) & 0xff).toString(16).padStart(2, "0");

    return color.slice(0, 7);
  }

  // Fallback to purely random color
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

export function getColorByLuminance(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Calculate luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  return luminance > 0.5 ? "#000000" : "#FFFFFF"; // dark bg = white text, light bg = black text
}
export function hasExactlyOneSpace(searchQuery: string): boolean {
  // Match all spaces and check if there's exactly one
  return searchQuery.includes(" ");
}
