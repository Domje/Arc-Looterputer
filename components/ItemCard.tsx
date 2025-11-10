"use client"

import type React from "react"

import { getLocalizedText, type Item } from "@/lib/items"
import { addToShoppingList, isInShoppingList } from "@/lib/shopping-list"
import itemsData from "@/data/items.json"
import { Plus, Check, Wrench } from "lucide-react"
import { useState, useEffect } from "react"

interface ItemCardProps {
  item: Item
  onClick: () => void
}

export function ItemCard({ item, onClick }: ItemCardProps) {
  const imageSrc = item.imageFilename || null

  const name = getLocalizedText(item.name)
  const category = getLocalizedText(item.category)
  const rarity = getLocalizedText(item.rarity)
  const value = item.value
  const isCraftable = !!item.craftBench

  const getRarityColors = () => {
    const rarityLower = rarity.toLowerCase()
    if (rarityLower === "common")
      return {
        bg: "bg-[#3ba578]/10",
        border: "border-[#3ba578]",
        text: "text-[#3ba578]",
      }
    if (rarityLower === "rare")
      return {
        bg: "bg-[#4fa7da]/10",
        border: "border-[#4fa7da]",
        text: "text-[#4fa7da]",
      }
    if (rarityLower === "epic")
      return {
        bg: "bg-[#c850a9]/10",
        border: "border-[#c850a9]",
        text: "text-[#c850a9]",
      }
    if (rarityLower === "legendary")
      return {
        bg: "bg-[#ffae00]/10",
        border: "border-[#ffae00]",
        text: "text-[#ffae00]",
      }
    return {
      bg: "bg-[#eae1d1]/5",
      border: "border-white/10",
      text: "text-[#eae1d1]",
    }
  }

  const colors = getRarityColors()

  const recycleItems = item.recyclesInto
    ? Object.entries(item.recyclesInto).map(([itemId, quantity]) => {
        const recycleItem = itemsData.find((i) => i.id === itemId)
        return {
          id: itemId,
          quantity,
          imageFilename: recycleItem?.imageFilename,
          name: recycleItem ? getLocalizedText(recycleItem.name) : itemId,
        }
      })
    : []

  const recipeItems = item.recipe
    ? Object.entries(item.recipe).map(([itemId, quantity]) => {
        const recipeItem = itemsData.find((i) => i.id === itemId)
        return {
          id: itemId,
          quantity,
          imageFilename: recipeItem?.imageFilename,
          name: recipeItem ? getLocalizedText(recipeItem.name) : itemId,
        }
      })
    : []

  const [inList, setInList] = useState(false)

  useEffect(() => {
    setInList(isInShoppingList(item))

    const handleUpdate = () => {
      setInList(isInShoppingList(item))
    }
    window.addEventListener("shopping-list-updated", handleUpdate)
    return () => window.removeEventListener("shopping-list-updated", handleUpdate)
  }, [item])

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToShoppingList(item)
  }

  return (
    <div
      onClick={onClick}
      className={`${colors.bg} rounded-tl-3xl rounded-br-3xl overflow-hidden border-2 ${colors.border} hover:opacity-90 transition-opacity cursor-pointer relative`}
    >
      {/* Image */}
      {imageSrc ? (
        <div className="aspect-square bg-[#120817]/50 flex items-center justify-center p-4 relative">
          {isCraftable && (
            <div className="absolute top-2 left-2 bg-[#eae1d1]/20 rounded-full p-1.5" title="Craftable">
              <Wrench className="w-4 h-4 text-[#eae1d1]" />
            </div>
          )}
          {rarity && (
            <span className={`absolute top-2 right-2 ${colors.text} font-bold text-sm uppercase`}>{rarity}</span>
          )}
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={name || "Item"}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : (
        <div className="aspect-square bg-[#120817]/50 flex items-center justify-center relative">
          {isCraftable && (
            <div className="absolute top-2 left-2 bg-[#eae1d1]/20 rounded-full p-1.5" title="Craftable">
              <Wrench className="w-4 h-4 text-[#eae1d1]" />
            </div>
          )}
          {rarity && (
            <span className={`absolute top-2 right-2 ${colors.text} font-bold text-sm uppercase`}>{rarity}</span>
          )}
          <span className="text-[#eae1d1]/30 text-sm">No image</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-2 pb-14">
        <h3 className="font-extrabold text-lg leading-tight">{name || "Unknown Item"}</h3>

        <div className="flex items-center justify-between gap-2">
          {category && <p className="text-sm text-[#eae1d1]/70">Category: {category}</p>}
          {typeof value === "number" && (
            <div className="flex items-center gap-1">
              <img src="/images/raidertoken.webp" alt="Raider Token" className="w-4 h-4 object-contain" />
              <p className="text-sm text-[#ffae00] font-semibold whitespace-nowrap">{value.toLocaleString()}</p>
            </div>
          )}
        </div>

        {recipeItems.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-[#eae1d1]/70 font-semibold">Craftable with:</p>
            <div className="flex flex-wrap gap-2">
              {recipeItems.map((recipeItem) => (
                <div
                  key={recipeItem.id}
                  className="flex items-center gap-1.5 bg-[#120817]/30 rounded px-2 py-1"
                  title={recipeItem.name}
                >
                  {recipeItem.imageFilename && (
                    <img
                      src={recipeItem.imageFilename || "/placeholder.svg"}
                      alt={recipeItem.name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="text-xs text-[#eae1d1]">{recipeItem.name}</span>
                  <span className="text-xs text-[#eae1d1]/60">×{recipeItem.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {recycleItems.length > 0 && (
          <div className="space-y-1">
            <p className="text-xs text-[#eae1d1]/70 font-semibold">Recycles to:</p>
            <div className="flex flex-wrap gap-2">
              {recycleItems.map((recycleItem) => (
                <div
                  key={recycleItem.id}
                  className="flex items-center gap-1.5 bg-[#120817]/30 rounded px-2 py-1"
                  title={recycleItem.name}
                >
                  {recycleItem.imageFilename && (
                    <img
                      src={recycleItem.imageFilename || "/placeholder.svg"}
                      alt={recycleItem.name}
                      className="w-6 h-6 object-contain"
                    />
                  )}
                  <span className="text-xs text-[#eae1d1]">{recycleItem.name}</span>
                  <span className="text-xs text-[#eae1d1]/60">×{recycleItem.quantity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <button
        onClick={handleAddToList}
        className={`absolute bottom-3 right-3 w-8 h-8 rounded-full transition-all flex items-center justify-center shadow-lg ${
          inList ? "bg-[#3ba578]/50 cursor-default" : "bg-[#3ba578] hover:bg-[#3ba578]/80"
        }`}
        aria-label={inList ? "Already in shopping list" : "Add to shopping list"}
        disabled={inList}
      >
        {inList ? <Check className="w-5 h-5 text-white" /> : <Plus className="w-5 h-5 text-white" />}
      </button>
    </div>
  )
}
