/**
 * Helper functions for formatting
 */

/**
 * Format number to currency string
 */
export function formatCurrency(amount: number, currency: "VND" = "VND"): string {
  if (currency === "VND") {
    const formatted = Math.abs(amount)
      .toFixed(0)
      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return `${formatted}₫`
  }
  return `${amount}`
}

/**
 * Format Unix timestamp to date string
 */
export function formatDate(timestamp: number, format: string = "DD/MM/YYYY"): string {
  const date = new Date(timestamp * 1000)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()

  if (format === "DD/MM/YYYY") {
    return `${day}/${month}/${year}`
  }
  if (format === "YYYY-MM-DD") {
    return `${year}-${month}-${day}`
  }
  return `${day}/${month}/${year}`
}

/**
 * Format time string
 */
export function formatTime(time: string, format: "12h" | "24h" = "24h"): string {
  if (format === "24h") {
    return time
  }
  // Convert HH:mm to hh:mm AM/PM
  const [hours, minutes] = time.split(":").map(Number)
  const period = hours >= 12 ? "PM" : "AM"
  const displayHours = hours % 12 || 12
  return `${String(displayHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`
}

/**
 * Get current Unix timestamp
 */
export function getCurrentTimestamp(): number {
  return Math.floor(Date.now() / 1000)
}

/**
 * Get current time string (HH:mm)
 */
export function getCurrentTimeString(): string {
  const now = new Date()
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")
  return `${hours}:${minutes}`
}
