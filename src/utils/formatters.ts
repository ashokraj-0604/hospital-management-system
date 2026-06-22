export const fmt = (n: number) =>
  n.toLocaleString('en-IN');

export const fmtCurrencyShort = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`;
  return `₹${n}`;
};