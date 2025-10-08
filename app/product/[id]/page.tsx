"use client"

import { useRouter, useParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const products = [
  {
    id: 1,
    name: "Elegant Gold Earrings",
    price: "₹12,999",
    image: "/elegant-gold-earrings-jewelry-close-up.jpg",
    description:
      "A handcrafted 22K gold earring inspired by celebrity fashion. These stunning earrings feature intricate detailing and a timeless design that complements any outfit. Perfect for special occasions or adding a touch of elegance to your everyday look.",
    details: [
      "Material: 22K Gold",
      "Weight: 8.5 grams",
      "Design: Traditional with modern twist",
      "Occasion: Weddings, Parties, Festivals",
    ],
  },
  {
    id: 2,
    name: "Diamond Necklace",
    price: "₹45,000",
    image: "/diamond-necklace-luxury-jewelry-close-up.jpg",
    description:
      "An exquisite diamond necklace that radiates sophistication and luxury. Featuring premium quality diamonds set in 18K gold, this piece is designed to make a statement at any grand occasion.",
    details: [
      "Material: 18K Gold with Diamonds",
      "Diamond Quality: VVS",
      "Total Carats: 2.5",
      "Occasion: Weddings, Galas, Special Events",
    ],
  },
  {
    id: 3,
    name: "Royal Bracelet",
    price: "₹22,500",
    image: "/royal-gold-bracelet-jewelry-close-up.jpg",
    description:
      "A regal gold bracelet that embodies royal elegance. Crafted with precision and adorned with intricate patterns, this bracelet is perfect for those who appreciate fine jewelry.",
    details: [
      "Material: 22K Gold",
      "Weight: 15 grams",
      "Design: Royal traditional pattern",
      "Occasion: Weddings, Festivals, Celebrations",
    ],
  },
  {
    id: 4,
    name: "Pearl Drop Earrings",
    price: "₹18,999",
    image: "/pearl-drop-earrings-luxury-close-up.jpg",
    description:
      "Classic pearl drop earrings that exude timeless elegance. Featuring lustrous pearls suspended from delicate gold settings, these earrings are perfect for adding sophistication to any ensemble.",
    details: [
      "Material: 18K Gold with Natural Pearls",
      "Pearl Size: 8mm",
      "Design: Classic drop style",
      "Occasion: Formal events, Parties, Daily wear",
    ],
  },
]

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = Number.parseInt(params.id as string)
  const product = products.find((p) => p.id === productId) || products[0]

  return (
    <div className="min-h-screen shimmer-bg">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-effect border-b border-white/30">
        <div className="container mx-auto px-4 py-6">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2C2C2C] text-center">💎 Evol Jewels</h1>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Product Image */}
            <div className="animate-fade-in">
              <Card className="overflow-hidden shadow-2xl">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-auto object-cover"
                />
              </Card>
            </div>

            {/* Product Details */}
            <div className="space-y-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
              <div>
                <h2 className="font-serif text-3xl md:text-5xl font-bold text-[#2C2C2C] mb-4">{product.name}</h2>
                <p className="text-3xl md:text-4xl font-bold text-[#D4AF37] mb-6">{product.price}</p>
              </div>

              <Card className="glass-effect p-6 space-y-4">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#2C2C2C]">Description</h3>
                <p className="text-base md:text-lg text-[#2C2C2C]/80 leading-relaxed">{product.description}</p>
              </Card>

              <Card className="glass-effect p-6 space-y-4">
                <h3 className="font-serif text-xl md:text-2xl font-semibold text-[#2C2C2C]">Product Details</h3>
                <ul className="space-y-3">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-3 text-base md:text-lg text-[#2C2C2C]/80">
                      <span className="text-[#D4AF37] mt-1">✦</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </Card>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Button
                  onClick={() => router.push("/recommendations")}
                  variant="outline"
                  size="lg"
                  className="flex-1 py-6 text-lg rounded-xl border-2 border-[#D4AF37] text-[#2C2C2C] hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
                >
                  ← Back to Recommendations
                </Button>
                <Button
                  size="lg"
                  className="flex-1 py-6 text-lg rounded-xl bg-[#D4AF37] hover:bg-[#C19B2E] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Inquire Now
                </Button>
              </div>
            </div>
          </div>

          {/* Related Products Section */}
          <div className="mt-16 space-y-8">
            <h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#2C2C2C] text-center">
              You May Also Like
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products
                .filter((p) => p.id !== productId)
                .slice(0, 3)
                .map((relatedProduct, index) => (
                  <Card
                    key={relatedProduct.id}
                    className="group overflow-hidden glass-effect shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => router.push(`/product/${relatedProduct.id}`)}
                  >
                    <div className="relative overflow-hidden">
                      <img
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="font-serif text-lg md:text-xl font-semibold text-[#2C2C2C] mb-2">
                        {relatedProduct.name}
                      </h4>
                      <p className="text-xl font-bold text-[#D4AF37]">{relatedProduct.price}</p>
                    </div>
                  </Card>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
