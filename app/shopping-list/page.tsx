"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/Navigation"
import { getLocalizedText, type Item } from "@/lib/items"
import { getShoppingList, removeFromShoppingList } from "@/lib/shopping-list"
import { Trash2 } from "lucide-react"

export default function ChristmasListPage() {
  const [list, setList] = useState<Item[]>([])

  useEffect(() => {
    // Load initial list
    setList(getShoppingList())

    // Listen for updates
    const handleUpdate = () => {
      setList(getShoppingList())
    }
    window.addEventListener("shopping-list-updated", handleUpdate)
    return () => window.removeEventListener("shopping-list-updated", handleUpdate)
  }, [])

  const handleRemove = (item: Item) => {
    removeFromShoppingList(item)
  }

  const getRarityColors = (rarity: string) => {
    const rarityLower = rarity.toLowerCase()
    if (rarityLower === "common") return "text-[#3ba578]"
    if (rarityLower === "rare") return "text-[#4fa7da]"
    if (rarityLower === "epic") return "text-[#c850a9]"
    if (rarityLower === "legendary") return "text-[#ffae00]"
    return "text-[#eae1d1]"
  }

  const totalValue = list.reduce((sum, item) => sum + (item.value || 0), 0)

  return (
    <div className="min-h-screen bg-[#120817] text-[#eae1d1]">
      <Navigation />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-extrabold mb-2 text-balance text-center">SHOPPING</h1>
          <p className="text-[#eae1d1]/60 text-center">Track items you need to collect in Arc Raiders</p>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-12 bg-[#eae1d1]/5 rounded-tl-3xl rounded-br-3xl border border-white/10">
            <p className="text-[#eae1d1]/60 mb-2">Your shopping list is empty</p>
            <p className="text-sm text-[#eae1d1]/40">Click the + button on items to add them here</p>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="bg-[#3ba578]/10 border-2 border-[#3ba578] rounded-tl-3xl rounded-br-3xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-[#eae1d1]/70 mb-1">Total Items</p>
                  <p className="text-3xl font-bold">{list.length}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-[#eae1d1]/70 mb-1">Total Value</p>
                  <div className="flex items-center gap-2 justify-end">
                    <img src="/images/raidertoken.webp" alt="Raider Token" className="w-6 h-6 object-contain p-1" />
                    <p className="text-3xl font-bold text-[#ffae00]">{totalValue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="space-y-3">
              {list.map((item, index) => {
                const name = getLocalizedText(item.name)
                const category = getLocalizedText(item.category)
                const rarity = getLocalizedText(item.rarity)
                const value = item.value

                return (
                  <div
                    key={index}
                    className="bg-[#eae1d1]/5 hover:bg-[#eae1d1]/10 rounded-tl-3xl rounded-br-3xl border border-white/10 p-4 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Image */}
                      <div className="w-16 h-16 bg-[#120817]/50 rounded flex items-center justify-center flex-shrink-0">
                        {item.imageFilename ? (
                          <img
                            src={item.imageFilename || "/placeholder.svg"}
                            alt={name}
                            className="max-w-full max-h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-xs text-[#eae1d1]/30">No image</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-lg leading-tight mb-1">{name}</h3>
                        <div className="flex items-center gap-3 text-sm">
                          {category && <span className="text-[#eae1d1]/70">{category}</span>}
                          {rarity && <span className={`font-semibold ${getRarityColors(rarity)}`}>{rarity}</span>}
                          {typeof value === "number" && (
                            <div className="flex items-center gap-1">
                              <img
                                src="/images/raidertoken.webp"
                                alt="Raider Token"
                                className="w-4 h-4 object-contain"
                              />
                              <span className="text-[#ffae00] font-semibold">{value.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Remove button */}
                      <button
                        onClick={() => handleRemove(item)}
                        className="w-10 h-10 rounded-full bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
                        aria-label="Remove from list"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>

      <footer className="py-6 text-center text-sm text-[#eae1d1]/50">data from arctracker.io</footer>
    </div>
  )
}

// Placeholder for ShoppingBag component
function ShoppingBag({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  )
}
