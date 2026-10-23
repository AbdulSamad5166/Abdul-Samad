import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatCurrency,
  truncateText,
  calculateAveragePrice,
  getStockStatus,
} from './formatters.js';

test('formatCurrency formats USD correctly', () => {
  assert.equal(formatCurrency(19.99), '$19.99');
  assert.equal(formatCurrency(0), '$0.00');
  assert.equal(formatCurrency(1250), '$1,250.00');
});

test('truncateText truncates beyond max length', () => {
  assert.equal(truncateText('Hello world', 5), 'Hello...');
  assert.equal(truncateText('Short', 10), 'Short');
  assert.equal(truncateText('', 10), '');
});

test('calculateAveragePrice calculates accurately', () => {
  assert.equal(calculateAveragePrice([10, 20, 30]), 20);
  assert.equal(calculateAveragePrice([]), 0);
  assert.equal(calculateAveragePrice([5]), 5);
});

test('getStockStatus classifies stock levels', () => {
  assert.deepEqual(getStockStatus(0), { label: 'Out of Stock', variant: 'danger' });
  assert.deepEqual(getStockStatus(5), { label: 'Low Stock (5)', variant: 'warning' });
  assert.deepEqual(getStockStatus(25), { label: 'In Stock (25)', variant: 'success' });
});
