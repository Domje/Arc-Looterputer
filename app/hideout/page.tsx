"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/Navigation"
import { getLocalizedText } from "@/lib/items"
import itemsData from "@/data/items.json"
import hideoutData from "@/data/hideoutModules.json"
import { Plus, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import { addToShoppingList } from "@/lib/shopping-list"

interface HideoutModule {
  id: string
  name: { en: string }
  maxLevel: number
  levels: Array<{
    level: number
    requirementItemIds: Array<{ itemId: string; quantity: number }>
    otherRequirements?: string[]
    description?: string
  }>
}

export default function HideoutPage() {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [selectedCraftItem, setSelectedCraftItem] = useState<any>(null)

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  // Get items that can be crafted at each station
  const craftableItems = useMemo(() => {
    const craftables: Record<string, any[]> = {}
    itemsData.forEach((item: any) => {
      if (item.craftBench) {
        const benches = Array.isArray(item.craftBench) ? item.craftBench : [item.craftBench]
        benches.forEach((bench: string) => {
          if (!craftables[bench]) craftables[bench] = []
          craftables[bench].push(item)
        })
      }
    })
    return craftables
  }, [])

  const getItemById = (itemId: string) => {
    return itemsData.find((item: any) => item.id === itemId)
  }

  const handleAddUpgradeToShoppingList = (module: HideoutModule, level: number) => {
    const levelData = module.levels.find((l) => l.level === level)
    if (!levelData) return

    levelData.requirementItemIds.forEach(({ itemId, quantity }) => {
      const item = getItemById(itemId)
      if (item) {
        addToShoppingList(item)
      }
    })

    alert(`Added all items for ${getLocalizedText(module.name)} Level ${level} to shopping list!`)
  }

  const handleAddCraftRecipeToShoppingList = (item: any) => {
    if (!item.recipe) return

    Object.entries(item.recipe).forEach(([itemId, quantity]) => {
      const recipeItem = getItemById(itemId)
      if (recipeItem) {
        addToShoppingList(recipeItem)
      }
    })

    alert(`Added all crafting materials for ${getLocalizedText(item.name)} to shopping list!`)
  }

  return (
    <div className="min-h-screen bg-[#120817]">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-[#eae1d1] mb-6">HIDEOUT</h1>

        <div className="space-y-4">
          {hideoutData.map((module: HideoutModule) => (
            <div
              key={module.id}
              className="bg-[#1a0f21] border border-white/10 rounded-tl-3xl rounded-br-3xl overflow-hidden"
            >
              {/* Module Header */}
              <button
                onClick={() => toggleModule(module.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-3 flex-1">
                  <div>
                    <h2 className="text-xl font-bold text-[#eae1d1] text-left">{getLocalizedText(module.name)}</h2>
                    <p className="text-sm text-[#eae1d1]/60">
                      {module.maxLevel > 0 ? `Max Level: ${module.maxLevel}` : "Always Available"}
                    </p>
                  </div>

                  {expandedModules.has(module.id) && module.levels.length > 0 && (
                    <div className="flex gap-1 ml-6 flex-wrap">
                      {module.levels.map((level) => (
                        <div key={level.level} className="bg-[#120817] p-1.5 rounded-lg flex-shrink-0">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="flex-shrink-0 w-10 h-10 bg-white/10 rounded flex items-center justify-center">
                              <span className="text-xl font-bold text-[#eae1d1]">L{level.level}</span>
                            </div>
                            {level.requirementItemIds.length > 0 && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleAddUpgradeToShoppingList(module, level.level)
                                }}
                                className="flex items-center justify-center w-6 h-6 rounded-full bg-[#3ba578] hover:bg-[#2d8a5f] text-white transition-colors flex-shrink-0"
                                title="Add all items to shopping list"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                          {level.otherRequirements && level.otherRequirements.length > 0 && (
                            <div className="mb-1">
                              {level.otherRequirements.map((req, idx) => {
                                const coinsMatch = req.match(/Coins:\s*(\d+)/)
                                if (coinsMatch) {
                                  const amount = Number.parseInt(coinsMatch[1])
                                  return (
                                    <div key={idx} className="flex items-center gap-0.5 text-xs text-[#ffae00]">
                                      <Image
                                        src="/images/raidertoken.webp"
                                        alt="Raider Token"
                                        width={12}
                                        height={12}
                                        className="inline-block"
                                      />
                                      <span className="text-[10px]">{amount.toLocaleString()}</span>
                                    </div>
                                  )
                                }
                                return (
                                  <p key={idx} className="text-[10px] text-[#ffae00]">
                                    {req}
                                  </p>
                                )
                              })}
                            </div>
                          )}
                          {level.requirementItemIds.length > 0 ? (
                            <div className="flex flex-wrap gap-0.5">
                              {level.requirementItemIds.map(({ itemId, quantity }) => {
                                const item = getItemById(itemId)
                                if (!item) return null
                                return (
                                  <div
                                    key={itemId}
                                    className="relative group flex items-center gap-0.5 bg-white/5 px-0.5 py-0.5 rounded"
                                    title={getLocalizedText(item.name)}
                                  >
                                    {item.imageFilename && (
                                      <Image
                                        src={item.imageFilename || "/placeholder.svg"}
                                        alt={getLocalizedText(item.name)}
                                        width={16}
                                        height={16}
                                        className="rounded"
                                      />
                                    )}
                                    <span className="text-[10px] text-[#eae1d1]/80">x{quantity}</span>
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 bg-black/90 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">
                                      {getLocalizedText(item.name)}
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          ) : (
                            <p className="text-[10px] text-[#eae1d1]/60">No requirements</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {expandedModules.has(module.id) ? (
                  <ChevronUp className="w-5 h-5 text-[#eae1d1]" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-[#eae1d1]" />
                )}
              </button>

              {/* Module Content */}
              {expandedModules.has(module.id) && (
                <div className="border-t border-white/10">
                  {/* Craftable Items */}
                  {craftableItems[module.id] && craftableItems[module.id].length > 0 && (
                    <div className="p-4">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {craftableItems[module.id].map((item: any) => (
                          <button
                            key={item.id}
                            onClick={() => setSelectedCraftItem(item)}
                            className="bg-[#120817] hover:bg-white/5 p-3 rounded-lg transition-colors text-left"
                          >
                            <div className="flex flex-col items-center gap-2">
                              {item.imageFilename && (
                                <Image
                                  src={item.imageFilename || "/placeholder.svg"}
                                  alt={getLocalizedText(item.name)}
                                  width={48}
                                  height={48}
                                  className="rounded"
                                />
                              )}
                              <span className="text-sm text-[#eae1d1] text-center line-clamp-2">
                                {getLocalizedText(item.name)}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {!craftableItems[module.id]?.length && (
                    <div className="p-4 text-center text-[#eae1d1]/60">No data available for this station</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>

      {/* Craft Item Modal */}
      {selectedCraftItem && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCraftItem(null)}
        >
          <div
            className="bg-[#1a0f21] border-2 border-white/20 rounded-tl-3xl rounded-br-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {selectedCraftItem.imageFilename && (
                  <Image
                    src={selectedCraftItem.imageFilename || "/placeholder.svg"}
                    alt={getLocalizedText(selectedCraftItem.name)}
                    width={64}
                    height={64}
                    className="rounded"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold text-[#eae1d1]">{getLocalizedText(selectedCraftItem.name)}</h2>
                  {selectedCraftItem.category && (
                    <p className="text-sm text-[#eae1d1]/60">{getLocalizedText(selectedCraftItem.category)}</p>
                  )}
                </div>
              </div>
              <button onClick={() => setSelectedCraftItem(null)} className="text-[#eae1d1] hover:text-white text-2xl">
                ×
              </button>
            </div>

            {selectedCraftItem.description && (
              <p className="text-sm text-[#eae1d1]/80 mb-4">{getLocalizedText(selectedCraftItem.description)}</p>
            )}

            {selectedCraftItem.recipe && (
              <div className="bg-[#120817] p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[#eae1d1]">Crafting Recipe</h3>
                  <button
                    onClick={() => handleAddCraftRecipeToShoppingList(selectedCraftItem)}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-[#3ba578] hover:bg-[#2d8a5f] text-white transition-colors"
                    title="Add all items to shopping list"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <div className="space-y-2">
                  {Object.entries(selectedCraftItem.recipe).map(([itemId, quantity]: [string, any]) => {
                    const recipeItem = getItemById(itemId)
                    if (!recipeItem) return null
                    return (
                      <div key={itemId} className="flex items-center gap-3 bg-white/5 p-2 rounded">
                        {recipeItem.imageFilename && (
                          <Image
                            src={recipeItem.imageFilename || "/placeholder.svg"}
                            alt={getLocalizedText(recipeItem.name)}
                            width={32}
                            height={32}
                            className="rounded"
                          />
                        )}
                        <span className="text-[#eae1d1] flex-1">{getLocalizedText(recipeItem.name)}</span>
                        <span className="text-[#eae1d1]/60">x{quantity}</span>
                        <button
                          onClick={() => addToShoppingList(recipeItem)}
                          className="p-1 bg-[#3ba578] hover:bg-[#2d8a5f] text-white rounded transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
