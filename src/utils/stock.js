export const UMBRAL_STOCK_BAJO = 5;

export function esStockBajo(stock) {
  return Number.isFinite(stock) && stock > 0 && stock <= UMBRAL_STOCK_BAJO;
}
