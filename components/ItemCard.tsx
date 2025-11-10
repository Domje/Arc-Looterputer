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

  return (
    <div className="bg-[#eae1d1]/5 rounded-tl-3xl rounded-br-3xl overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
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
