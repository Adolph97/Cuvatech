import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';
import { calculatePrintingOrder } from './printingWeight';

type CatalogProduct = {
  id: string;
  basePrice: number;
  minQty: number;
  weightPerUnitKg: number;
};

const products = JSON.parse(
  fs.readFileSync(new URL('../products.json', import.meta.url), 'utf8')
) as CatalogProduct[];
const config = JSON.parse(
  fs.readFileSync(new URL('../config.json', import.meta.url), 'utf8')
) as { deliveryFee: number; minOrderWeightKg: number };

test('saved printing products have valid unique pricing and weight data', () => {
  const productIds = new Set<string>();

  for (const product of products) {
    assert.ok(product.id);
    assert.equal(productIds.has(product.id), false, `duplicate product id: ${product.id}`);
    assert.ok(Number.isFinite(product.basePrice) && product.basePrice > 0, `${product.id} price`);
    assert.ok(Number.isInteger(product.minQty) && product.minQty > 0, `${product.id} minimum quantity`);
    assert.ok(
      Number.isFinite(product.weightPerUnitKg) && product.weightPerUnitKg > 0,
      `${product.id} weight per unit`
    );
    productIds.add(product.id);
  }
});

test('every saved product can meet the configured minimum order weight', () => {
  for (const product of products) {
    const totals = calculatePrintingOrder({
      product,
      requestedQuantity: product.minQty,
      deliveryFee: config.deliveryFee,
      minOrderWeightKg: config.minOrderWeightKg
    });

    assert.ok(
      totals.estimatedWeightKg >= config.minOrderWeightKg,
      `${product.id} effective minimum does not meet delivery weight`
    );
  }
});
