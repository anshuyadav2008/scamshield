import { describe, expect, it } from "vitest";
import { analyzeMessage } from "./analyzeMessage";

describe("analyzeMessage", () => {
  it("does not score an empty or ordinary message", () => {
    expect(analyzeMessage("").score).toBe(0);
    expect(analyzeMessage("I'll see you at the cafe at 5.").level).toBe("LOW");
    expect(analyzeMessage("My bank branch is near the station.").score).toBe(0);
    expect(analyzeMessage("The bank app explains OTP expiration. Never share your OTP.").score).toBe(0);
  });

  it("excludes a clear OTP safety warning from sensitive-request detection", () => {
    const result = analyzeMessage("Never share your OTP with anyone. This is a safety reminder.");
    expect(result.contributions.some((item) => item.group === "sensitive")).toBe(false);
  });

  it("still detects a direct request when it follows an unrelated safety warning", () => {
    const result = analyzeMessage("Never share your OTP. Please send your CVV to process this refund.");
    expect(result.contributions.some((item) => item.group === "sensitive")).toBe(true);
    expect(analyzeMessage("Never share your OTP, but send your password now.").contributions.some((item) => item.group === "sensitive")).toBe(true);
  });

  it("keeps the maximum rule weight per group and adds the combination bonus once", () => {
    const result = analyzeMessage("Urgent! Click the link https://bit.ly/claim and share your OTP now.");
    expect(result.contributions.filter((item) => item.group === "links")).toHaveLength(1);
    expect(result.contributions.find((item) => item.group === "links")?.points).toBe(15);
    expect(result.combinationBonus).toBe(true);
    expect(result.score).toBe(70);
  });

  it("recognizes Hindi-English scam cues and URL cautions without declaring the URL malicious", () => {
    const result = analyzeMessage("Aapka bank account block ho jayega. KYC update karne ke liye link par click karein https://tinyurl.com/check");
    expect(result.contributions.some((item) => item.group === "threats")).toBe(true);
    expect(result.urls[0]?.shortened).toBe(true);
    expect(result.urls[0]?.cautionReasons.join(" ")).not.toMatch(/malicious/i);
  });

  it("recognizes Aadhaar status and UPI PIN requests", () => {
    const aadhaar = analyzeMessage("Aadhaar verification pending.");
    const pin = analyzeMessage("Apna UPI PIN enter karo.");
    expect(aadhaar.contributions.some((item) => item.group === "threats")).toBe(true);
    expect(pin.contributions.some((item) => item.group === "sensitive")).toBe(true);
  });

  it("caps score at 100 and applies risk band boundaries", () => {
    const maxed = analyzeMessage("Urgent act now. Keep this secret. Your account will be blocked. You have won a prize. Share your OTP. Click the link https://bit.ly/offer. Pay a processing fee. Install this app. Bank update now.");
    expect(maxed.score).toBe(100);
    expect(maxed.level).toBe("HIGH");
    expect(analyzeMessage("Share your OTP.").score).toBe(30);
    expect(analyzeMessage("Share your OTP.").level).toBe("MEDIUM");
    expect(analyzeMessage("Your account will be blocked. Share your OTP.").score).toBe(60);
    expect(analyzeMessage("Your account will be blocked. Share your OTP.").level).toBe("HIGH");
    expect(analyzeMessage("Act now. Click the link.").score).toBe(25);
    expect(analyzeMessage("Act now. Click the link. Pay a processing fee.").score).toBe(45);
  });

  it("detects an OTP request, payment demand, Hinglish examples, and multiple link indicators", () => {
    const otp = analyzeMessage("Share your OTP to confirm.");
    const payment = analyzeMessage("Pay a registration fee to secure the job.");
    const hinglish = analyzeMessage("Aapka account block ho jayega. OTP share karo.");
    const links = analyzeMessage("Click the link https://bit.ly/claim");
    expect(otp.contributions.find((item) => item.group === "sensitive")?.points).toBe(30);
    expect(payment.contributions.some((item) => item.group === "payments")).toBe(true);
    expect(hinglish.contributions.some((item) => item.group === "sensitive")).toBe(true);
    expect(links.contributions.filter((item) => item.group === "links")).toHaveLength(1);
    expect(links.contributions.find((item) => item.group === "links")?.points).toBe(15);
  });
});
