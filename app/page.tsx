"use client"

import { useState } from "react"
import { Navigation } from "@/components/Navigation"
import { ItemCard } from "@/components/ItemCard"
import { ItemModal } from "@/components/ItemModal"
import { sortItems, getLocalizedText, recyclesIntoItem, type Item } from "@/lib/items"
import itemsData from "@/data/items.json"

export default function Home() {
  const [query, setQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<Item | null>(null)

  const items: Item[] = Array.isArray(itemsData) ? itemsData : []

  const filteredAndSorted = items
    .filter((item) => {
      if (!query) return true

      const queryLower = query.toLowerCase()
      const name = getLocalizedText(item.name)
      const rarity = getLocalizedText(item.rarity)

      // Check for special search keywords
      if (queryLower === "recycleable" || queryLower === "recyclable" || queryLower === "recycle") {
        return item.recyclesInto && Object.keys(item.recyclesInto).length > 0
      }
      if (queryLower === "craftable" || queryLower === "craft") {
        return item.recipe && Object.keys(item.recipe).length > 0
      }
      if (queryLower === "upgradable" || queryLower === "upgradeable" || queryLower === "upgrade") {
        return item.upgradeCost && Object.keys(item.upgradeCost).length > 0
      }

      // Check if item name matches OR rarity matches OR if item recycles into the search query
      return (
        name.toLowerCase().includes(queryLower) ||
        rarity.toLowerCase().includes(queryLower) ||
        recyclesIntoItem(item, query, items)
      )
    })
    .sort((a, b) => {
      if (!query) return sortItems(a, b)

      const nameA = getLocalizedText(a.name).toLowerCase()
      const nameB = getLocalizedText(b.name).toLowerCase()
      const queryLower = query.toLowerCase()

      // Check if items are direct name matches
      const aIsNameMatch = nameA.includes(queryLower)
      const bIsNameMatch = nameB.includes(queryLower)

      // Prioritize direct name matches first
      if (aIsNameMatch && !bIsNameMatch) return -1
      if (!aIsNameMatch && bIsNameMatch) return 1

      // If both are name matches or both are recycle matches, use default sorting
      return sortItems(a, b)
    })

  const hasQuery = query.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Search section */}
      <div
        className={
          hasQuery
            ? "sticky top-[57px] z-40 backdrop-blur bg-[#120817]/80 border-b border-white/5 py-2"
            : "min-h-[50vh] grid place-items-center"
        }
      >
        <div className="w-full max-w-2xl px-4 mx-auto">
          <label htmlFor="search-input" className="sr-only">
            Search items
          </label>
          <input
            id="search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search items..."
            className="bg-[#eae1d1] text-[#120817] rounded-tl-3xl rounded-br-3xl rounded-tr-none rounded-bl-none placeholder:text-[#120817]/60 px-5 py-4 w-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#eae1d1]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#120817]"
          />
        </div>
      </div>

      {/* Results section */}
      <div className="flex-1 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {hasQuery && (
            <p className="text-sm text-[#eae1d1]/60 mb-4" aria-live="polite">
              {filteredAndSorted.length} result
              {filteredAndSorted.length !== 1 ? "s" : ""}
            </p>
          )}

          {filteredAndSorted.length === 0 && hasQuery ? (
            <div className="text-center py-12">
              <p className="text-[#eae1d1]/60">No items match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredAndSorted.map((item, index) => (
                <ItemCard key={index} item={item} onClick={() => setSelectedItem(item)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-[#eae1d1]/50">data from arctracker.io</footer>

      {selectedItem && <ItemModal item={selectedItem} isOpen={!!selectedItem} onClose={() => setSelectedItem(null)} />}
    </div>
  )
}
