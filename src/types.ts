export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type RuleGroup =
  | "urgency"
  | "threats"
  | "sensitive"
  | "links"
  | "payments"
  | "impersonation";

export interface MatchedIndicator {
  id: string;
  group: RuleGroup;
  label: string;
  explanation: string;
  weight: number;
  phrase: string;
}

export interface GroupContribution {
  group: RuleGroup;
  label: string;
  points: number;
  indicator: MatchedIndicator;
}

export interface ExtractedUrl {
  url: string;
  shortened: boolean;
  cautionReasons: string[];
}

export interface AnalysisResult {
  score: number;
  level: RiskLevel;
  indicators: MatchedIndicator[];
  contributions: GroupContribution[];
  combinationBonus: boolean;
  recommendations: string[];
  urls: ExtractedUrl[];
}

export interface ScanRecord {
  id: string;
  createdAt: number;
  score: number;
  level: RiskLevel;
  categories: string[];
}
