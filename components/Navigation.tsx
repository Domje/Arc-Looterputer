"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ShoppingBag, Search, Home } from "lucide-react"
import Image from "next/image"

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#120817]/90 backdrop-blur border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="https://arc-ive.net/arcraiderstext.svg"
              alt="Arc Raiders Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
            <h1 className="text-xl font-bold text-[#eae1d1]">Looter Shooter Puter'</h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                pathname === "/" ? "bg-[#3ba578] text-white" : "bg-[#eae1d1]/10 text-[#eae1d1] hover:bg-[#eae1d1]/20"
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Search</span>
            </Link>
            <Link
              href="/hideout"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                pathname === "/hideout"
                  ? "bg-[#3ba578] text-white"
                  : "bg-[#eae1d1]/10 text-[#eae1d1] hover:bg-[#eae1d1]/20"
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">HIDEOUT</span>
            </Link>
            <Link
              href="/shopping-list"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                pathname === "/shopping-list"
                  ? "bg-[#3ba578] text-white"
                  : "bg-[#eae1d1]/10 text-[#eae1d1] hover:bg-[#eae1d1]/20"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">SHOPPING</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
