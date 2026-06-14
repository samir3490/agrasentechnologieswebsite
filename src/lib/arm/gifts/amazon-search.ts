const AMAZON_IN_SEARCH = "https://www.amazon.in/s";

export function buildAmazonInSearchUrl(query: string): string {
  const params = new URLSearchParams({ k: query.trim() });
  return `${AMAZON_IN_SEARCH}?${params.toString()}`;
}

export function buildAmazonInSearchUrlWithBudget(query: string, maxBudgetInr?: number): string {
  const q = maxBudgetInr ? `${query.trim()} under ${maxBudgetInr}` : query.trim();
  return buildAmazonInSearchUrl(q);
}
