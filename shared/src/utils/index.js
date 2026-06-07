// ============================================================
// CHIKOTI REAL ESTATE — SHARED UTILITIES
// ============================================================

/** Format price in Indian numbering (₹12,00,000) */
export function formatPrice(amount) {
  if (!amount && amount !== 0) return '—';
  return '₹' + Number(amount).toLocaleString('en-IN');
}

/** Format price in lakhs/crores */
export function formatPriceShort(amount) {
  if (!amount) return '—';
  if (amount >= 1_00_00_000) return `₹${(amount / 1_00_00_000).toFixed(2)} Cr`;
  if (amount >= 1_00_000)    return `₹${(amount / 1_00_000).toFixed(1)} L`;
  return formatPrice(amount);
}

/** Format date to readable string */
export function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
}

/** Format date+time */
export function formatDateTime(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/** Convert area to sq yards */
export function toSqYards(area, unit) {
  if (unit === 'sq_feet') return area / 9;
  if (unit === 'acres')   return area * 4840;
  return area; // already sq yards
}

/** Calculate total property cost */
export function calculateTotal(basePrice, includeReg, includeGST) {
  const reg = includeReg ? basePrice * 0.05 : 0;
  const gst = includeGST ? basePrice * 0.18 : 0;
  return { base: basePrice, registration: reg, gst, total: basePrice + reg + gst };
}

/** Truncate text */
export function truncate(str, maxLen = 80) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '…' : str;
}

/** Generate a random ID */
export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** Validate Indian phone number */
export function isValidPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
}

/** Validate email */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Build WhatsApp URL */
export function whatsappUrl(phone, message = '') {
  const clean = phone.replace(/\D/g, '');
  const num   = clean.startsWith('91') ? clean : '91' + clean;
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

/** Get property type badge color */
export function typeBadgeColor(type) {
  return { Agriculture: '#16a34a', Commercial: '#d97706', Residential: '#2563eb' }[type] || '#6b7280';
}

/** Read a file as base64 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload  = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
