const NEGATED_REQUEST = /\b(?:never|don't|do not|shouldn't|should not|must not|avoid|never ever|don't ever|not to)\b[^.!?;,\n]{0,24}$/i;
export function isEducationalSensitiveContext(text: string, matchIndex: number): boolean {
  const sentenceStart = Math.max(
    text.lastIndexOf(".", matchIndex - 1),
    text.lastIndexOf("!", matchIndex - 1),
    text.lastIndexOf("?", matchIndex - 1),
    text.lastIndexOf("\n", matchIndex - 1),
  ) + 1;
  const before = text.slice(Math.max(sentenceStart, matchIndex - 80), matchIndex);
  return NEGATED_REQUEST.test(before);
}
