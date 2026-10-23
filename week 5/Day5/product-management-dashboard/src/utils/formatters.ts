/**
 * Formatting and data calculation utility functions
 */

export function formatCurrency(amount: number): string {
  if (isNaN(amount)) return '$0.00';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function truncateText(text: string, maxLength: number = 60): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trim()}...`;
}

export function calculateAveragePrice(prices: number[]): number {
  if (!prices || prices.length === 0) return 0;
  const sum = prices.reduce((acc, curr) => acc + (isNaN(curr) ? 0 : curr), 0);
  return sum / prices.length;
}

export function getStockStatus(stock: number): {
  label: string;
  variant: 'success' | 'warning' | 'danger';
} {
  if (stock <= 0) {
    return { label: 'Out of Stock', variant: 'danger' };
  }
  if (stock < 10) {
    return { label: `Low Stock (${stock})`, variant: 'warning' };
  }
  return { label: `In Stock (${stock})`, variant: 'success' };
}
