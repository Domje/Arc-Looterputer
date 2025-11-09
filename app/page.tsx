"use client"

import { useState, useEffect } from "react"
import { ItemCard } from "@/components/ItemCard"
import { sortItems, type Item } from "@/lib/items"

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch("/data/items.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch items")
        return res.json()
      })
      .then((data) => {
        setItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const filteredAndSorted = items
    .filter((item) => {
      if (!query) return true
      return item.name?.toString().toLowerCase().includes(query.toLowerCase())
    })
    .sort(sortItems)

  const hasQuery = query.length > 0

  return (
    <div className="min-h-screen flex flex-col">
      {/* Search section */}
      <div
        className={
          hasQuery
            ? "sticky top-0 z-50 backdrop-blur bg-[#120817]/80 border-b border-white/5 py-4"
            : "min-h-[70vh] grid place-items-center"
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
          {loading && <p className="text-center text-[#eae1d1]/60">Loading items...</p>}

          {error && <p className="text-center text-red-400">Error: {error}</p>}

          {!loading && !error && (
            <>
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
                    <ItemCard key={index} item={item} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-[#eae1d1]/50">data from arctracker.io</footer>
    </div>
  )
}
