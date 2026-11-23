import type { ExtractedUrl } from "../types";

const URL_PATTERN = /\b(?:https?:\/\/|www\.)[^\s<>"']+|\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|is\.gd|rb\.gy)\/[^\s<>"']+/gi;
const SHORTENERS = new Set(["bit.ly", "tinyurl.com", "t.co", "goo.gl", "cutt.ly", "is.gd", "rb.gy", "shorturl.at", "rebrand.ly"]);

export function extractUrls(text: string): ExtractedUrl[] {
  const found = new Map<string, ExtractedUrl>();
  for (const match of text.matchAll(URL_PATTERN)) {
    const raw = match[0].replace(/[),.!?;:]+$/, "");
    const normalized = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
      const parsed = new URL(normalized);
      const hostname = parsed.hostname.toLowerCase();
      const reasons: string[] = [];
      const shortened = SHORTENERS.has(hostname);
      if (shortened) reasons.push("Shortened URL hides its final destination.");
      if (parsed.protocol !== "https:") reasons.push("This URL does not use HTTPS.");
      if (parsed.username || parsed.password) reasons.push("The URL contains user-info before the domain.");
      if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(hostname)) reasons.push("The destination uses a raw IP address.");
      if (hostname.startsWith("xn--") || hostname.split(".").some((part) => part.startsWith("xn--"))) {
        reasons.push("The domain uses an internationalized (punycode) label.");
      }
      if (hostname.split(".").length > 4) reasons.push("The domain has several subdomain levels.");
      if (hostname.includes("-") && /\b(?:login|verify|secure|update|account|bank|kyc)\b/i.test(hostname)) {
        reasons.push("The domain combines account-related wording with hyphens; check its spelling carefully.");
      }
      if (parsed.search.length > 100) reasons.push("The URL has an unusually long query string.");
      found.set(raw, { url: raw, shortened, cautionReasons: reasons });
    } catch {
      found.set(raw, { url: raw, shortened: false, cautionReasons: ["The URL could not be parsed reliably."] });
    }
  }
  return [...found.values()];
}
