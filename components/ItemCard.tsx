import type { Item } from "@/lib/items"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const imageSrc = item.image ? (item.image.startsWith("/") ? item.image : `/images/items/${item.image}`) : null

  return (
    <div className="bg-[#eae1d1]/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/20 transition-colors">
      {/* Image */}
      {imageSrc ? (
        <div className="aspect-square bg-[#120817]/50 flex items-center justify-center p-4">
          <img
            src={imageSrc || "/placeholder.svg"}
            alt={item.name || "Item"}
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
        <h3 className="font-extrabold text-lg leading-tight">{item.name || "Unknown Item"}</h3>

        {item.category && <p className="text-sm text-[#eae1d1]/70">Category: {item.category}</p>}

        {item.rarity && <p className="text-sm text-[#eae1d1]/70">Rarity: {item.rarity}</p>}

        {item.description && <p className="text-sm text-[#eae1d1]/60 line-clamp-3">{item.description}</p>}
      </div>
    </div>
  )
}
