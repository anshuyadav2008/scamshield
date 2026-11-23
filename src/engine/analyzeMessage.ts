import { isEducationalSensitiveContext } from "./contextFilter";
import { getRecommendations } from "./recommendations";
import { GROUP_LABELS, RULES } from "./rules";
import { extractUrls } from "./urls";
import type { AnalysisResult, MatchedIndicator, RiskLevel, RuleGroup } from "../types";

function findIndicators(text: string): MatchedIndicator[] {
  const found: MatchedIndicator[] = [];
  for (const rule of RULES) {
    rule.pattern.lastIndex = 0;
    for (const match of text.matchAll(rule.pattern)) {
      const phrase = match[0];
      const index = match.index ?? 0;
      if (rule.group === "sensitive" && isEducationalSensitiveContext(text, index)) continue;
      const indicator: MatchedIndicator = {
        id: rule.id,
        group: rule.group,
        label: rule.label,
        explanation: rule.explanation,
        weight: rule.weight,
        phrase: phrase.trim(),
      };
      if (!found.some((item) => item.id === indicator.id)) found.push(indicator);
    }
  }
  return found;
}

function classify(score: number): RiskLevel {
  if (score >= 60) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

export function analyzeMessage(text: string): AnalysisResult {
  const indicators = findIndicators(text);
  const bestByGroup = new Map<RuleGroup, MatchedIndicator>();
  for (const indicator of indicators) {
    const current = bestByGroup.get(indicator.group);
    if (!current || indicator.weight > current.weight) bestByGroup.set(indicator.group, indicator);
  }
  const contributions = [...bestByGroup.entries()].map(([group, indicator]) => ({
    group,
    label: GROUP_LABELS[group],
    points: indicator.weight,
    indicator,
  }));
  const hasSensitive = bestByGroup.has("sensitive");
  const hasTrigger = bestByGroup.has("links") || bestByGroup.has("threats");
  const combinationBonus = hasSensitive && hasTrigger;
  const score = Math.min(100, contributions.reduce((sum, contribution) => sum + contribution.points, 0) + (combinationBonus ? 10 : 0));
  return {
    score,
    level: classify(score),
    indicators,
    contributions,
    combinationBonus,
    recommendations: getRecommendations(indicators),
    urls: extractUrls(text),
  };
}
