const LEGACY_WEIGHT_PER_UNIT_KG: Record<string, number> = {
  't-shirts': 0.2,
  caps: 0.15,
  banners: 0.5,
  mugs: 0.35,
  notebooks: 0.35,
  stickers: 0.015,
  menus: 0.05,
  souvenirs: 0.4,
  pens: 0.05,
  custom: 0.2
};

const DEFAULT_WEIGHT_PER_UNIT_KG = 0.2;

type WeightedProduct = {
  id: string;
  weightPerUnitKg?: number;
};

type PricedProduct = WeightedProduct & {
  basePrice: number;
  minQty: number;
};

export function getProductWeightPerUnitKg(product: WeightedProduct): number {
  if (Number.isFinite(product.weightPerUnitKg) && product.weightPerUnitKg! > 0) {
    return product.weightPerUnitKg!;
  }

  return LEGACY_WEIGHT_PER_UNIT_KG[product.id] ?? DEFAULT_WEIGHT_PER_UNIT_KG;
}

export function estimatePrintingWeightKg(product: WeightedProduct, quantity: number): number {
  return Math.max(0, quantity) * getProductWeightPerUnitKg(product);
}

const roundCurrency = (value: number) => Math.round(value * 100) / 100;

export function getMinimumPrintingQuantity(product: PricedProduct, minOrderWeightKg: number): number {
  const minimumByWeight = Math.ceil(
    Math.max(0, minOrderWeightKg) / getProductWeightPerUnitKg(product)
  );

  return Math.max(product.minQty, minimumByWeight);
}

export function calculatePrintingOrder({
  product,
  requestedQuantity,
  deliveryFee,
  minOrderWeightKg
}: {
  product: PricedProduct;
  requestedQuantity: number;
  deliveryFee: number;
  minOrderWeightKg: number;
}) {
  const minimumQuantity = getMinimumPrintingQuantity(product, minOrderWeightKg);
  const quantity = Math.max(minimumQuantity, Math.floor(requestedQuantity || 0));
  const discountRate = quantity >= 500 ? 0.2 : quantity >= 200 ? 0.1 : 0;
  const subtotal = roundCurrency(product.basePrice * quantity * (1 - discountRate));
  const setupFee = product.id === 'custom' ? 25 : 15;
  const totalBeforeDelivery = roundCurrency(subtotal + setupFee);
  const normalizedDeliveryFee = roundCurrency(Math.max(0, deliveryFee));

  return {
    quantity,
    unitPrice: product.basePrice,
    discountRate,
    subtotal,
    setupFee,
    totalBeforeDelivery,
    deliveryFee: normalizedDeliveryFee,
    grandTotal: roundCurrency(totalBeforeDelivery + normalizedDeliveryFee),
    estimatedWeightKg: estimatePrintingWeightKg(product, quantity)
  };
}
