import { describe, expect, it } from "vitest";
import { analyzeMessage } from "../engine/analyzeMessage";
import { createReport } from "./report";

describe("createReport", () => {
  it("includes the analysis summary without including matched user text", () => {
    const report = createReport(analyzeMessage("Share your OTP 123456 immediately."));
    expect(report).toContain("Risk score: 45/100");
    expect(report).toContain("Request for sensitive information");
    expect(report).not.toContain("Share your OTP");
    expect(report).not.toContain("123456");
    expect(report).toContain("not a probability of fraud");
  });
});
