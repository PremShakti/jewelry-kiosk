"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { products, type Product } from "@/lib/db";

const celebrityImages = [
	"/celebrity-wearing-elegant-jewelry.jpg",
	"/celebrity-in-gold-jewelry.jpg",
	"/celebrity-with-diamond-necklace.jpg",
	"/celebrity-wearing-luxury-earrings.jpg",
];

interface UserPreference {
	question: string;
	answer: string;
}

interface AiRecommendation {
	vibe: string;
	matchedCelebrity: string;
	styleProfile: UserPreference[];
}

export default function RecommendationsPage() {
	const router = useRouter();
	const [userPreferences, setUserPreferences] = useState<UserPreference[] | null>(null);
	const [aiRecommendation, setAiRecommendation] = useState<AiRecommendation | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const storedPreferences = localStorage.getItem("userStylePreferences");

		if (!storedPreferences) {
			// Redirect to home page if no preferences found
			router.push("/");
			return;
		}

		try {
			const preferences = JSON.parse(storedPreferences);
			setUserPreferences(preferences);

			// Call AI recommendation API
			fetchAiRecommendation(preferences);
		} catch (error) {
			console.error("Error parsing user preferences:", error);
			router.push("/");
		}
	}, [router]);

	const fetchAiRecommendation = async (preferences: UserPreference[]) => {
		console.log("Fetching---", preferences);
		try {
			setLoading(true);
			const response = await fetch("/api/airecommendation", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					userPreferences: preferences,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to fetch AI recommendation");
			}

			const result = await response.json();
			console.log("AI Recommendation Response:", result);
			setAiRecommendation(result.data);
		} catch (error) {
			console.error("Error fetching AI recommendation:", error);
		} finally {
			setLoading(false);
		}
	};

	// Helper function to check if product price is within budget range
	const isPriceInBudgetRange = (productPrice: string, budgetRange: string): boolean => {
		// Extract numeric value from product price (remove ₹ and commas)
		const price = parseInt(productPrice.replace(/[₹,]/g, ''));
		
		switch (budgetRange) {
			case "₹5k–₹15k":
				return price >= 5000 && price <= 15000;
			case "₹15k–₹30k":
				return price >= 15000 && price <= 30000;
			case "₹30k+":
				return price >= 30000;
			case "Flexible":
				return true; // Show all products for flexible budget
			default:
				return true;
		}
	};

	// Get user's budget range from preferences
	const budgetRange = userPreferences?.find(pref => 
		pref.question === "Your budget range?"
	)?.answer || "Flexible";

	// Filter products based on AI recommendation vibe AND budget range
	const filteredProducts: Product[] = products.filter((product: Product) => {
		const vibeMatch = product.vibe === aiRecommendation?.vibe?.toLowerCase();
		const budgetMatch = isPriceInBudgetRange(product.price, budgetRange);
		return vibeMatch && budgetMatch;
	});

	// If no products match both criteria, show products that match budget only (within any vibe)
	const budgetOnlyProducts: Product[] = products.filter((product: Product) => 
		isPriceInBudgetRange(product.price, budgetRange)
	);

	// Final fallback to all products only if budget is "Flexible"
	const displayProducts: Product[] = filteredProducts.length > 0 ? filteredProducts : 
		(budgetRange === "Flexible" ? products : budgetOnlyProducts);

	// Show loading while checking localStorage or fetching AI data
	if (!userPreferences || loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#D4AF37] mx-auto"></div>
					<p className="mt-4 text-lg text-[#2C2C2C]">
						Getting your personalized recommendations...
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen shimmer-bg">
			{/* Header */}
			<div className="sticky top-0 z-10 glass-effect border-b border-white/30">
				<div className="container mx-auto px-4 py-6">
					<h1 className="font-serif text-3xl md:text-4xl font-bold text-[#2C2C2C] text-center">
						💎 Evol Jewels
					</h1>
				</div>
			</div>

			<div className="container mx-auto px-4 py-8 md:py-12 space-y-12">
				{/* Style Match Section */}
				<div className="text-center space-y-6 animate-fade-in">
					<h2 className="font-serif text-3xl md:text-5xl font-bold text-[#2C2C2C]">
						Your style matches{" "}
						<span className="text-[#D4AF37]">
							{aiRecommendation?.matchedCelebrity || "Zendaya"}
						</span>{" "}
						with a{" "}
						<span className="text-[#D4AF37]">
							{aiRecommendation?.vibe || "elegant"}
						</span>{" "}
						vibe 💫
					</h2>
					<p className="text-lg md:text-xl text-[#2C2C2C]/70 max-w-2xl mx-auto">
						Based on your preferences, we've curated a collection inspired by
						celebrity elegance
					</p>
				</div>

				{/* Celebrity Style Carousel */}
				{/* <div className="space-y-4">
					<h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#2C2C2C] text-center">
						Celebrity Style Inspiration
					</h3>
					<div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
						{celebrityImages.map((image, index) => (
							<div
								key={index}
								className="flex-shrink-0 snap-center animate-fade-in"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<Card className="overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105">
									<img
										src={image || "/placeholder.svg"}
										alt={`Celebrity style ${index + 1}`}
										className="w-64 h-80 md:w-80 md:h-96 object-cover"
									/>
								</Card>
							</div>
						))}
					</div>
				</div> */}

				{/* Recommended Products */}
				<div className="space-y-8">
					<h3 className="font-serif text-2xl md:text-3xl font-semibold text-[#2C2C2C] text-center">
						Recommended For You ({aiRecommendation?.vibe || 'All'} Style • {budgetRange})
					</h3>
					{filteredProducts.length === 0 && budgetRange !== "Flexible" && (
						<p className="text-center text-[#2C2C2C]/70 text-sm">
							Showing products within your {budgetRange} budget (vibe filter expanded)
						</p>
					)}
					{filteredProducts.length === 0 && budgetRange === "Flexible" && (
						<p className="text-center text-[#2C2C2C]/70 text-sm">
							Showing all products (flexible budget)
						</p>
					)}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{displayProducts.map((product, index) => (
							<Card
								key={product.id}
								className="group overflow-hidden glass-effect shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in"
								style={{ animationDelay: `${index * 100}ms` }}
							>
								<div className="relative overflow-hidden">
									<img
										src={product.image || "/placeholder.svg"}
										alt={product.name}
										className="w-full h-64 md:h-80 object-cover group-hover:scale-110 transition-transform duration-500"
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
								</div>
								<div className="p-6 space-y-4">
									<div>
										<h4 className="font-serif text-xl md:text-2xl font-semibold text-[#2C2C2C] mb-2">
											{product.name}
										</h4>
										<p className="text-sm text-[#2C2C2C]/60 mb-3">
											{product.description}
										</p>
										<p className="text-2xl font-bold text-[#D4AF37]">
											{product.price}
										</p>
									</div>
									<Button
										onClick={() => router.push(`/product/${product.id}`)}
										className="w-full py-6 text-lg rounded-xl bg-[#D4AF37] hover:bg-[#C19B2E] text-white shadow-lg hover:shadow-xl transition-all duration-300"
									>
										View Details
									</Button>
								</div>
							</Card>
						))}
					</div>
				</div>

				{/* Back Button */}
				<div className="flex justify-center pt-8">
					<Button
						onClick={() => router.push("/")}
						variant="outline"
						size="lg"
						className="px-8 py-6 text-lg rounded-full border-2 border-[#D4AF37] text-[#2C2C2C] hover:bg-[#D4AF37] hover:text-white transition-all duration-300"
					>
						← Start New Survey
					</Button>
				</div>
			</div>
		</div>
	);
}
