export interface Item {
  name?: string | Record<string, string>
  priority?: number
  imageFilename?: string // Updated from 'image' to match JSON data
  category?: string | Record<string, string>
  rarity?: string | Record<string, string>
  description?: string | Record<string, string>
  recyclesInto?: Record<string, number>
  id?: string
  value?: number // Added value field for sale value
  craftBench?: string
  recipe?: Record<string, number> // Added recipe field for crafting materials
  upgradeCost?: Record<string, number> // Added upgradeCost field for item upgrades
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

export function recyclesIntoItem(
  item: Item,
  targetQuery: string,
  allItems: Item[],
  visitedIds: Set<string> = new Set(),
): boolean {
  if (!item.recyclesInto) return false

  // Prevent infinite loops
  const itemId = item.id || getLocalizedText(item.name)
  if (visitedIds.has(itemId)) return false
  visitedIds.add(itemId)

  // Check direct recycle targets
  for (const recycleId of Object.keys(item.recyclesInto)) {
    const recycleItem = allItems.find((i) => i.id === recycleId)
    if (recycleItem) {
      const recycleName = getLocalizedText(recycleItem.name)
      if (recycleName.toLowerCase().includes(targetQuery.toLowerCase())) {
        return true
      }
      // Recursively check if this recycle item recycles into the target
      if (recyclesIntoItem(recycleItem, targetQuery, allItems, visitedIds)) {
        return true
      }
    }
  }

  return false
}
