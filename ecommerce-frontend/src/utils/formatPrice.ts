// Formats a number into Indian Rupee currency format.
// Example: formatPrice(1500) => "₹1,500"
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Calculates the discount percentage between original and discounted price.
// Example: getDiscountPercent(100, 75) => 25
export function getDiscountPercent(original: number, discounted: number): number {
  if (!discounted || discounted >= original) return 0;
  return Math.round(((original - discounted) / original) * 100);
}
