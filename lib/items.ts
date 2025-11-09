export interface Item {
  name?: string
  priority?: number
  image?: string
  category?: string
  rarity?: string
  description?: string
  [key: string]: unknown
}

export function sortItems(a: Item, b: Item): number {
  // Sort by priority descending if both have numeric priority
  const aPriority = typeof a.priority === "number" && isFinite(a.priority) ? a.priority : null
  const bPriority = typeof b.priority === "number" && isFinite(b.priority) ? b.priority : null

  if (aPriority !== null && bPriority !== null) {
    return bPriority - aPriority
  }

  // Fall back to name alphabetical
  const aName = a.name?.toString() || ""
  const bName = b.name?.toString() || ""
  return aName.localeCompare(bName)
}
