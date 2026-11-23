import type { RuleGroup } from "../types";

export interface DetectionRule {
  id: string;
  group: RuleGroup;
  label: string;
  explanation: string;
  weight: number;
  pattern: RegExp;
}

export const GROUP_LABELS: Record<RuleGroup, string> = {
  urgency: "Urgency / secrecy",
  threats: "Threats / prizes",
  sensitive: "Sensitive details",
  links: "Links",
  payments: "Fees / transfers",
  impersonation: "Impersonation / installation",
};

// Configurable demonstration rules based on the weights and categories in the supplied PPT.
export const RULES: DetectionRule[] = [
  {
    id: "urgent-action",
    group: "urgency",
    label: "Pressure to act immediately",
    explanation: "Urgent deadlines can pressure people to react before independently checking a message.",
    weight: 15,
    pattern: /\b(?:act\s+now|immediately|urgent(?:ly)?|within\s+\d+\s*(?:minutes?|hours?)|today\s+only|last\s+chance|right\s+away|abhi|turant|jaldi\s+(?:karo|karein)|aaj\s+hi)\b/gi,
  },
  {
    id: "secrecy",
    group: "urgency",
    label: "Request for secrecy",
    explanation: "Requests to keep a transaction or message secret can isolate someone from trusted advice.",
    weight: 10,
    pattern: /\b(?:keep\s+(?:this|it)\s+(?:a\s+)?secret|do\s+not\s+tell\s+anyone|don't\s+tell\s+anyone|confidential\s+and\s+urgent|kisi\s+ko\s+mat\s+batana|gupt\s+rakho)\b/gi,
  },
  {
    id: "account-threat",
    group: "threats",
    label: "Threat of account or service loss",
    explanation: "Threats to block an account or disconnect a service are commonly used to create pressure.",
    weight: 20,
    pattern: /\b(?:account|bank|card|sim|connection|electricity|bijli|khata).{0,35}\b(?:block(?:ed)?|suspend(?:ed)?|close(?:d)?|disable(?:d)?|disconnect(?:ed)?|cut\s+off|freeze|kat\s+jayega|band\s+ho\s+jayega)\b|\b(?:kyc|account|bijli|electricity|connection|aadhaar|aadhar).{0,35}\b(?:pending|expire|blocked|verification\s+pending)\b/gi,
  },
  {
    id: "prize-reward",
    group: "threats",
    label: "Unexpected prize or reward",
    explanation: "Unexpected prizes or winnings may be used to persuade recipients to pay or reveal information.",
    weight: 20,
    pattern: /\b(?:you(?:'ve| have)?\s+(?:won|been\s+selected)|congratulations.{0,35}(?:winner|won|prize)|claim\s+your\s+(?:prize|reward|winnings)|lottery\s+(?:winner|prize)|won\s+\$?\s?[\d,]+|jeet(?:e|a)?\s+(?:hain|ho)|inaam|lakh\s+rup(?:ay|e)|prize\s+money)\b/gi,
  },
  {
    id: "sensitive-request",
    group: "sensitive",
    label: "Request for sensitive information",
    explanation: "Legitimate organizations should not ask you to disclose credentials, OTPs, or payment secrets in a message.",
    weight: 30,
    pattern: /\b(?:share|send|provide|enter|submit|tell|reveal|confirm|update|verify|reply\s+with|give|forward|bhejo|share\s+karo|enter\s+karo|bataye|darj\s+karein|jama\s+karein)\b[^.!?;,\n]{0,45}\b(?:your\s+)?(?:otp|one[- ]time\s+password|password|passcode|upi\s+pin|pin|cvv|card\s+(?:number|details)|bank\s+(?:details|account|information)|aadhaar(?:\s+number)?|account\s+(?:number|details)|otp\s+code)\b|\b(?:otp|one[- ]time\s+password|password|passcode|upi\s+pin|cvv|card\s+(?:number|details)|bank\s+(?:details|account|information)|aadhaar(?:\s+number)?|account\s+(?:number|details))\b[^.!?;,\n]{0,35}\b(?:share|send|provide|enter|submit|tell|reveal|confirm|update|verify|reply|bhejo|karo|do|provide)\b/gi,
  },
  {
    id: "link-click",
    group: "links",
    label: "Prompt to follow a link",
    explanation: "A message that pushes you to use a link deserves extra care; visit official sites independently instead.",
    weight: 10,
    pattern: /\b(?:click|tap|open|visit|follow)\s+(?:the\s+)?(?:link|url|here|below)|link\s+par\s+click\s+(?:karein|karo)|click\s+karke\s+(?:update|verify|claim)\b/gi,
  },
  {
    id: "short-link",
    group: "links",
    label: "Shortened or obscured link",
    explanation: "Short links hide their final destination. This alone does not prove a link is malicious.",
    weight: 15,
    pattern: /\bhttps?:\/\/(?:bit\.ly|tinyurl\.com|t\.co|goo\.gl|cutt\.ly|is\.gd|rb\.gy|shorturl\.at|rebrand\.ly)\/\S+|\b(?:bit\.ly|tinyurl\.com|t\.co|cutt\.ly|is\.gd|rb\.gy)\/\S+/gi,
  },
  {
    id: "payment-request",
    group: "payments",
    label: "Payment, fee, or transfer request",
    explanation: "Unexpected fees or transfer instructions should be verified through an independent official channel.",
    weight: 20,
    pattern: /\b(?:pay|transfer|send|deposit|wire|remit)\s+(?:a\s+)?(?:processing|registration|delivery|activation|advance|verification)?\s*(?:fee|payment|money|amount|₹|rs\.?|inr)\b|\b(?:processing|registration|delivery|activation|advance)\s+fee\b|\b(?:upi|bank)\s+(?:transfer|payment)\s+(?:now|immediately|to\s+claim)\b|\b(?:registration\s+fee\s+pay\s+karo|paise\s+(?:bhejo|jama\s+karo)|fee\s+(?:pay|jama)\s+karein)\b/gi,
  },
  {
    id: "payment-method",
    group: "payments",
    label: "Unusual payment instructions",
    explanation: "Requests to pay through unusual or hard-to-reverse methods need verification before action.",
    weight: 20,
    pattern: /\b(?:gift\s+cards?|crypto(?:currency)?|bitcoin|wire\s+transfer|personal\s+upi|scan\s+(?:this\s+)?qr\s+(?:to\s+)?(?:receive|claim)|send\s+money\s+to\s+(?:claim|release))\b/gi,
  },
  {
    id: "brand-impersonation",
    group: "impersonation",
    label: "Organization identity used in a request",
    explanation: "A familiar organization name does not authenticate a message or its links.",
    weight: 10,
    pattern: /\b(?:bank|rbi|income\s+tax|government|courier|delivery|amazon|flipkart|paytm|phonepe|sbi|hdfc|icici|airtel|jio|electricity\s+board)\b[^.!?;\n]{0,45}\b(?:verify|update|suspend|block|claim|payment|kyc|click|login|confirm|restore)\b/gi,
  },
  {
    id: "install-app",
    group: "impersonation",
    label: "Request to install an app or remote-access tool",
    explanation: "Unsolicited app or remote-access installation requests can expose your device or accounts.",
    weight: 20,
    pattern: /\b(?:install|download)\s+(?:this\s+)?(?:app|application|apk|anydesk|teamviewer|remote\s+access)\b|\b(?:anydesk|teamviewer|remote\s+access)\b/gi,
  },
];
