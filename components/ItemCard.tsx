import { getLocalizedText, type Item } from "@/lib/items"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const imageSrc = item.imageFilename || null

  const name = getLocalizedText(item.name)
  const category = getLocalizedText(item.category)
  const rarity = getLocalizedText(item.rarity)
  const description = getLocalizedText(item.description)

  const getBorderColor = () => {
    const rarityLower = rarity.toLowerCase()
    if (rarityLower === "common") return "border-[#3ba578]"
    if (rarityLower === "rare") return "border-[#4fa7da]"
    if (rarityLower === "epic") return "border-[#c850a9]"
    if (rarityLower === "legendary") return "border-[#ffae00]"
    return "border-white/10" // Uncommon default
  }

  return (
    <div
      className={`bg-[#eae1d1]/5 rounded-tl-3xl rounded-br-3xl overflow-hidden border-2 ${getBorderColor()} hover:opacity-90 transition-opacity`}
    >
      {/* Image */}
      {imageSrc ? (
        <div className="aspect-square bg-[#120817]/50 flex items-center justify-center p-4">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={name || "Item"}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      ) : (
        <div className="aspect-square bg-[#120817]/50 flex items-center justify-center">
          <span className="text-[#eae1d1]/30 text-sm">No image</span>
        </div>
      )}

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-extrabold text-lg leading-tight">{name || "Unknown Item"}</h3>

        {category && <p className="text-sm text-[#eae1d1]/70">Category: {category}</p>}

        {rarity && <p className="text-sm text-[#eae1d1]/70">Rarity: {rarity}</p>}

        {description && <p className="text-sm text-[#eae1d1]/60 line-clamp-3">{description}</p>}
      </div>
    </div>
  )
}
