import assert from 'node:assert/strict';
import test from 'node:test';
import {
  calculatePrintingOrder,
  estimatePrintingWeightKg,
  getProductWeightPerUnitKg
} from './printingWeight';

test('uses the product weight configured by an admin', () => {
  const product = {
    id: 't-shirts',
    weightPerUnitKg: 0.35
  };

  assert.equal(getProductWeightPerUnitKg(product), 0.35);
  assert.equal(estimatePrintingWeightKg(product, 20), 7);
});

test('keeps the legacy product-specific estimate for products without a saved weight', () => {
  assert.equal(getProductWeightPerUnitKg({ id: 't-shirts' }), 0.2);
  assert.equal(getProductWeightPerUnitKg({ id: 'stickers' }), 0.015);
  assert.equal(getProductWeightPerUnitKg({ id: 'unknown-product' }), 0.2);
});

test('ignores invalid saved weights and prevents negative quantities', () => {
  assert.equal(getProductWeightPerUnitKg({ id: 'caps', weightPerUnitKg: -1 }), 0.15);
  assert.equal(estimatePrintingWeightKg({ id: 'caps', weightPerUnitKg: 0.25 }, -10), 0);
});

test('uses the product minimum quantity consistently for price and weight', () => {
  const totals = calculatePrintingOrder({
    product: {
      id: 't-shirts',
      basePrice: 20,
      minQty: 10,
      weightPerUnitKg: 1
    },
    requestedQuantity: 5,
    deliveryFee: 35,
    minOrderWeightKg: 0.5
  });

  assert.deepEqual(totals, {
    quantity: 10,
    unitPrice: 20,
    discountRate: 0,
    subtotal: 200,
    setupFee: 15,
    totalBeforeDelivery: 215,
    deliveryFee: 35,
    grandTotal: 250,
    estimatedWeightKg: 10
  });
});

test('applies the 200-unit discount and configured delivery fee', () => {
  const totals = calculatePrintingOrder({
    product: {
      id: 'caps',
      basePrice: 12,
      minQty: 15,
      weightPerUnitKg: 0.15
    },
    requestedQuantity: 200,
    deliveryFee: 40,
    minOrderWeightKg: 0.5
  });

  assert.equal(totals.discountRate, 0.1);
  assert.equal(totals.subtotal, 2160);
  assert.equal(totals.grandTotal, 2215);
  assert.equal(totals.estimatedWeightKg, 30);
});

test('uses the custom setup fee without overriding configured delivery', () => {
  const totals = calculatePrintingOrder({
    product: {
      id: 'custom',
      basePrice: 15,
      minQty: 5,
      weightPerUnitKg: 0.2
    },
    requestedQuantity: 5,
    deliveryFee: 35,
    minOrderWeightKg: 0.5
  });

  assert.equal(totals.setupFee, 25);
  assert.equal(totals.deliveryFee, 35);
  assert.equal(totals.grandTotal, 135);
});

test('raises the effective quantity when delivery weight requires more units', () => {
  const totals = calculatePrintingOrder({
    product: {
      id: 'custom',
      basePrice: 15,
      minQty: 5,
      weightPerUnitKg: 0.2
    },
    requestedQuantity: 5,
    deliveryFee: 35,
    minOrderWeightKg: 10
  });

  assert.equal(totals.quantity, 50);
  assert.equal(totals.estimatedWeightKg, 10);
  assert.equal(totals.grandTotal, 810);
});
