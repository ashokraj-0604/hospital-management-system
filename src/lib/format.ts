// src/lib/format.ts
// Centralized formatting helpers. Previously duplicated as fmtDate (Audit),
// fmtINR (Billing), and timeAgo (Users) inside each page file.

export function fmtDate(d: string) {
  return new Date(d).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export function fmtDateShort(d: string) {
  return new Date(d).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function fmtINR(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency', currency: 'INR', maximumFractionDigits: 0,
  }).format(n);
}

export function timeAgo(dateStr?: string | null) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'Just now';
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export function initials(fullName: string) {
  return fullName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}