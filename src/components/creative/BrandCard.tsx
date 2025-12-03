"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brand } from "@/types/creative"
import { cn } from "@/lib/utils"
import { mockTickets } from "@/lib/mock-data/creative"

interface BrandCardProps {
  brand: Brand
  className?: string
}

export function BrandCard({ brand, className }: BrandCardProps) {
  // Count active tickets for this brand
  const activeTicketCount = mockTickets.filter(
    (t) => t.brandId === brand.id && t.status !== "delivered"
  ).length

  // Get primary and secondary colors
  const primaryColor = brand.colors.find((c) => c.type === "primary")
  const secondaryColor = brand.colors.find((c) => c.type === "secondary")
  const accentColor = brand.colors.find((c) => c.type === "accent")

  return (
    <Link href={`/creative/brands/${brand.id}`} className={cn("block", className)}>
      <Card className="group relative overflow-hidden transition-all hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
        {/* Color Bar */}
        <div className="h-2 flex">
          {primaryColor && (
            <div className="flex-1" style={{ backgroundColor: primaryColor.hex }} />
          )}
          {secondaryColor && (
            <div className="flex-1" style={{ backgroundColor: secondaryColor.hex }} />
          )}
          {accentColor && (
            <div className="flex-1" style={{ backgroundColor: accentColor.hex }} />
          )}
        </div>

        <CardContent className="p-5">
          {/* Brand Name & Logo Placeholder */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-3">
              {/* Logo placeholder - circle with primary color */}
              <div
                className="h-12 w-12 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm"
                style={{ backgroundColor: primaryColor?.hex || "#666" }}
              >
                {brand.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                  {brand.name}
                </h3>
                {activeTicketCount > 0 && (
                  <Badge variant="secondary" className="text-xs mt-1">
                    {activeTicketCount} active ticket{activeTicketCount !== 1 ? "s" : ""}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {brand.description}
          </p>

          {/* Color Palette Preview */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs text-muted-foreground">Colors:</span>
            <div className="flex gap-1">
              {brand.colors.slice(0, 5).map((color) => (
                <div
                  key={color.id}
                  className="h-5 w-5 rounded-full border border-border shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Personality Tags */}
          {brand.personality.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {brand.personality.slice(0, 3).map((trait, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {trait}
                </Badge>
              ))}
              {brand.personality.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{brand.personality.length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

