export const CASE_PRICES: Record<number, number> = {
  9440: 0.5,
  9441: 1.0,
  9442: 2.5,
  // Добавь другие ID
};

export function getCasePrice(case_id: number): number {
  return CASE_PRICES[case_id] ?? 2; // fallback по умолчанию
}
