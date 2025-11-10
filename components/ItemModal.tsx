"use client"

import { getLocalizedText, type Item } from "@/lib/items"
import itemsData from "@/data/items.json"
import { X } from "lucide-react"

interface ItemModalProps {
  item: Item
  isOpen: boolean
  onClose: () => void
}

export function ItemModal({ item, isOpen, onClose }: ItemModalProps) {
  if (!isOpen) return null

  const name = getLocalizedText(item.name)
  const category = getLocalizedText(item.category)
  const rarity = getLocalizedText(item.rarity)
  const description = getLocalizedText(item.description)

  const getRarityColor = () => {
    const rarityLower = rarity.toLowerCase()
    if (rarityLower === "common") return "text-[#3ba578]"
    if (rarityLower === "rare") return "text-[#4fa7da]"
    if (rarityLower === "epic") return "text-[#c850a9]"
    if (rarityLower === "legendary") return "text-[#ffae00]"
    return "text-[#eae1d1]"
  }

  const hasRecycleChain = item.recyclesInto && Object.keys(item.recyclesInto).length > 0
  const hasCraftRecipe = item.recipe && Object.keys(item.recipe).length > 0
  const hasUpgradeCost = item.upgradeCost && Object.keys(item.upgradeCost).length > 0

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50" onClick={onClose} aria-hidden="true" />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          className="bg-[#120817] border-2 border-[#eae1d1]/20 rounded-tl-3xl rounded-br-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#eae1d1]/60 hover:text-[#eae1d1] transition-colors"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Content */}
          <div className="p-8">
            {/* Header section */}
            <div className="flex items-start gap-6 mb-8">
              {/* Item image */}
              {item.imageFilename && (
                <div className="w-32 h-32 bg-[#120817]/50 rounded-lg border border-[#eae1d1]/10 flex items-center justify-center p-4 flex-shrink-0">
                  <img
                    src={item.imageFilename || "/placeholder.svg"}
                    alt={name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              )}

              {/* Item info */}
              <div className="flex-1">
                <h2 className="text-3xl font-extrabold text-[#eae1d1] mb-2">{name}</h2>
                <div className="flex items-center gap-4 mb-3">
                  {rarity && <span className={`${getRarityColor()} font-bold uppercase text-sm`}>{rarity}</span>}
                  {category && <span className="text-[#eae1d1]/60 text-sm">{category}</span>}
                </div>
                {description && <p className="text-[#eae1d1]/80 text-sm leading-relaxed">{description}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Craftable with section */}
              {hasCraftRecipe && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#eae1d1] mb-4">Craftable with:</h3>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(item.recipe!).map(([itemId, quantity]) => {
                      const recipeItem = itemsData.find((i) => i.id === itemId)
                      if (!recipeItem) return null
                      const recipeName = getLocalizedText(recipeItem.name)

                      return (
                        <div key={itemId} className="flex flex-col items-center gap-2 min-w-[80px]">
                          <div className="w-16 h-16 bg-[#120817]/50 rounded-lg border border-[#eae1d1]/10 flex items-center justify-center p-2">
                            <img
                              src={recipeItem.imageFilename || "/placeholder.svg"}
                              alt={recipeName}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-[#eae1d1]/80">{recipeName}</p>
                            <p className="text-xs text-[#eae1d1]/60">×{quantity}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {hasUpgradeCost && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#eae1d1] mb-4">Upgrade with:</h3>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(item.upgradeCost!).map(([itemId, quantity]) => {
                      const upgradeItem = itemsData.find((i) => i.id === itemId)
                      if (!upgradeItem) return null
                      const upgradeName = getLocalizedText(upgradeItem.name)

                      return (
                        <div key={itemId} className="flex flex-col items-center gap-2 min-w-[80px]">
                          <div className="w-16 h-16 bg-[#120817]/50 rounded-lg border border-[#eae1d1]/10 flex items-center justify-center p-2">
                            <img
                              src={upgradeItem.imageFilename || "/placeholder.svg"}
                              alt={upgradeName}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-[#eae1d1]/80">{upgradeName}</p>
                            <p className="text-xs text-[#eae1d1]/60">×{quantity}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Recycles to section */}
              {hasRecycleChain && (
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-[#eae1d1] mb-4">Recycles to:</h3>
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(item.recyclesInto!).map(([itemId, quantity]) => {
                      const recycleItem = itemsData.find((i) => i.id === itemId)
                      if (!recycleItem) return null
                      const recycleName = getLocalizedText(recycleItem.name)

                      return (
                        <div key={itemId} className="flex flex-col items-center gap-2 min-w-[80px]">
                          <div className="w-16 h-16 bg-[#120817]/50 rounded-lg border border-[#eae1d1]/10 flex items-center justify-center p-2">
                            <img
                              src={recycleItem.imageFilename || "/placeholder.svg"}
                              alt={recycleName}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-[#eae1d1]/80">{recycleName}</p>
                            <p className="text-xs text-[#eae1d1]/60">×{quantity}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {!hasCraftRecipe && !hasRecycleChain && !hasUpgradeCost && (
              <div className="text-center py-8 text-[#eae1d1]/40">
                This item has no crafting recipe, upgrade cost, or recycle data.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
