"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
// import { Mic } from "lucide-react";

const steps = [
	{
		question: "When you plan a trip in India, what's your biggest frustration?",
		type: "radio",
		options: [
			"Finding authentic, non-touristy places",
			"Too much information online, can't find a reliable source",
			"Worrying about scams or fake reviews",
			"Itineraries are too generic and don't match my style",
			"Juggling multiple apps and websites to plan and book",
			"Other",
		],
	},
	{
		question:
			"On a scale of 1-10, how likely are you to pay for a service that guaranteed you trusted, authentic travel recommendations?",
		type: "slider",
		min: 1,
		max: 10,
		leftLabel: "Not at all (1)",
		rightLabel: "Extremely likely (10)",
	},
	{
		question:
			"What price range would you be most comfortable paying for a service that guaranteed you personalised, trusted, authentic, convenient travel planning?",
		type: "radio",
		options: [
			"₹50 – ₹150/month",
			"₹151 – ₹350/month",
			"₹351 – ₹550/month",
			"Above ₹500/month",
			"I prefer a one time fee",
			"I would not pay for this service",
		],
	},
	{
		question: "What's one thing you wish existed to make your travel planning in India easier?",
		type: "text",
		placeholder: "Share your idea, feature, or tool that would make travel planning easier..."
	},
	{
		question: "Want to stay in the loop? Leave your email below!",
		type: "email",
		placeholder: "isatyamks@email.com"
	}
];

const prompts = [
	"Create a 7-day Paris itinerary",
	"Plan a weekend getaway to Goa",
	"Best temples to visit in Varanasi",
	"Romantic honeymoon in Kerala",
	"Adventure trip to Leh-Ladakh",
	"Family vacation in Rajasthan",
	"Budget backpacking in Himachal",
	"Luxury stay in Mumbai hotels"
];

export default function WaitlistSurvey() {
	const [step, setStep] = useState(0);
	const [selected, setSelected] = useState("");
	const [other, setOther] = useState("");
	const [slider, setSlider] = useState(5);
	const [text, setText] = useState("");
	const [email, setEmail] = useState("");
	const [error, setError] = useState("");
	const [showThanks, setShowThanks] = useState(false);
	const [showWaitlist, setShowWaitlist] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
	const [isTyping, setIsTyping] = useState(false);
	// const [listening, setListening] = useState(false);
	// const recognitionRef = React.useRef<any>(null);
	const router = useRouter();

	React.useEffect(() => {
		if (!inputValue && !isTyping) {
			const interval = setInterval(() => {
				setCurrentPromptIndex((prev: number) => (prev + 1) % prompts.length);
			}, 3000);
			return () => clearInterval(interval);
		}
	}, [inputValue, isTyping]);
	//             const transcript = event.results[0][0].transcript;
	//             setInputValue(transcript);
	//             setListening(false);
	//         };
	//         recognition.onend = () => setListening(false);
	//         recognition.onerror = () => setListening(false);
	//         recognitionRef.current = recognition;
	//     }
	// }, []);

	React.useEffect(() => {
		if (!inputValue && !isTyping) {
			const interval = setInterval(() => {
				setCurrentPromptIndex((prev: number) => (prev + 1) % prompts.length);
			}, 3000);
			return () => clearInterval(interval);
		}
	}, [inputValue, isTyping]);

	// const handleMicClick = (e: React.MouseEvent) => {
	//     e.stopPropagation();
	//     if (listening) {
	//         recognitionRef.current && recognitionRef.current.stop();
	//         setListening(false);
	//     } else {
	//         recognitionRef.current && recognitionRef.current.start();
	//         setListening(true);
	//     }
	// };

	const handlePromptSubmit = (e?: React.FormEvent) => {
		if (e) e.preventDefault();
		// For survey, just set the input as the first answer and go to next step
		setSelected((inputValue ?? prompts[currentPromptIndex]) || "");
		setStep(1);
		setInputValue("");
		setIsTyping(false);
	};

	const handleNext = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setError("");

		// Step 0: Ask for email
		if (step === 0) {
			if (!email || !email.includes("@")) {
				setError("Please enter a valid email address");
				return;
			}
			setStep(1);
			return;
		}
		// Step 1: Ask if user wants to fill survey
		if (step === 1) {
			if (!selected) {
				setError("Please select an option");
				return;
			}
			if (selected === "No") {
				// Store email in backend as waitlist
				try {
					await fetch("https://incubator-set.onrender.com/api/waitlist", {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ email }),
					});
				} catch (err) {
					console.error("Failed to join waitlist:", err);
				}
				setShowWaitlist(true);
				return;
			}
			setStep(2);
			setSelected("");
			return;
		}
		// Step 2+: Survey as before
		if (step === 2 && !selected) {
			setError("Please select an option");
			return;
		}
		if (step === 2 && selected === "Other" && !other.trim()) {
			setError("Please specify your frustration");
			return;
		}
		if (step === 4 && !text.trim()) {
			setError("Please share your idea");
			return;
		}
		if (step === 5) {
			// Submit survey
			const surveyData = {
				step_1: selected === "Other" ? other : selected,
				step_2: slider,
				step_3: selected,
				step_4: text,
				email: email,
			};
			try {
				await fetch("https://incubator-set.onrender.com/api/survey", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(surveyData),
				});
			} catch (err) {
				console.error("Failed to submit survey:", err);
			}
			setShowThanks(true);
			setTimeout(() => {
				router.push("/");
			}, 2000);
			return;
		}
		setStep(step + 1);
		setSelected("");
	};

	const handleBack = () => {
		setStep(step - 1);
		setError("");
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-[#FCFAF8] px-4">
			{showWaitlist ? (
				<div className="flex items-center justify-center">
					<div className="bg-gradient-to-br from-[#37C2C4]/20 via-white to-[#37C2C4]/10 rounded-3xl shadow-2xl p-10 text-center max-w-sm border-2 border-[#37C2C4]">
						<div className="flex justify-center mb-4">
							<span className="inline-block bg-[#37C2C4] rounded-full p-4 shadow-lg">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" className="w-10 h-10 text-white">
									<circle cx="24" cy="24" r="24" fill="#37C2C4" />
									<path d="M16 24l6 6 10-14" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</span>
						</div>
						<h2 className="text-3xl font-extrabold mb-2" style={{ color: '#37C2C4' }}>You have joined the waitlist!</h2>
						<p className="text-lg text-gray-700 mb-2">We'll keep you updated at <span className="font-bold">{email}</span>.</p>
						<p className="text-sm text-gray-500">Thank you for your interest!</p>
					</div>
				</div>
			) : showThanks ? (
				<div className="flex items-center justify-center">
					<div className="bg-gradient-to-br from-[#37C2C4]/20 via-white to-[#37C2C4]/10 rounded-3xl shadow-2xl p-10 text-center max-w-sm border-2 border-[#37C2C4]">
						<div className="flex justify-center mb-4">
							<span className="inline-block bg-[#37C2C4] rounded-full p-4 shadow-lg">
								<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 48 48" className="w-10 h-10 text-white">
									<circle cx="24" cy="24" r="24" fill="#f59e0b" />
									<path d="M16 24l6 6 10-14" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
								</svg>
							</span>
						</div>
						<h2 className="text-3xl font-extrabold mb-2" style={{ color: '#37C2C4' }}>Thank you!</h2>
						<p className="text-lg text-gray-700 mb-2">Your responses have been recorded.</p>
						<p className="text-sm text-gray-500">We appreciate your input and will keep you posted!</p>
					</div>
				</div>
			) : (
				<form
					onSubmit={handleNext}
					className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8"
				>
					<div className="mb-4">
						<div className="text-xs text-gray-500 mb-1">
							{step === 0 ? "Step 1 of 2" : step === 1 ? "Step 2 of 2" : `Question ${step - 1} of 4`}
						</div>
						<div className="w-full bg-gray-200 rounded-full h-2 mb-4">
							<div
								className="bg-[#37C2C4] h-2 rounded-full"
								style={{ width: step === 0 ? "20%" : step === 1 ? "40%" : `${((step - 1) / 4) * 100}%` }}
							></div>
						</div>
						{step === 0 && (
							<>
								<h2 className="text-lg font-semibold mb-6">Enter your email to join the waitlist</h2>
								<input
									type="email"
									className="w-full border rounded px-3 py-2 text-sm mb-4"
									placeholder="you@email.com"
									value={email}
									onChange={e => setEmail(e.target.value)}
									required
								/>
							</>
						)}
						{step === 1 && (
							<>
								<h2 className="text-lg font-semibold mb-6">Would you like to fill out a short survey to help us improve?</h2>
								<div className="flex gap-4">
									<button
										type="button"
										className={`flex-1 py-2 rounded-lg font-semibold transition ${selected === "Yes" ? "bg-[#37C2C4] text-white" : "bg-gray-200 text-gray-700"}`}
										onClick={() => setSelected("Yes")}
									>
										Yes
									</button>
									<button
										type="button"
										className={`flex-1 py-2 rounded-lg font-semibold transition ${selected === "No" ? "bg-[#37C2C4] text-white" : "bg-gray-200 text-gray-700"}`}
										onClick={() => setSelected("No")}
									>
										No
									</button>
								</div>
							</>
						)}
						{step >= 2 && steps[0] && (
							<>
								<h2 className="text-lg font-semibold mb-6">{steps[0].question}</h2>
								<div className="space-y-3">
									{Array.isArray(steps[0].options) &&
										steps[0].options.map((opt) => (
											<label
												key={opt}
												className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selected === opt ? "border-[#37C2C4] bg-[#37C2C4]/10" : "border-gray-200 bg-white"}`}
											>
												<input
													type="radio"
													name="frustration"
													value={opt}
													checked={selected === opt}
													onChange={() => setSelected(opt)}
													className="mt-1 accent-[#37C2C4]"
												/>
												<span className="flex-1 text-gray-800">
													{opt === "Other" ? (
														<>
															Other (e.g., finding trustworthy information, language barriers, or just not knowing where to look.)
															{selected === "Other" && (
																<input
																	type="text"
																	className="mt-2 w-full border rounded px-2 py-1 text-sm"
																	placeholder="Please specify..."
																	value={other}
																	onChange={(e) => setOther(e.target.value)}
																/>
															)}
														</>
													) : (
														opt
													)}
												</span>
											</label>
										))}
								</div>
							</>
						)}
						{step === 3 && steps[1] && (
							<>
								<h2 className="text-lg font-semibold mb-6">{steps[1].question}</h2>
								<div className="flex justify-between text-xs text-gray-500 mb-2">
									<span>{steps[1].leftLabel}</span>
									<span>{slider}</span>
									<span>{steps[1].rightLabel}</span>
								</div>
								<input
									type="range"
									min={steps[1].min}
									max={steps[1].max}
									value={slider}
									onChange={(e) => setSlider(Number(e.target.value))}
									className="w-full accent-amber-500"
								/>
								<div className="flex justify-between text-xs text-gray-400 mt-1">
									{[...Array(10)].map((_, i) => (
										<span key={i} className="w-4 text-center">{i + 1}</span>
									))}
								</div>
							</>
						)}
						{step === 4 && steps[2] && (
							<>
								<h2 className="text-lg font-semibold mb-6">{steps[2].question}</h2>
								<div className="space-y-3">
									{Array.isArray(steps[2].options) &&
										steps[2].options.map((opt) => (
											<label
												key={opt}
												className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition ${selected === opt ? "border-amber-500 bg-amber-50" : "border-gray-200 bg-white"}`}
											>
												<input
													type="radio"
													name="price"
													value={opt}
													checked={selected === opt}
													onChange={() => setSelected(opt)}
													className="mt-1 accent-amber-500"
												/>
												<span className="flex-1 text-gray-800">{opt}</span>
											</label>
										))}
								</div>
							</>
						)}
						{step === 5 && steps[3] && (
							<>
								<h2 className="text-lg font-semibold mb-6">{steps[3].question}</h2>
								<textarea
									className="w-full border rounded px-3 py-2 text-sm mb-4"
									placeholder={steps[3].placeholder}
									value={text}
									onChange={e => setText(e.target.value)}
									rows={3}
								/>
							</>
						)}
					</div>
					{error && (
						<div className="text-[#37C2C4] text-sm mb-3">{error}</div>
					)}
					<div className="flex gap-2">
						{step > 0 && step < 6 && (
							<button
								type="button"
								className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg transition"
								onClick={handleBack}
							>
								Back
							</button>
						)}
						<button
							type="submit"
							className="flex-1 bg-[#37C2C4] hover:bg-[#37C2C4]/80 text-white font-semibold py-2 rounded-lg mt-0 transition"
						>
							{step === 5 ? (
								<span className="flex items-center justify-center gap-2">
									<span>Submit</span>
									<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
										<path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
									</svg>
								</span>
							) : "Next"}
						</button>
					</div>
				</form>
			)}
		</div>
	);
}