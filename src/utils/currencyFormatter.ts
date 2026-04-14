/**
 * Currency formatting utilities with proper locale support
 * Fix for SCRUM-22: Currency format displays correctly for European locales
 */

/**
 * Format amount with proper locale-specific formatting
 * Supports all ISO 4217 currency codes
 */
export const formatCurrency = (
  amount: number,
  currencyCode: string,
  locale?: string
): string => {
  // Detect user's locale if not provided
  const userLocale = locale || detectUserLocale();

  try {
    return new Intl.NumberFormat(userLocale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    // Fallback to basic formatting
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};

/**
 * Detect user's locale from device settings
 * Properly handles European locales for correct decimal/thousand separators
 */
export const detectUserLocale = (): string => {
  // In React Native, this would use NativeModules
  // For now, returning a sensible default
  if (typeof navigator !== 'undefined' && navigator.language) {
    return navigator.language;
  }

  // Default to US English
  return 'en-US';
};

/**
 * Get currency symbol for a given currency code
 */
export const getCurrencySymbol = (currencyCode: string, locale?: string): string => {
  const userLocale = locale || detectUserLocale();

  try {
    return (
      new Intl.NumberFormat(userLocale, {
        style: 'currency',
        currency: currencyCode,
      })
        .formatToParts(0)
        .find((part) => part.type === 'currency')?.value || currencyCode
    );
  } catch (error) {
    return currencyCode;
  }
};

/**
 * Parse currency string back to number
 * Handles various locale formats
 */
export const parseCurrency = (
  currencyString: string,
  locale?: string
): number => {
  const userLocale = locale || detectUserLocale();

  // Remove currency symbols and whitespace
  let cleaned = currencyString.replace(/[^\d.,-]/g, '');

  // Handle European format (comma as decimal separator)
  if (userLocale.startsWith('de') || userLocale.startsWith('fr') || userLocale.startsWith('es')) {
    // European format: 1.234,56 → 1234.56
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else {
    // US format: 1,234.56 → 1234.56
    cleaned = cleaned.replace(/,/g, '');
  }

  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Validate currency code against ISO 4217
 */
export const isValidCurrencyCode = (code: string): boolean => {
  const validCodes = [
    'USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD', 'NZD',
    'CNY', 'INR', 'BRL', 'MXN', 'ZAR', 'SGD', 'HKD', 'SEK',
    'NOK', 'DKK', 'PLN', 'CZK', 'HUF', 'RUB', 'TRY', 'KRW',
  ];

  return validCodes.includes(code.toUpperCase());
};
