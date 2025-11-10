"use client"

import type { Item } from "./items"

const STORAGE_KEY = "arc-raiders-shopping-list"

export function getShoppingList(): Item[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function addToShoppingList(item: Item): void {
  if (typeof window === "undefined") return
  try {
    const list = getShoppingList()
    // Check if item already exists (by id or name)
    const itemId = item.id || item.name
    const exists = list.some((listItem) => (listItem.id || listItem.name) === itemId)
    if (!exists) {
      list.push(item)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent("shopping-list-updated"))
    }
  } catch (error) {
    console.error("Failed to add item to shopping list:", error)
  }
}

export function removeFromShoppingList(item: Item): void {
  if (typeof window === "undefined") return
  try {
    const list = getShoppingList()
    const itemId = item.id || item.name
    const filtered = list.filter((listItem) => (listItem.id || listItem.name) !== itemId)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    window.dispatchEvent(new CustomEvent("shopping-list-updated"))
  } catch (error) {
    console.error("Failed to remove item from shopping list:", error)
  }
}

export function isInShoppingList(item: Item): boolean {
  const list = getShoppingList()
  const itemId = item.id || item.name
  return list.some((listItem) => (listItem.id || listItem.name) === itemId)
}
