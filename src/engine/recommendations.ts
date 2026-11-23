import type { MatchedIndicator } from "../types";

export function getRecommendations(indicators: MatchedIndicator[]): string[] {
  if (indicators.length === 0) {
    return [
      "No configured warning pattern was detected. This does not prove the message is safe.",
      "Verify unexpected requests through the organization's official website, app, or a known phone number.",
      "Do not share OTPs, passwords, PINs, or CVV codes with anyone.",
    ];
  }
  const groups = new Set(indicators.map((indicator) => indicator.group));
  const advice: string[] = [];
  if (groups.has("sensitive")) advice.push("Do not share OTPs, passwords, PINs, CVV codes, or account details in response to this message.");
  if (groups.has("links")) advice.push("Avoid the message's links. Open the official app or type a verified website address yourself.");
  if (groups.has("payments")) advice.push("Do not pay an unexpected fee or transfer money until you independently verify the request.");
  if (groups.has("threats") || groups.has("urgency")) advice.push("Pause. Pressure and threats are not proof that the sender is genuine.");
  if (groups.has("impersonation")) advice.push("Contact the organization using contact details from its official website or app.");
  advice.push("Ask someone you trust to review the message if you are unsure.");
  return [...new Set(advice)];
}
