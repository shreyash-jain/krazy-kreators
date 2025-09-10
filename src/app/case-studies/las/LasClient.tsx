"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";

export default function LasClient() {
	const [contactOpen, setContactOpen] = useState(false);
	const videoRef = useRef<HTMLVideoElement>(null);
	const testimonialRef = useRef<HTMLDivElement>(null);
	const [playing, setPlaying] = useState(false);
	const [wasManuallyPaused, setWasManuallyPaused] = useState(false);

	const handleVideoClick = () => {
		if (!playing) {
			setPlaying(true);
			setWasManuallyPaused(false); // User manually resumed
			setTimeout(() => {
				videoRef.current?.play();
			}, 100);
		} else {
			setPlaying(false);
			setWasManuallyPaused(true); // User manually paused
			videoRef.current?.pause();
		}
	};

	// Intersection Observer to pause/resume video based on visibility
	useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					const video = videoRef.current;
					
					if (!entry.isIntersecting && video && !video.paused) {
						// Video is not visible and is playing, pause it (preserves current time)
						video.pause();
						setPlaying(false);
						// Don't set wasManuallyPaused - this is automatic pause due to scrolling
					} else if (entry.isIntersecting && video && video.paused && !wasManuallyPaused) {
						// Video is visible, paused, and was NOT manually paused - resume it
						video.play().then(() => {
							setPlaying(true);
						}).catch((error) => {
							console.log('Resume play failed:', error);
						});
					}
				});
			},
			{
				threshold: 0.1, // Trigger when 10% of the video is visible
				rootMargin: '0px 0px -10% 0px' // Add some margin to trigger earlier
			}
		);

		if (testimonialRef.current) {
			observer.observe(testimonialRef.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [wasManuallyPaused]);


	return (
		<div className="min-h-screen bg-white">
			<main>
				{/* Hero Section */}
				<section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
					{/* Background Image */}
					<div className="absolute inset-0">
						                        <img
                            src="/brands/las-loungewear- coverimage.png"
                            alt="Las Loungewear hero background"
                            className="w-full h-full object-cover"
                        />
						<div className="absolute inset-0 bg-black/60" />
					</div>
					
					{/* Editorial texture overlay */}
					<div className="absolute inset-0 opacity-10">
						<div className="absolute top-20 left-20 w-64 h-64 bg-white/20 rounded-full blur-3xl"></div>
						<div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
					</div>
					
					<div className="relative z-10 min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
						<div className="text-center">
							{/* Editorial accent line */}
							<div className="w-24 h-0.5 bg-white mx-auto mb-8"></div>
							
							<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 sm:mb-8 tracking-tight">
								<span className="text-white">Las</span><br />
								<span className="text-[#CBB49A]">Loungewear</span>
							</h1>
							<p className="text-xl sm:text-2xl lg:text-3xl font-light mb-8 max-w-3xl mx-auto leading-relaxed text-white/90">
								Premium travelwear that redefines comfort and sophistication.
							</p>
							<p className="text-lg sm:text-xl lg:text-2xl font-serif italic text-white/80 tracking-wide mb-8">
								MODERN. FUNCTIONAL. TIMELESS.
							</p>
							<a 
								href="https://www.lasloungewear.com/" 
								target="_blank" 
								rel="noopener noreferrer"
								className="text-[#CBB49A] hover:text-white transition-colors duration-300 font-semibold text-lg underline"
								style={{ color: '#CBB49A' }}
							>
								<span style={{ color: '#CBB49A' }}>Visit Website</span>
							</a>
						</div>
					</div>
				</section>

				{/* Our Client */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-[#121212] overflow-hidden">
					{/* subtle matte texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden">
							{/* Title and Subtext */}
							<div className="text-center mb-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Our Client</h2>
								<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Las Loungewear, Premium Travelwear Brand</h3>
							</div>
							
							{/* Client Image */}
							<div className="mb-8">
								<div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
									<img src="/brands/las-client.jpeg" alt="Las Loungewear founder" className="w-full h-full object-cover" />
								</div>
							</div>
							
							{/* Text Content */}
							<div className="space-y-6 text-lg leading-relaxed">
								<p className="text-white">Las Loungewear emerged from a vision to create premium travelwear that seamlessly blends comfort with sophistication. The brand recognized that modern travelers demand more than just functional clothing — they seek pieces that elevate their journey while maintaining the highest standards of comfort and style.</p>
								<p className="text-white">The challenge was clear: how to design loungewear that feels luxurious enough for high-end hotels and private jets, yet comfortable enough for long-haul flights and extended travel. Las needed pieces that could transition effortlessly from airport lounges to hotel suites, embodying the essence of modern luxury travel.</p>
								<p className="text-white">The brand&apos;s commitment to premium materials, thoughtful design, and timeless aesthetics required a partner who could translate this vision into production-ready pieces that would meet the exacting standards of luxury travelers worldwide.</p>
							</div>
						</div>
						
						{/* Desktop Layout */}
						<div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
							{/* Left: full-height white background with centered image */}
							<div className="relative bg-white flex items-center justify-center min-h-[600px]">
								<img src="/brands/las-client.jpeg" alt="Las Loungewear founder" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
							</div>

							{/* Right: full-height black background with white text */}
							<div className="relative bg-black text-white flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
								<div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_70%_40%,white_1px,transparent_1px)] [background-size:12px_12px]"></div>
								<div className="relative max-w-2xl">
									<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Our Client</h2>
									<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Las Loungewear, Premium Travelwear Brand</h3>
									<div className="space-y-6 text-lg leading-relaxed">
										<p className="text-white">Las Loungewear emerged from a vision to create premium travelwear that seamlessly blends comfort with sophistication. The brand recognized that modern travelers demand more than just functional clothing — they seek pieces that elevate their journey while maintaining the highest standards of comfort and style.</p>
										<p className="text-white">The challenge was clear: how to design loungewear that feels luxurious enough for high-end hotels and private jets, yet comfortable enough for long-haul flights and extended travel. Las needed pieces that could transition effortlessly from airport lounges to hotel suites, embodying the essence of modern luxury travel.</p>
										<p className="text-white">The brand&apos;s commitment to premium materials, thoughtful design, and timeless aesthetics required a partner who could translate this vision into production-ready pieces that would meet the exacting standards of luxury travelers worldwide.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* THE VISION: Where It All Began */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-[#E5E5E5] overflow-hidden">
					{/* subtle matte texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_25%_20%,black_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden">
							{/* Title and Subtext */}
							<div className="text-center mb-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">THE VISION</h2>
								<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Where It All Began</h3>
							</div>
							
							{/* Vision Image */}
							<div className="mb-8">
								<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
									<img src="/brands/las-vision.jpeg" alt="Las Loungewear vision" className="w-full h-full object-cover" />
								</div>
							</div>
							
							{/* Text Content */}
							<div className="space-y-6 text-lg leading-relaxed text-black">
								<p>The client envisioned creating comfortable yet stylish travelwear — garments that felt as good as they looked. She wanted pieces that supported the body during long hours of travel, ideally using compression fabrics to reduce body pain and discomfort. While she didn&apos;t have exact clarity on fabrics or silhouettes, she knew she wanted a blend of chic aesthetics and functional comfort — something modern women could wear while traveling and still feel confident, relaxed, and put together.</p>
							</div>
						</div>
						
						{/* Desktop Layout */}
						<div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
							{/* Left: full-height grey background with black text */}
							<div className="relative bg-[#E5E5E5] text-black flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
								<div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_70%_40%,black_1px,transparent_1px)] [background-size:12px_12px]"></div>
								<div className="relative max-w-2xl">
									<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">THE VISION</h2>
									<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Where It All Began</h3>
									<div className="space-y-6 text-lg leading-relaxed">
										<p className="text-black">The client envisioned creating comfortable yet stylish travelwear — garments that felt as good as they looked. She wanted pieces that supported the body during long hours of travel, ideally using compression fabrics to reduce body pain and discomfort. While she didn&apos;t have exact clarity on fabrics or silhouettes, she knew she wanted a blend of chic aesthetics and functional comfort — something modern women could wear while traveling and still feel confident, relaxed, and put together.</p>
									</div>
								</div>
							</div>
							
							{/* Right: full-height black background with centered image */}
							<div className="relative bg-black flex items-center justify-center min-h-[800px]">
								<img src="/brands/las-vision.jpeg" alt="Las Loungewear vision" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
							</div>
						</div>
					</div>
				</section>



				{/* The Challenge: What Was Standing in Her Way? */}
				<section className="py-20 sm:py-24 lg:py-32 bg-black text-white">
					<div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
								The Challenge: What Was Standing in Her Way?
								</h2>
							<p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
								The journey from luxury vision to premium travelwear brand revealed complex challenges that required innovative solutions.
							</p>
						</div>

						{/* Numbered pointers grid */}
						<div className="max-w-6xl mx-auto">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">1</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">She had a clear vision but no clarity on technical execution — especially fabric innovation and design.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">2</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">Traditional factories refused to work on small MOQs with high style variety.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">3</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">Compression fabrics that felt soft and breathable were hard to source in limited quantities.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">4</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">Design-to-production guidance was missing — there was no single team who could handle concept, sampling, and scaling.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">5</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">There was a gap in understanding between client vision and garment execution.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">6</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">Lack of transparency, delayed communication, and fragmented supply chains added to the frustration.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">7</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">Was not getting hands-on creative partner who could translate her idea into real garments — with a balance of fashion and functionalist.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">8</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">Was not getting a design-led process that included sampling, sourcing, prototyping, and production under one roof.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">9</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">Wanted fashion-forward travelwear, not basic athleisure — but most vendors didn&apos;t understand that aesthetic.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">10</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">Multiple fabric trials were needed, but most vendors didn&apos;t want to go through repeated R&D.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
									<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">11</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">She was not getting a partner who believed in the idea enough to experiment, rework, and get every detail right.</p>
									</div>
								</article>

								<article className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm">
										<div className="flex items-center gap-4">
										<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-black font-bold text-xs flex-shrink-0">12</span>
										<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">A team ready to do deep R&D on fabrics like compression knits, bamboo, and cotton blends tailored for comfort and support.</p>
										</div>
									</article>
							</div>
						</div>
					</div>
				</section>

				{/* Enter Krazy Kreators */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-[#E5E5E5] overflow-hidden">
					{/* subtle matte texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_25%_20%,black_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden">
							{/* Title and Subtext */}
							<div className="text-center mb-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Enter Krazy Kreators</h2>
								<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Our End-to-End Approach</h3>
							</div>
							
							{/* Office Image */}
							<div className="mb-8">
								<div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
									<img src="/brands/contact.jpg" alt="Krazy Kreators office studio" className="w-full h-full object-cover" />
								</div>
							</div>
							
							{/* Text Content */}
							<div className="space-y-6 text-lg leading-relaxed text-black">
								<p>We became more than a vendor — we became her brand-building partner. From the first sketch to final production, Krazy Kreators managed every step, aligning her vision with a practical execution strategy.</p>
								
								<div className="mt-8">
									<h4 className="text-xl font-semibold text-black mb-4">Key Services Provided:</h4>
									<ul className="space-y-3">
										<li className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Creative Direction & Moodboarding</span>
										</li>
										<li className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Custom Fabric Development</span>
										</li>
										<li className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Design Sketching & Style Planning</span>
										</li>
										<li className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Sampling & Fit Trials</span>
										</li>
										<li className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Small Batch Production</span>
										</li>
										<li className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Packaging & Brand Touchpoints</span>
										</li>
									</ul>
								</div>
							</div>
						</div>
						
						{/* Desktop Layout */}
						<div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
							{/* Left: full-height black background with image */}
							<div className="relative bg-black flex items-center justify-center min-h-[600px]">
								<img src="/brands/contact.jpg" alt="Krazy Kreators office studio" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
							</div>

							{/* Right: full-height text section without background */}
							<div className="relative text-black flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
								<div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_70%_40%,white_1px,transparent_1px)] [background-size:12px_12px]"></div>
								<div className="relative max-w-2xl">
									<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Enter Krazy Kreators</h2>
									<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#CBB49A] mb-8">Our End-to-End Approach</h3>
								<div className="space-y-6 text-lg leading-relaxed">
										<p className="text-black">We became more than a vendor — we became her brand-building partner. From the first sketch to final production, Krazy Kreators managed every step, aligning her vision with a practical execution strategy.</p>
										
										<div className="mt-8">
											<h4 className="text-xl font-semibold text-black mb-4">Key Services Provided:</h4>
											<ul className="space-y-3">
												<li className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Creative Direction & Moodboarding</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Custom Fabric Development</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Design Sketching & Style Planning</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Sampling & Fit Trials</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Small Batch Production</span>
												</li>
												<li className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Packaging & Brand Touchpoints</span>
												</li>
											</ul>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* The Creative Direction */}
				<section className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
					{/* Background image */}
					<div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/brands/las-creative.jpg")' }}></div>
					{/* Overlay for better text readability */}
					<div className="absolute inset-0 bg-black/50"></div>

					<div className="relative z-10 min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="flex items-center justify-center min-h-[600px] text-center">
							<div className="max-w-4xl">
								<h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-white mb-6">The Creative Direction</h2>
								<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white">Designing the DNA of Her Brand</h3>
							</div>
						</div>
					</div>
				</section>

				{/* Creative Direction & Moodboarding */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-black text-white overflow-hidden">
					{/* subtle matte texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden">
							{/* Title */}
							<div className="text-center mb-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Creative Direction & Moodboarding</h2>
							</div>
							
							{/* Moodboard Image */}
							<div className="mb-8">
								<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
									<img src="/brands/las-moodboard.jpg" alt="Las Loungewear moodboard and creative direction" className="w-full h-full object-cover" />
								</div>
							</div>
							
							{/* Text Content */}
							<div className="space-y-6 text-lg leading-relaxed">
								<p className="text-white">We began by understanding her brand story and the emotional core behind her idea — stylish yet supportive travelwear. Since she didn&apos;t have exact clarity on silhouettes or fabrics, we stepped in to define a creative direction grounded in trend and data.</p>
								
								<div className="space-y-4">
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<span className="text-white">Researched global travelwear and modest fashion trends across GCC and US markets.</span>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<span className="text-white">Created moodboards with curated colors, textiles, and style inspirations that matched her chic, functional vision.</span>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<span className="text-white">Suggested a color palette</span>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<span className="text-white">Shared inspirational silhouettes, trims (like satin hoods), and garment functionalities that support the female form.</span>
									</div>
								</div>
								
								<p className="text-white mt-8">This gave her a visual language for her brand, bridging what she felt with what could be created.</p>
							</div>
						</div>
						
						{/* Desktop Layout */}
						<div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
							{/* Left: full-height text section */}
							<div className="relative text-white flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
								<div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_70%_40%,white_1px,transparent_1px)] [background-size:12px_12px]"></div>
								<div className="relative max-w-2xl">
									<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Creative Direction & Moodboarding</h2>
									<div className="space-y-6 text-lg leading-relaxed">
										<p className="text-white">We began by understanding her brand story and the emotional core behind her idea — stylish yet supportive travelwear. Since she didn&apos;t have exact clarity on silhouettes or fabrics, we stepped in to define a creative direction grounded in trend and data.</p>
										
										<div className="space-y-4">
											<div className="flex items-start gap-3">
												<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
												<span className="text-white">Researched global travelwear and modest fashion trends across GCC and US markets.</span>
											</div>
											<div className="flex items-start gap-3">
												<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
												<span className="text-white">Created moodboards with curated colors, textiles, and style inspirations that matched her chic, functional vision.</span>
											</div>
											<div className="flex items-start gap-3">
												<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
												<span className="text-white">Suggested a color palette</span>
											</div>
											<div className="flex items-start gap-3">
												<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
												<span className="text-white">Shared inspirational silhouettes, trims (like satin hoods), and garment functionalities that support the female form.</span>
											</div>
										</div>
										
										<p className="text-white mt-8">This gave her a visual language for her brand, bridging what she felt with what could be created.</p>
									</div>
								</div>
							</div>

							{/* Right: full-height image section */}
							<div className="relative bg-white flex items-center justify-center min-h-[600px]">
								<img src="/brands/las-moodboard.jpg" alt="Las Loungewear moodboard and creative direction" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
							</div>
						</div>
					</div>
				</section>

				{/* Custom Fabric Development */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-[#E5E5E5] overflow-hidden">
					{/* subtle texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_25%_20%,black_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden">
							{/* Title */}
							<div className="text-center mb-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Custom Fabric Development</h2>
						</div>

							{/* Fabric Image */}
							<div className="mb-8">
								<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
									<img src="/brands/las-custom-fabric.jpg" alt="Custom fabric development process" className="w-full h-full object-cover" />
								</div>
							</div>

							{/* Text Content */}
							<div className="space-y-6 text-lg leading-relaxed text-black">
								<p>The core challenge was to find or create fabrics that offered compression, softness, and breathability — a rare combination. Most compression fabrics felt too tight or synthetic.</p>
								
								<p>We initiated custom sourcing trials — experimenting with spandex blends, cotton knits, and sustainable bases.</p>
								
								<p>Introduced bamboo fabric for its silky-soft hand feel, antibacterial properties, and eco-conscious appeal which aligned with her brand ethos and resonated with her target market.</p>
								
								<p>Developed a custom compression fabric that gave structure without stiffness, offering core support for long travels.</p>
								
								<div className="space-y-4">
									<p className="font-semibold">Each fabric was tested for:</p>
									<div className="space-y-3">
										<div className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Stretch and recovery</span>
								</div>
										<div className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Skin-feel after 8+ hours of wear</span>
										</div>
										<div className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Stitch compatibility and seam strength</span>
										</div>
										<div className="flex items-start gap-3">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<span className="text-black">Draping and movement on different body types</span>
										</div>
									</div>
							</div>

								<p className="mt-8">We didn&apos;t just find fabric — we engineered it for her exact use case.</p>
								</div>
							</div>
						
						{/* Desktop Layout */}
						<div className="hidden lg:grid lg:grid-cols-2 gap-0 items-stretch">
							{/* Left: full-height image section */}
							<div className="relative bg-black flex items-center justify-center min-h-[600px]">
								<img src="/brands/las-custom-fabric.jpg" alt="Custom fabric development process" className="block mx-auto max-w-[90%] max-h-[90%] object-contain" />
							</div>

							{/* Right: full-height text section */}
							<div className="relative text-black flex items-center py-20 sm:py-24 lg:py-32 px-8 sm:px-10 lg:px-12">
								<div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_70%_40%,black_1px,transparent_1px)] [background-size:12px_12px]"></div>
								<div className="relative max-w-2xl">
									<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Custom Fabric Development</h2>
									<div className="space-y-6 text-lg leading-relaxed">
										<p className="text-black">The core challenge was to find or create fabrics that offered compression, softness, and breathability — a rare combination. Most compression fabrics felt too tight or synthetic.</p>
										
										<p className="text-black">We initiated custom sourcing trials — experimenting with spandex blends, cotton knits, and sustainable bases.</p>
										
										<p className="text-black">Introduced bamboo fabric for its silky-soft hand feel, antibacterial properties, and eco-conscious appeal which aligned with her brand ethos and resonated with her target market.</p>
										
										<p className="text-black">Developed a custom compression fabric that gave structure without stiffness, offering core support for long travels.</p>
										
										<div className="space-y-4">
											<p className="text-black font-semibold">Each fabric was tested for:</p>
											<div className="space-y-3">
												<div className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Stretch and recovery</span>
												</div>
												<div className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Skin-feel after 8+ hours of wear</span>
												</div>
												<div className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Stitch compatibility and seam strength</span>
												</div>
												<div className="flex items-start gap-3">
													<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
													<span className="text-black">Draping and movement on different body types</span>
												</div>
											</div>
										</div>
										
										<p className="text-black mt-8">We didn&apos;t just find fabric — we engineered it for her exact use case.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Custom Fabric Development - Full Width Image */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-black overflow-hidden">
					<div className="relative w-full">
						<img 
							src="/brands/las-custom-fabric-2.jpg" 
							alt="Custom fabric development process" 
							className="w-full h-auto object-cover"
						/>
					</div>
				</section>

				{/* Tech Pack Development */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-black text-white overflow-hidden">
					{/* subtle texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Centered Title */}
						<div className="text-center mb-16">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Tech Pack Development</h2>
						</div>

						{/* Full Width Image */}
						<div className="mb-16">
							<img 
								src="/brands/las-tech-pack.jpg" 
								alt="Tech pack development process" 
								className="w-full h-auto object-cover"
								/>
							</div>

							{/* Text Content */}
						<div className="max-w-6xl mx-auto">
							<div className="space-y-8 text-lg leading-relaxed text-white">
								<p className="text-white text-center text-xl sm:text-2xl lg:text-3xl font-semibold leading-relaxed">To move from concept to production-ready, we created detailed tech packs for every style.</p>
								
								{/* 2x2 Grid Cards */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-white text-base leading-relaxed">Included technical flats, spec measurements, fabric consumption, construction details, and trims.</p>
										</div>
									</div>
									
									<div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-white text-base leading-relaxed">Mapped placement of zippers, panels, elastic zones, and specialty features like satin hoods.</p>
										</div>
									</div>
									
									<div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-white text-base leading-relaxed">These served as the blueprint for our sampling and ensured all communication with tailors and factories was crystal clear.</p>
								</div>
							</div>

									<div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-white text-base leading-relaxed">Helped avoid guesswork, reduce sampling errors, and increase efficiency in production.</p>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Sampling and Fit Trials */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-[#E5E5E5] overflow-hidden">
					{/* subtle texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[radial-gradient(circle_at_25%_20%,black_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Centered Title */}
						<div className="text-center mb-16">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Sampling and Fit Trials</h2>
						</div>

						{/* Text Content */}
						<div className="max-w-6xl mx-auto">
							<div className="space-y-8 text-lg leading-relaxed text-black">
								<p className="text-black text-center text-xl sm:text-2xl lg:text-3xl font-semibold leading-relaxed">Turning design into product required multiple rounds of sampling and refinement.</p>
								
								{/* Grid Cards */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-black text-base leading-relaxed">Coordinated with master tailors and fabric technicians to create first samples based on approved tech packs.</p>
										</div>
						</div>

									<div className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-black text-base leading-relaxed">Conducted fit trials on real bodies — testing wearability, ease of movement, and shape retention after wear.</p>
								</div>
							</div>

									<div className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-black text-base leading-relaxed">Incorporated feedback from Anika at every stage — ensuring silhouettes matched her imagination and felt great in real life.</p>
										</div>
									</div>
									
									<div className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-black text-base leading-relaxed">Made multiple sample iterations to perfect minor details: necklines, sleeve finishes, zip placements, and length ratios.</p>
										</div>
					</div>

									<div className="rounded-2xl border border-black/10 bg-white/60 p-6 shadow-[0_8px_24px_rgba(0,0,0,0.1)] backdrop-blur-sm md:col-span-2">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-black text-base leading-relaxed">Also tested fabric layering techniques where one style used 3–4 different fabric types — something most production houses avoid due to complexity.</p>
										</div>
									</div>
								</div>

								{/* Conclusion Text */}
								<div className="text-center mt-12">
									<p className="text-black text-lg sm:text-xl font-semibold italic leading-relaxed">We obsessed over fit, finish, and feeling — because premium wearability lives in the details.</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Manufacturing Process - Full Width Image */}
				<section className="relative bg-black overflow-hidden">
					<div className="relative w-full">
						<img 
							src="/brands/las-sampling.jpg" 
							alt="Garment manufacturing process collage" 
							className="w-full h-auto object-cover"
						/>
								</div>
				</section>

				{/* Detailing, Trims & Label Development */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-black text-white overflow-hidden">
					{/* subtle texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Centered Title */}
						<div className="text-center mb-16">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Detailing, Trims & Label Development</h2>
							</div>

						{/* Full Width Image */}
						<div className="mb-16">
							<img 
								src="/brands/las-detalling.png" 
								alt="Detailing, trims and label development" 
								className="w-full h-auto object-cover"
							/>
						</div>

						{/* Text Content */}
						<div className="max-w-6xl mx-auto">
							<div className="space-y-8 text-lg leading-relaxed text-white">
								<p className="text-white text-center text-xl sm:text-2xl lg:text-3xl font-semibold leading-relaxed">Every feature was intentionally crafted, not just functional — but brand defining.</p>
								
								{/* 2x2 Grid Cards */}
								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-white text-base leading-relaxed">Created custom trims — like branded zippers, contrast tapes, and satin hood linings.</p>
										</div>
									</div>
									
									<div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-white text-base leading-relaxed">Designed brand labels that felt premium and aligned with her wellness aesthetic.</p>
										</div>
									</div>
									
									<div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-white text-base leading-relaxed">Carefully selected stitch types, zipper placements, and hardware tones to elevate the look.</p>
										</div>
									</div>
									
									<div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)] backdrop-blur-sm">
										<div className="flex items-start gap-4">
											<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
											<p className="text-white text-base leading-relaxed">Every detail — from neck binding to seam tape — was reviewed for quality, comfort, and aesthetics.</p>
										</div>
									</div>
								</div>

								{/* Conclusion Text */}
								<div className="text-center mt-12">
									<p className="text-white text-lg sm:text-xl font-semibold italic leading-relaxed">We believe &quot;premium&quot; lives in the smallest details. That&apos;s where we focused the most.</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Production & Packaging */}
				<section className="relative py-20 sm:py-24 lg:py-32 text-white overflow-hidden">
					{/* Background Image */}
					<div className="absolute inset-0">
						<img
							src="/brands/las-production.jpg" 
							alt="Production and packaging process" 
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-black/60" />
					</div>

					<div className="relative z-10 min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Centered Title */}
						<div className="text-center mb-16">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-6">Production & Packaging</h2>
						</div>

						{/* Grid Cards */}
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
							<div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
								<h3 className="text-xl font-semibold text-white mb-4">Pattern Grading</h3>
								<div className="space-y-3 text-white">
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">After finalizing approved samples, we moved into pattern grading – adjusting each style into all required sizes while maintaining fit precision.</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">Every garment was graded keeping fabric stretch, compression zones, and layering functionality in mind.</p>
									</div>
								</div>
							</div>
							
							<div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
								<h3 className="text-xl font-semibold text-white mb-4">Production Begins (Low MOQ, High Variety)</h3>
								<div className="space-y-3 text-white">
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">We moved into actual production across multiple styles, all managed in low quantities (as per the brand&apos;s exclusive model).</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">Each style had different construction requirements – from multiple fabric combinations to functional details like zippers, drawcords, and hoods.</p>
									</div>
								</div>
							</div>
							
							<div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
								<h3 className="text-xl font-semibold text-white mb-4">In-line Quality Check</h3>
								<div className="space-y-3 text-white">
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">During production, we implemented stage-wise quality checks: checking stitching, seam strength, fabric alignment, and trim placements in real time.</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">This reduced the chance of bulk defects and ensured consistency from piece to piece.</p>
									</div>
								</div>
							</div>
							
							<div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
								<h3 className="text-xl font-semibold text-white mb-4">Finishing & Detailing</h3>
								<div className="space-y-3 text-white">
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">Once stitching was done, every garment went through finishing: thread trimming, steaming, pressing, and hardware adjustment (like zip alignment).</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">Applied brand labels, size tags, and care labels in exact specified placements for professional presentation.</p>
									</div>
								</div>
							</div>
							
							<div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 shadow-[0_8px_24px_rgba(0,0,0,0.25)]">
								<h3 className="text-xl font-semibold text-white mb-4">Final Packaging</h3>
								<div className="space-y-3 text-white">
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">Each finished product was then individually packed as per brand packaging guidelines.</p>
									</div>
									<div className="flex items-start gap-3">
										<span className="w-2 h-2 bg-[#CBB49A] rounded-full mt-2 flex-shrink-0"></span>
										<p className="text-white text-sm leading-relaxed">We used custom labels, tags, wraps, and polybags, carefully arranged to match the LAS identity – clean, premium, and travel-ready.</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

								{/* Video Testimonial */}
				<section ref={testimonialRef} className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden">
							{/* Title */}
							<div className="text-center mb-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Client Testimonial</h2>
								<div className="w-16 h-0.5 bg-[#CBB49A] mx-auto mb-8"></div>
						</div>

							{/* Video Testimonial */}
							<div className="mb-8">
								<div className="relative max-w-md mx-auto">
									<div 
										className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
										onClick={handleVideoClick}
									>
										<div className="relative w-full" style={{ aspectRatio: '4/5' }}>
											<video
												ref={videoRef}
												src="/testimonial/las-testimonial.mp4"
												className="w-full h-full object-cover"
												controls={false}
												playsInline
												preload="metadata"
												onEnded={() => setPlaying(false)}
												tabIndex={-1}
											/>
											{/* Play button overlay when not playing */}
											{!playing && (
												<div className="absolute inset-0 flex items-center justify-center bg-black/10">
													<div className="bg-white/80 backdrop-blur-sm rounded-full p-4 flex items-center justify-center shadow-lg">
														<svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
															<polygon points="9.5,7.5 16.5,12 9.5,16.5" />
														</svg>
													</div>
												</div>
											)}
										</div>
									</div>
								</div>
							</div>

							{/* Text Content */}
							<div className="space-y-6 text-lg leading-relaxed text-black">
								<p>
									&quot;Working with Krazy Kreators was a game-changer for Las Loungewear. They didn&apos;t just understand my vision — they elevated it. From the initial concept to the final product, every step was executed with precision and creativity.&quot;
								</p>
								
								<p>
									&quot;The attention to detail in fabric selection, the innovative compression technology, and the sophisticated design elements exceeded my expectations. They truly became a partner in building my brand, not just a vendor.&quot;
								</p>
								
								<p>
									&quot;The end result is exactly what I envisioned: premium travelwear that feels luxurious and performs perfectly. Our customers love the quality and comfort, and I couldn&apos;t be happier with the partnership.&quot;
								</p>
								</div>

							{/* Client Details */}
							<div className="pt-6 border-t border-gray-200 mt-8">
								<h3 className="text-xl font-semibold text-black mb-2">Anika McKelvey</h3>
								<p className="text-[#CBB49A] font-medium">Founder, Las Loungewear</p>
								<p className="text-gray-600 text-sm">Miami, USA</p>
							</div>
							</div>

						{/* Desktop Layout */}
						<div className="hidden lg:grid lg:grid-cols-2 gap-12 items-center">
							{/* Left: Video Testimonial */}
							<div className="relative max-w-md mx-auto">
								<div 
									className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer"
									onClick={handleVideoClick}
								>
									<div className="relative w-full" style={{ aspectRatio: '4/5' }}>
										<video
											ref={videoRef}
											src="/testimonial/las-testimonial.mp4"
											className="w-full h-full object-cover"
											controls={false}
											playsInline
											preload="metadata"
											onEnded={() => setPlaying(false)}
											tabIndex={-1}
										/>
										{/* Play button overlay when not playing */}
										{!playing && (
											<div className="absolute inset-0 flex items-center justify-center bg-black/10">
												<div className="bg-white/80 backdrop-blur-sm rounded-full p-4 flex items-center justify-center shadow-lg">
													<svg className="w-8 h-8 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
														<polygon points="9.5,7.5 16.5,12 9.5,16.5" />
													</svg>
												</div>
											</div>
										)}
									</div>
								</div>
							</div>

							{/* Right: Testimonial Summary */}
							<div className="space-y-8">
								<div>
									<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Client Testimonial</h2>
									<div className="w-16 h-0.5 bg-[#CBB49A] mb-8"></div>
								</div>
								
								<div className="space-y-6 text-lg leading-relaxed text-gray-700">
									<p className="text-black">
										&quot;Working with Krazy Kreators was a game-changer for Las Loungewear. They didn&apos;t just understand my vision — they elevated it. From the initial concept to the final product, every step was executed with precision and creativity.&quot;
									</p>
									
									<p className="text-black">
										&quot;The attention to detail in fabric selection, the innovative compression technology, and the sophisticated design elements exceeded my expectations. They truly became a partner in building my brand, not just a vendor.&quot;
									</p>
									
									<p className="text-black">
										&quot;The end result is exactly what I envisioned: premium travelwear that feels luxurious and performs perfectly. Our customers love the quality and comfort, and I couldn&apos;t be happier with the partnership.&quot;
									</p>
								</div>

								{/* Client Details */}
								<div className="pt-6 border-t border-gray-200">
									<h3 className="text-xl font-semibold text-black mb-2">Anika McKelvey</h3>
									<p className="text-[#CBB49A] font-medium">Founder, Las Loungewear</p>
									<p className="text-gray-600 text-sm">Miami, USA</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Website Launch */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-black text-white overflow-hidden">
					{/* subtle texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center">
							{/* Main Content */}
							<div className="max-w-4xl mx-auto">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-8">The Brand Goes Live</h2>
								
								<div className="space-y-8">
									<div className="text-xl sm:text-2xl text-white/90 leading-relaxed">
										LAS Travel & Loungewear is now live.{" "}
										<a 
											href="https://www.lasloungewear.com/" 
											target="_blank" 
											rel="noopener noreferrer"
											className="text-[#CBB49A] hover:text-white transition-colors duration-300 font-semibold underline"
										>
											Visit Website
										</a>
							</div>

									{/* Website Image */}
									<div className="flex justify-center mb-8">
										<img 
											src="/brands/las-website.jpg" 
											alt="LAS Loungewear website" 
											className="w-full max-w-4xl h-auto object-contain rounded-lg"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Other Case Studies */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Explore Our Other Case Studies</h2>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover how we&apos;ve helped other brands transform their vision into reality</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
							{/* Tilted Lotus Case Study */}
							<a href="/case-studies/tilted-lotus" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
								<div className="relative h-64 overflow-hidden">
									<img
										src="/brands/tilted-lotus-hero.jpg"
										alt="Tilted Lotus Case Study"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
								</div>
								<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
									<h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">Tilted Lotus</h3>
									<p className="text-white/90 text-xs mb-1.5 leading-tight">Premium wellness brand</p>
									<div className="inline-flex items-center text-[#CBB49A] group-hover:text-white transition-colors duration-300 font-semibold text-xs">
										View Case Study
										<ArrowRight className="ml-1 w-2.5 h-2.5" />
									</div>
								</div>
							</a>

							{/* Drover Case Study */}
							<a href="/case-studies/drover" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
								<div className="relative h-64 overflow-hidden">
									<img
										src="/brands/drover-coverimage.jpg"
										alt="Drover Case Study"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
								</div>
								<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
									<h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">Drover</h3>
									<p className="text-white/90 text-xs mb-1.5 leading-tight">Automotive lifestyle brand</p>
									<div className="inline-flex items-center text-[#CBB49A] group-hover:text-white transition-colors duration-300 font-semibold text-xs">
										View Case Study
										<ArrowRight className="ml-1 w-2.5 h-2.5" />
									</div>
								</div>
							</a>

							{/* HY Official Case Study */}
							<a href="/case-studies/hy-official" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
								<div className="relative h-64 overflow-hidden">
									<img
										src="/brands/hy-official-coverimage.png"
										alt="HY Official Case Study"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
								</div>
								<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
									<h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">HY Official</h3>
									<p className="text-white/90 text-xs mb-1.5 leading-tight">Fashion brand development</p>
									<div className="inline-flex items-center text-[#CBB49A] group-hover:text-white transition-colors duration-300 font-semibold text-xs">
										View Case Study
										<ArrowRight className="ml-1 w-2.5 h-2.5" />
									</div>
								</div>
							</a>

							{/* Badria Al Shihhi Case Study */}
							<a href="/case-studies/badri-al-shihhi" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
								<div className="relative h-64 overflow-hidden">
									<img
										                  src="/brands/badriaalshihhi-coverimage.jpg"
										alt="Badria Al Shihhi Case Study"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
								</div>
								<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
									<h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">Badria Al Shihhi</h3>
									<p className="text-white/90 text-xs mb-1.5 leading-tight">Personal brand development</p>
									<div className="inline-flex items-center text-[#CBB49A] group-hover:text-white transition-colors duration-300 font-semibold text-xs">
										View Case Study
										<ArrowRight className="ml-1 w-2.5 h-2.5" />
									</div>
								</div>
							</a>
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
					{/* Editorial background pattern */}
					<div className="absolute inset-0 opacity-5">
						<div className="absolute top-10 left-10 w-32 h-32 border-2 border-black transform rotate-45"></div>
						<div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-gray-600 transform -rotate-45"></div>
						<div className="absolute top-1/2 left-1/3 w-16 h-16 border border-black rounded-full"></div>
					</div>

					<div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
						{/* Enhanced Header */}
						<div className="mb-8 sm:mb-10">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6 sm:mb-8 tracking-tight leading-tight uppercase">
								READY TO BUILD A BRAND THAT<br />
								<span className="text-[#CBB49A]">STANDS OUT?</span>
							</h2>

							{/* Corner brackets */}
							<div className="flex justify-center items-center gap-6 mb-8">
								<div className="w-16 h-0.5 bg-black"></div>
								<div className="w-4 h-4 border-2 border-black transform rotate-45"></div>
								<div className="w-16 h-0.5 bg-black"></div>
							</div>
						</div>

						{/* Pull quote subheadline */}
						<div className="relative max-w-4xl mx-auto mb-10 sm:mb-12">
							<div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-gray-600"></div>
							<p className="text-lg sm:text-xl md:text-2xl text-gray-700 font-medium leading-relaxed px-16 italic">
								Let&apos;s create something timeless, sophisticated, and unapologetically luxurious. Your vision deserves to be celebrated in premium fashion.
							</p>
							<div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-gray-600"></div>
						</div>

						{/* Enhanced CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center">
							<Button 
								size="lg" 
								className="group bg-[#CBB49A] text-white hover:bg-[#b7a078] text-base sm:text-lg font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-[#CBB49A]"
								onClick={(e) => { e.preventDefault(); setContactOpen(true); }}
							>
								<span className="flex items-center gap-3 text-white">
									Start Your Journey
									<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
								</span>
							</Button>
							<Button 
								size="lg" 
								variant="outline" 
								className="group border-2 border-[#CBB49A] text-[#CBB49A] hover:bg-[#CBB49A] hover:text-black text-base sm:text-lg font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
								onClick={(e) => { e.preventDefault(); setContactOpen(true); }}
							>
								<span className="flex items-center gap-3">
									Start a Demo
									<MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
								</span>
							</Button>
						</div>
					</div>
				</section>
			</main>

			<Footer />
			
			{/* Contact Dialog */}
			<ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
		</div>
	);
}
