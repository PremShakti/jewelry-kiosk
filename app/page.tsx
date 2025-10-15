"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const questions = [
	{
		id: 1,
		question: "What's your jewelry style?",
		options: ["Minimal", "Bold", "Traditional", "Modern"],
	},
	{
		id: 2,
		question: "What occasion are you shopping for?",
		options: ["Wedding", "Party", "Daily Wear", "Special Gift"],
	},
	{
		id: 3,
		question: "Your budget range?",
		options: ["₹5k–₹15k", "₹15k–₹30k", "₹30k+", "Flexible"],
	},
];

export default function WelcomePage() {
	const [currentQuestion, setCurrentQuestion] = useState(0);
	const [answers, setAnswers] = useState<string[]>([]);
	const [showWelcome, setShowWelcome] = useState(true);
	const router = useRouter();

	const handleAnswer = (answer: string) => {
		const newAnswers = [...answers, answer];
		setAnswers(newAnswers);

		if (currentQuestion < questions.length - 1) {
			setTimeout(() => {
				setCurrentQuestion(currentQuestion + 1);
			}, 300);
		}
	};

	const handleStart = () => {
		setShowWelcome(false);
	};

	const handleViewRecommendations = () => {
		// Console log all questions with their chosen answers in JSON format
		const userPreferences = questions.map((question, index) => ({
			question: question.question,
			answer: answers[index],
		}));

		console.log("User's Style Preferences:", JSON.stringify(userPreferences, null, 2));

		// Store user preferences in localStorage
		localStorage.setItem('userStylePreferences', JSON.stringify(userPreferences));

		router.push("/recommendations");
	};

	if (showWelcome) {
		return (
			<div className="min-h-screen mirror-gradient flex flex-col items-center justify-center p-8">
				<div className="text-center space-y-8 animate-fade-in">
					<h1 className="font-serif text-6xl md:text-8xl font-bold text-[#2C2C2C] tracking-tight">
						💎 Evol Jewels
					</h1>
					<p className="text-xl md:text-2xl text-[#2C2C2C]/80 font-light max-w-2xl mx-auto">
						Discover jewelry that matches your unique style
					</p>
					<Button
						onClick={handleStart}
						size="lg"
						className="mt-8 px-12 py-8 text-xl rounded-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-105"
					>
						Start Your Style Journey ✨
					</Button>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen mirror-gradient flex flex-col items-center justify-center p-4 md:p-8">
			<div className="w-full max-w-3xl space-y-8">
				{/* Logo */}
				<div className="text-center mb-12">
					<h1 className="font-serif text-4xl md:text-5xl font-bold text-[#2C2C2C]">
						💎 Evol Jewels
					</h1>
				</div>

				{/* Progress indicator */}
				<div className="flex gap-2 justify-center mb-8">
					{questions.map((_, index) => (
						<div
							key={index}
							className={`h-2 rounded-full transition-all duration-300 ${
								index <= currentQuestion
									? "w-12 bg-[#D4AF37]"
									: "w-8 bg-white/50"
							}`}
						/>
					))}
				</div>

				{/* Chat-style survey */}
				<div className="space-y-6 animate-fade-in">
					{questions
						.slice(0, currentQuestion + 1)
						.map((q, index) => (
							<div key={q.id} className="space-y-4 animate-slide-up">
								{/* Question bubble */}
								<div className="flex justify-start">
									<Card className="glass-effect px-6 py-4 rounded-3xl rounded-tl-sm max-w-md shadow-lg">
										<p className="text-lg md:text-xl font-medium text-[#2C2C2C]">
											{q.question}
										</p>
									</Card>
								</div>

								{/* Answer options */}
								{index === currentQuestion && (
									<div className="flex justify-end">
										<div className="grid grid-cols-2 gap-3 max-w-md w-full">
											{q.options.map((option) => (
												<Button
													key={option}
													onClick={() => handleAnswer(option)}
													className="h-auto py-4 px-6 text-base md:text-lg rounded-2xl bg-white hover:bg-[#F7CBAA] text-[#2C2C2C] shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-[#F7CBAA]/30"
													variant="outline"
												>
													{option}
												</Button>
											))}
										</div>
									</div>
								)}

								{/* Selected answer display */}
								{index < currentQuestion && answers[index] && (
									<div className="flex justify-end animate-fade-in">
										<Card className="bg-[#D4AF37] text-white px-6 py-3 rounded-3xl rounded-tr-sm shadow-lg">
											<p className="text-lg font-medium">
												{answers[index]}
											</p>
										</Card>
									</div>
								)}
							</div>
						))}

					{/* Final CTA */}
					{answers.length === questions.length && (
						<div className="flex justify-center pt-8 animate-fade-in">
							<Button
								onClick={handleViewRecommendations}
								size="lg"
								className="px-10 py-6 text-xl rounded-full bg-[#D4AF37] hover:bg-[#C19B2E] text-white shadow-2xl hover:shadow-[#D4AF37]/50 transition-all duration-300 hover:scale-105"
							>
								View My Style Match ✨
							</Button>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
