// Example in Next.js 15 (React Server Components)
export function formatDate(dateString, locale = 'en-US') {
    return new Date(dateString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// export function formatNumber(num: number) {
//     return new Intl.NumberFormat("en-IN").format(num);
// }

// export function formatCurrency(amount: number) {
//     return new Intl.NumberFormat("en-IN", {
//         style: "currency",
//         currency: "INR",
//     }).format(amount);
// }



