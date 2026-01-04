/**
 * Date & Time format constants
 */
export const DATE_FORMAT = {
  DISPLAY: "DD/MM/YYYY",
  DATABASE: "YYYY-MM-DD",
  TIME_12H: "hh:mm A",
  TIME_24H: "HH:mm",
  FULL_DATETIME: "DD/MM/YYYY HH:mm",
} as const

/**
 * Currency format constants
 */
export const CURRENCY_FORMAT = {
  VND: {
    symbol: "₫",
    position: "suffix" as const,
    thousandSeparator: ",",
    decimalSeparator: ".",
    precision: 0,
  },
} as const

/**
 * Default values
 */
export const DEFAULTS = {
  LANGUAGE: "vi" as const,
  CURRENCY: "VND" as const,
  THEME_MODE: "light" as const,
} as const
