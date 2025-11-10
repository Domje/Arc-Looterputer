export interface Item {
  name?: string | Record<string, string>
  priority?: number
  imageFilename?: string // Updated from 'image' to match JSON data
  category?: string | Record<string, string>
  rarity?: string | Record<string, string>
  description?: string | Record<string, string>
  [key: string]: unknown
}

// Helper function to extract English text from multilingual fields
export function getLocalizedText(field: string | Record<string, string> | undefined): string {
  if (!field) return ""
  if (typeof field === "string") return field
  if (typeof field === "object" && field !== null) {
    // Try English first, then fall back to first available language
    return field.en || field.de || field.fr || field.es || Object.values(field)[0] || ""
  }
  return ""
}

export function sortItems(a: Item, b: Item): number {
  // Sort by priority descending if both have numeric priority
  const aPriority = typeof a.priority === "number" && isFinite(a.priority) ? a.priority : null
  const bPriority = typeof b.priority === "number" && isFinite(b.priority) ? b.priority : null

  if (aPriority !== null && bPriority !== null) {
    return bPriority - aPriority
  }

  // Fall back to name alphabetical
  const aName = getLocalizedText(a.name)
  const bName = getLocalizedText(b.name)
  return aName.localeCompare(bName)
}
