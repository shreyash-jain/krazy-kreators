/* eslint-disable */
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Factory, Users, TrendingUp } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";

export default function TiltedLotusClient() {
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

	const barriersMobile: string[] = [
		"Traditional manufacturers rejected small batches with many styles.",
		"Most vendors lacked flexibility for continuous new design drops.",
		"No clear guidance or structure for scaling from idea to final product.",
		"Supply chains were fragmented and expensive for new brands.",
		"Communication gaps between designers, tailors, and vendors caused frequent delays.",
		"High MOQs (Minimum Order Quantities) didn\u2019t suit her exclusivity model.",
		"No single platform offered design, sampling, and production under one roof.",
		"Sample quality often didn\u2019t align with bulk production, affecting consistency.",
		"Limited access to teams who understand cultural fashion with a modern edge.",
	];

	return (
		<div className="min-h-screen bg-white">
			<main>
				{/* Hero Section */}
				<section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
					{/* Background Image */}
					<div className="absolute inset-0">
						<img 
							src="/brands/tilted-lotus-hero.jpg" 
							alt="Tilted Lotus hero background" 
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-black/50" />
					</div>
					
					{/* Background Pattern */}
					<div className="absolute inset-0 opacity-10">
						<div className="absolute top-20 left-20 w-64 h-64 bg-[#CBB49A] rounded-full blur-3xl"></div>
						<div className="absolute bottom-20 right-20 w-96 h-96 bg-[#6BA292] rounded-full blur-3xl"></div>
					</div>
					
					<div className="relative z-10 min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24 lg:py-32">
						<div className="text-center">
							<h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-bold mb-6 sm:mb-8 tracking-tight">
								<span className="text-white">Tilted</span><br />
								<span className="text-[#CBB49A]">Lotus</span>
							</h1>
							<p className="text-xl sm:text-2xl lg:text-3xl font-light mb-8 max-w-3xl mx-auto leading-relaxed text-white">
								Houston-based slow fashion studio blending South Asian art with contemporary design.
							</p>
							<p className="text-lg sm:text-xl lg:text-2xl font-serif italic text-[#CBB49A] tracking-wide mb-8">
								BOLD. BEAUTIFUL. UNAPOLOGETICALLY CULTURAL.
							</p>
							<a 
								href="https://www.tiltedlotus.com/?srsltid=AfmBOoqKfQpn8-EkzpcwNqEYFdnIwMJQSlgIdFszyNZELOPWNYnFUXJJ" 
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

				{/* Our Client — Preeti Gore */}
				<section className="py-20 sm:py-24 lg:py-32 bg-white">
					<div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden">
							{/* Title and Subtext */}
							<div className="text-center mb-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] mb-6">
									Our Client
								</h2>
								<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#6BA292] mb-8">
									Preeti Gore, Founder of Tilted Lotus
								</h3>
							</div>
							
							{/* Founder Image */}
							<div className="mb-8">
								<div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
									<img 
										src="/brands/tilted-lotus-founder.jpg" 
										alt="Preeti Gore, Founder of Tilted Lotus" 
										className="w-full h-full object-cover"
									/>
								</div>
							</div>
							
							{/* Text Content */}
							<div className="space-y-6 text-lg leading-relaxed text-[#3D3846]">
								<p>
									Preeti Gore&apos;s journey began with a deep-rooted passion for her South Asian heritage and a vision to bridge cultural artistry with contemporary fashion. As a Houston-based designer, she recognized the gap in the market for authentic, culturally-inspired clothing that could resonate with modern audiences.
								</p>
								<p>
									Her inspiration stems from India&apos;s rich tapestry of traditions, tribal motifs, and artistic heritage. Preeti envisioned a brand that would celebrate these cultural elements while creating inclusive, bold designs that could be worn by anyone who appreciates the fusion of heritage and modernity.
								</p>
								<p>
									The challenge was clear: how to transform ancient traditions into contemporary silhouettes that would appeal to a global audience while maintaining the authenticity and cultural significance that makes South Asian art so compelling.
								</p>
							</div>
						</div>
						
						{/* Desktop Layout */}
						<div className="hidden lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
							{/* Text Content */}
							<div>
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] mb-6">
									Our Client
								</h2>
								<h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#6BA292] mb-8">
									Preeti Gore, Founder of Tilted Lotus
								</h3>
								<div className="space-y-6 text-lg leading-relaxed text-[#3D3846]">
									<p>
										Preeti Gore&apos;s journey began with a deep-rooted passion for her South Asian heritage and a vision to bridge cultural artistry with contemporary fashion. As a Houston-based designer, she recognized the gap in the market for authentic, culturally-inspired clothing that could resonate with modern audiences.
									</p>
									<p>
										Her inspiration stems from India&apos;s rich tapestry of traditions, tribal motifs, and artistic heritage. Preeti envisioned a brand that would celebrate these cultural elements while creating inclusive, bold designs that could be worn by anyone who appreciates the fusion of heritage and modernity.
									</p>
									<p>
										The challenge was clear: how to transform ancient traditions into contemporary silhouettes that would appeal to a global audience while maintaining the authenticity and cultural significance that makes South Asian art so compelling.
									</p>
								</div>
							</div>
							
							{/* Founder Image */}
							<div className="relative">
								<div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
									<img 
										src="/brands/tilted-lotus-founder.jpg" 
										alt="Preeti Gore, Founder of Tilted Lotus" 
										className="w-full h-full object-cover"
									/>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Brand Overview */}
				<section className="py-20 sm:py-24 lg:py-32 bg-black text-white">
					<div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden">
							{/* Title and Subtext */}
							<div className="text-center mb-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
									Brand Overview
								</h2>
								<p className="text-xl sm:text-2xl font-serif italic text-[#CBB49A] mb-8 tracking-wide">
									MERGING SOUTH ASIAN ARTISTRY WITH CONTEMPORARY FASHION
								</p>
							</div>
							
							{/* Brand Image */}
							<div className="mb-8">
								<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
									<img 
										src="/brands/tilted-lotus-brand.jpg" 
										alt="Tilted Lotus brand overview" 
										className="w-full h-full object-cover"
									/>
								</div>
							</div>
							
							{/* Text Content */}
							<div className="space-y-6 text-lg leading-relaxed">
								<p className="text-white">
									Tilted Lotus represents the perfect fusion of cultural heritage and modern design philosophy. The brand&apos;s name itself reflects this balance — the lotus, a symbol of purity and enlightenment in South Asian culture, &quot;tilted&quot; to represent the contemporary twist on traditional values.
								</p>
								<p className="text-white">
									Every piece in the Tilted Lotus collection is crafted with intention, drawing inspiration from India&apos;s diverse artistic traditions. From intricate tribal motifs to bold geometric patterns, each design tells a story of cultural richness while maintaining the clean lines and contemporary silhouettes that modern fashion demands.
								</p>
								<p className="text-white">
									The brand&apos;s commitment to slow fashion ensures that each garment is made with care, using sustainable practices and premium materials. This approach not only honors the cultural significance of the designs but also aligns with the growing demand for ethical, conscious fashion choices.
								</p>
							</div>
						</div>
						
						{/* Desktop Layout */}
						<div className="hidden lg:grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
							{/* Brand Image */}
							<div className="relative">
								<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
									<img 
										src="/brands/tilted-lotus-brand.jpg" 
										alt="Tilted Lotus brand overview" 
										className="w-full h-full object-cover"
									/>
								</div>
							</div>
							
							{/* Text Content */}
							<div>
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
									Brand Overview
								</h2>
								<p className="text-xl sm:text-2xl font-serif italic text-[#CBB49A] mb-8 tracking-wide">
									MERGING SOUTH ASIAN ARTISTRY WITH CONTEMPORARY FASHION
								</p>
								<div className="space-y-6 text-lg leading-relaxed">
									<p className="text-white">
										Tilted Lotus represents the perfect fusion of cultural heritage and modern design philosophy. The brand&apos;s name itself reflects this balance — the lotus, a symbol of purity and enlightenment in South Asian culture, &quot;tilted&quot; to represent the contemporary twist on traditional values.
									</p>
									<p className="text-white">
										Every piece in the Tilted Lotus collection is crafted with intention, drawing inspiration from India&apos;s diverse artistic traditions. From intricate tribal motifs to bold geometric patterns, each design tells a story of cultural richness while maintaining the clean lines and contemporary silhouettes that modern fashion demands.
									</p>
									<p className="text-white">
										The brand&apos;s commitment to slow fashion ensures that each garment is made with care, using sustainable practices and premium materials. This approach not only honors the cultural significance of the designs but also aligns with the growing demand for ethical, conscious fashion choices.
									</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* The Vision */}
				<section className="py-20 sm:py-24 lg:py-32 bg-white">
					<div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] mb-6">
								THE VISION: Where It All Began
							</h2>
							<p className="text-xl sm:text-2xl font-serif italic text-[#6BA292] mb-8 tracking-wide">
								When Tilted Lotus Met Krazy Kreators — The Spark That Ignited a Brand
							</p>
						</div>

						{/* Vision Images */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
								<img 
									src="/brands/tilted-lotus-vision.jpg" 
									alt="Tilted Lotus vision image 1" 
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
								<img 
									src="/brands/tilted-lotus-vision-2.jpg" 
									alt="Tilted Lotus vision image 2" 
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-xl">
								<img 
									src="/brands/tilted-lotus-vision-3.jpg" 
									alt="Tilted Lotus vision image 3" 
									className="w-full h-full object-cover"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Early Challenges & Krazy Kreators' Role */}
				<section className="py-20 sm:py-24 lg:py-32 bg-white">
					<div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] mb-6">
								Early Challenges
							</h2>
							<p className="text-xl text-[#3D3846] max-w-3xl mx-auto leading-relaxed">
								The journey from cultural inspiration to contemporary fashion brand required navigating complex challenges in manufacturing, vendor relationships, and scaling operations.
							</p>
						</div>

						{/* Challenge Cards */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<div className="bg-white border-2 border-[#E8E4DD] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
								<div className="w-16 h-16 bg-[#6BA292]/10 rounded-xl flex items-center justify-center mb-6">
									<Factory className="w-8 h-8 text-[#6BA292]" />
								</div>
								<h3 className="text-xl font-bold text-[#2D2A2E] mb-4">Manufacturing Complexity</h3>
								<p className="text-[#3D3846] leading-relaxed">
									Finding manufacturers who could handle the intricate details and cultural authenticity required for South Asian-inspired designs while maintaining contemporary quality standards.
								</p>
							</div>

							<div className="bg-white border-2 border-[#E8E4DD] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
								<div className="w-16 h-16 bg-[#6BA292]/10 rounded-xl flex items-center justify-center mb-6">
									<Users className="w-8 h-8 text-[#6BA292]" />
								</div>
								<h3 className="text-xl font-bold text-[#2D2A2E] mb-4">Vendor Relationships</h3>
								<p className="text-[#3D3846] leading-relaxed">
									Building trust with vendors who could understand the cultural significance of designs while delivering on modern fashion timelines and quality expectations.
								</p>
							</div>

							<div className="bg-white border-2 border-[#E8E4DD] rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
								<div className="w-16 h-16 bg-[#6BA292]/10 rounded-xl flex items-center justify-center mb-6">
									<TrendingUp className="w-8 h-8 text-[#6BA292]" />
								</div>
								<h3 className="text-xl font-bold text-[#2D2A2E] mb-4">Scaling Operations</h3>
								<p className="text-[#3D3846] leading-relaxed">
									Maintaining the authenticity and quality of cultural designs while expanding production capacity to meet growing market demand and brand recognition.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Barriers Between Brand Dream and Reality */}
				<section className="py-20 sm:py-24 lg:py-32 bg-black text-white">
					<div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
								Barriers Between the Brand Dream and Reality
							</h2>
							<p className="text-xl text-white max-w-3xl mx-auto leading-relaxed">
								The journey from cultural inspiration to contemporary fashion brand revealed complex challenges that required innovative solutions.
							</p>
						</div>

						{/* Numbered pointers grid */}
						<div className="max-w-6xl mx-auto">
							<div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">
								{barriersMobile.map((txt, i) => (
									<article
										key={i}
										className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 md:p-6 lg:p-7 shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.35)] transition-shadow backdrop-blur-sm"
									>
										<div className="flex items-center gap-4">
											<span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#CBB49A] text-[#2D2A2E] font-bold text-xs flex-shrink-0">{i + 1}</span>
											<p className="text-white/90 text-base md:text-[17px] leading-relaxed antialiased">{txt}</p>
										</div>
									</article>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Product Research - Editorial Layout */}
				<section className="py-20 sm:py-24 lg:py-32 bg-[#F9F7F4] relative overflow-hidden">
					{/* subtle background accents */}
					<div className="pointer-events-none absolute -top-24 -left-24 w-80 h-80 rounded-full bg-[#CBB49A]/20 blur-3xl" />
					<div className="pointer-events-none absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full bg-[#6BA292]/10 blur-3xl" />

					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden text-center">
							{/* Heading + pull quote */}
							<div className="lg:max-w-3xl mx-auto mb-8">
								<div className="w-14 h-0.5 bg-[#CBB49A] mb-6 mx-auto" />
								<h2 className="uppercase text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] tracking-tight mb-4">
									Every Great Brand Starts with Research
								</h2>
								<p className="text-lg sm:text-xl font-serif italic text-[#6BA292] mb-8">
									From Culture to Customer — We Study Before We Sketch
								</p>
							</div>

							{/* Collage */}
							<div className="mb-8">
								<div className="grid grid-cols-2 gap-3 sm:gap-4">
									{[
										"/brands/tilted-lotus-product-3.jpg",
										"/brands/tilted-lotus-product-4.jpg",
										"/brands/tilted-lotus-product-1.jpg",
										"/brands/tilted-lotus-product-2.png",
									].map((src, idx) => (
										<img
											key={idx}
											src={src}
											alt={`Tilted Lotus research ${idx + 1}`}
											className={`w-full object-cover ${idx < 2 ? 'h-72 sm:h-80 lg:h-96' : 'h-36 sm:h-40 lg:h-48'}`}
										/>
									))}
								</div>
							</div>

							{/* Text block */}
							<div className="text-base sm:text-lg leading-relaxed text-[#3D3846] space-y-5 text-left">
								<p>
									Our research process began with deep dives into <span className="font-semibold text-[#6BA292]">South Asian cultural heritage</span>, studying traditional motifs, color palettes, and textile techniques. We analyzed how these elements could be reinterpreted for contemporary audiences without losing their cultural significance.
								</p>
								<p>
									Market research revealed a growing demand for culturally-inspired fashion that celebrates diversity while maintaining modern appeal. We identified key customer segments who value both cultural authenticity and contemporary design, understanding their preferences for <span className="font-semibold text-[#6BA292]">bold patterns</span>, <span className="font-semibold text-[#6BA292]">rich colors</span>, and <span className="font-semibold text-[#6BA292]">inclusive sizing</span>.
								</p>
								<p>
									Competitive analysis showed that while there were brands offering South Asian-inspired clothing, few were successfully bridging the gap between traditional and <span className="font-semibold text-[#6BA292]">contemporary aesthetics</span>. This presented a unique opportunity for Tilted Lotus to carve out its own space in the market.
								</p>
							</div>
						</div>

						{/* Desktop Layout */}
						<div className="hidden lg:block text-center">
							{/* Heading + pull quote */}
							<div className="lg:max-w-3xl mx-auto">
								<div className="w-14 h-0.5 bg-[#CBB49A] mb-6 mx-auto" />
								<h2 className="uppercase text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] tracking-tight mb-4">
									Every Great Brand Starts with Research
								</h2>
								<p className="text-lg sm:text-xl font-serif italic text-[#6BA292] mb-8">
									From Culture to Customer — We Study Before We Sketch
								</p>
							</div>

							{/* Collage and subtext arranged horizontally */}
							<div className="mt-6 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-start md:items-center">
								{/* Text block */}
								<div className="md:col-span-7 md:mx-auto">
									<div className="text-base sm:text-lg leading-relaxed text-[#3D3846] space-y-5 text-left">
										<p>
											Our research process began with deep dives into <span className="font-semibold text-[#6BA292]">South Asian cultural heritage</span>, studying traditional motifs, color palettes, and textile techniques. We analyzed how these elements could be reinterpreted for contemporary audiences without losing their cultural significance.
										</p>
										<p>
											Market research revealed a growing demand for culturally-inspired fashion that celebrates diversity while maintaining modern appeal. We identified key customer segments who value both cultural authenticity and contemporary design, understanding their preferences for <span className="font-semibold text-[#6BA292]">bold patterns</span>, <span className="font-semibold text-[#6BA292]">rich colors</span>, and <span className="font-semibold text-[#6BA292]">inclusive sizing</span>.
										</p>
										<p>
											Competitive analysis showed that while there were brands offering South Asian-inspired clothing, few were successfully bridging the gap between traditional and <span className="font-semibold text-[#6BA292]">contemporary aesthetics</span>. This presented a unique opportunity for Tilted Lotus to carve out its own space in the market.
										</p>
									</div>
								</div>

								{/* Collage */}
								<div className="md:col-span-5 md:mx-auto">
									<div className="grid grid-cols-2 gap-3 sm:gap-4">
										{[
											"/brands/tilted-lotus-product-3.jpg",
											"/brands/tilted-lotus-product-4.jpg",
											"/brands/tilted-lotus-product-1.jpg",
											"/brands/tilted-lotus-product-2.png",
										].map((src, idx) => (
											<img
												key={idx}
												src={src}
												alt={`Tilted Lotus research ${idx + 1}`}
												className={`w-full object-cover ${idx < 2 ? 'h-72 sm:h-80 lg:h-96' : 'h-36 sm:h-40 lg:h-48'}`}
											/>
										))}
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* From Sketch to Stitch */}
				<section className="relative py-20 sm:py-24 lg:py-32 text-white overflow-hidden">
					<div className="absolute inset-0">
						<img
							src="/brands/tilted-lotus-design.jpg"
							alt="Tilted Lotus design collage background"
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-black/55" />
					</div>

					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-12 sm:mb-16">
							<div className="w-14 h-0.5 bg-[#CBB49A] mx-auto mb-6" />
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold tracking-tight">From Sketch to Stitch</h2>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
							<article className="rounded-2xl border border-white/10 bg-black/40 text-white backdrop-blur-sm p-6 sm:p-8 ">
								<h3 className="text-xl sm:text-2xl font-semibold mb-3">Artisanal Details</h3>
								<p className="text-sm sm:text-base text-white mb-4">Designed intricate elements such as:</p>
								<ul className="space-y-2 list-disc list-inside text-white">
									<li className="text-sm sm:text-base text-white">Embroidery motifs</li>
									<li className="text-sm sm:text-base text-white">Surface prints and placements</li>
									<li className="text-sm sm:text-base text-white">Unique neckline cuts</li>
									<li className="text-sm sm:text-base text-white">Innovative sleeve finishes</li>
								</ul>
							</article>

							<article className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm p-6 sm:p-8">
								<h3 className="text-xl sm:text-2xl font-semibold mb-3">Material & Texture Exploration</h3>
								<p className="text-sm sm:text-base text-white leading-relaxed">
									Carefully selected and suggested fabric bases and textures to enhance each design&apos;s visual and tactile appeal.
								</p>
							</article>
						</div>
					</div>
				</section>

				{/* Designing the Collection */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-gradient-to-b from-white via-[#F9F7F4] to-[#F5F2EB] overflow-hidden">
					{/* subtle background accents */}
					<div className="pointer-events-none absolute -top-20 -left-24 w-64 h-64 rounded-full bg-[#CBB49A]/20 blur-3xl" />
					<div className="pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-[#6BA292]/15 blur-3xl" />

					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<div className="w-14 h-0.5 bg-[#CBB49A] mx-auto mb-6" />
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E]">
								Designing the Collection
							</h2>
						</div>

						<div className="space-y-12 lg:space-y-16">
							{/* First Image */}
							<div className="flex justify-center">
								<img 
									src="/brands/tilted-lotus-design-2.png" 
									alt="Tilted Lotus design process" 
									className="w-full h-auto"
								/>
							</div>

							{/* Text Content */}
							<div className="max-w-4xl mx-auto text-center">
								<div className="space-y-6 text-lg leading-relaxed text-[#3D3846]">
									<p>
										We started by transforming our original <span className="font-semibold text-[#6BA292]">croquis sketches</span> into real-life looks, ensuring each 
										garment on the model reflected the <span className="font-semibold text-[#CBB49A]">exact silhouette, style, and detailing</span> from the design boards.
									</p>
									<p>
										We made <span className="font-semibold text-[#CBB49A]">NYFW collection</span>, &quot;<span className="font-semibold text-[#6BA292]">Roar In Style</span>.&quot; The collection embodies inclusivity and self-expression, drawing inspiration from <span className="font-semibold text-[#6BA292]">The Tree of Life</span> — the source of life that connects and binds all lives together, irrespective of cultures, religions, genders, races, and nations.
									</p>
								</div>
								<div className="w-12 h-0.5 bg-[#6BA292] mx-auto mt-6" />
							</div>

							{/* Second Image */}
							<div className="flex justify-center">
								<img 
									src="/brands/tilted-lotus-design-3.jpg" 
									alt="Tilted Lotus collection showcase" 
									className="w-full h-auto"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* The Grand Launch */}
				<section className="relative min-h-screen flex items-center justify-center text-white overflow-hidden">
					{/* Background Image */}
					<div className="absolute inset-0">
						<img 
							src="/brands/tilted-lotus-launch.jpg" 
							alt="Tilted Lotus NYFW launch" 
							className="w-full h-full object-cover"
						/>
						<div className="absolute inset-0 bg-black/40" />
					</div>

					<div className="relative z-10 min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
						<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
							The Grand Launch
						</h2>
						<p className="text-xl sm:text-2xl font-serif italic text-[#CBB49A] tracking-wide">
							New York Fashion Week COLLECTION
						</p>
					</div>
				</section>

				{/* Tilted Lotus Client Testimonial Section */}
				<section ref={testimonialRef} className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						{/* Mobile Layout */}
						<div className="lg:hidden">
							{/* Title */}
							<div className="text-center mb-8">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Tilted Lotus Client Testimonial</h2>
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
												src="/testimonial/testimonial-1.mp4"
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
									&quot;Working with Krazy Kreators was transformative for Tilted Lotus. They didn&apos;t just understand my cultural vision — they elevated it to new heights. From the initial concept to the NYFW runway, every step was executed with precision and cultural sensitivity.&quot;
								</p>
								
								<p>
									&quot;The attention to detail in preserving South Asian artistic traditions while creating contemporary silhouettes exceeded my expectations. They truly became partners in bringing my cultural heritage to life in modern fashion.&quot;
								</p>
								
								<p>
									&quot;The end result is exactly what I envisioned: a brand that celebrates cultural diversity while maintaining contemporary appeal. Our customers love the authenticity and quality, and I couldn&apos;t be happier with the partnership.&quot;
								</p>
							</div>

							{/* Client Details */}
							<div className="pt-6 border-t border-gray-200 mt-8">
								<h3 className="text-xl font-semibold text-black mb-2">Preeti Gore</h3>
								<p className="text-[#CBB49A] font-medium">Founder, Tilted Lotus</p>
								<p className="text-gray-600 text-sm">Houston, Texas</p>
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
											src="/testimonial/testimonial-1.mp4"
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
									<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Tilted Lotus Client Testimonial</h2>
									<div className="w-16 h-0.5 bg-[#CBB49A] mb-8"></div>
								</div>
								
								<div className="space-y-6 text-lg leading-relaxed text-gray-700">
									<p className="text-black">
										&quot;Working with Krazy Kreators was transformative for Tilted Lotus. They didn&apos;t just understand my cultural vision — they elevated it to new heights. From the initial concept to the NYFW runway, every step was executed with precision and cultural sensitivity.&quot;
									</p>
									
									<p className="text-black">
										&quot;The attention to detail in preserving South Asian artistic traditions while creating contemporary silhouettes exceeded my expectations. They truly became partners in bringing my cultural heritage to life in modern fashion.&quot;
									</p>
									
									<p className="text-black">
										&quot;The end result is exactly what I envisioned: a brand that celebrates cultural diversity while maintaining contemporary appeal. Our customers love the authenticity and quality, and I couldn&apos;t be happier with the partnership.&quot;
									</p>
								</div>

								{/* Client Details */}
								<div className="pt-6 border-t border-gray-200">
									<h3 className="text-xl font-semibold text-black mb-2">Preeti Gore</h3>
									<p className="text-[#CBB49A] font-medium">Founder, Tilted Lotus</p>
									<p className="text-gray-600 text-sm">Houston, Texas</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Tilted Lotus Brand Launch Section */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-black text-white overflow-hidden">
					{/* subtle texture */}
					<div className="absolute inset-0 pointer-events-none opacity-[0.06] bg-[radial-gradient(circle_at_30%_30%,white_1px,transparent_1px)] [background-size:14px_14px]"></div>
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center">
							{/* Main Content */}
							<div className="max-w-4xl mx-auto">
								<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white mb-8">Tilted Lotus Brand Launch</h2>
								
								<div className="space-y-8">
									<div className="text-xl sm:text-2xl text-white/90 leading-relaxed">
										Tilted Lotus is now live.{" "}
										<a 
											href="https://www.tiltedlotus.com/?srsltid=AfmBOoqKfQpn8-EkzpcwNqEYFdnIwMJQSlgIdFszyNZELOPWNYnFUXJJ" 
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
											src="/brands/tilted-lotus-website.jpg" 
											alt="Tilted Lotus website" 
											className="w-full max-w-4xl h-auto object-contain rounded-lg"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* Other Case Studies Section */}
				<section className="relative py-20 sm:py-24 lg:py-32 bg-white overflow-hidden">
					<div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
						<div className="text-center mb-16">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-black mb-6">Explore Our Other Case Studies</h2>
							<p className="text-xl text-gray-600 max-w-3xl mx-auto">Discover how we've helped other brands transform their vision into reality</p>
						</div>
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
							{/* Las Loungewear Case Study */}
							<a href="/case-studies/las" className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 block">
								<div className="relative h-64 overflow-hidden">
									<img
										src="/brands/las-loungewear- coverimage.png"
										alt="Las Loungewear Case Study"
										className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
									/>
									<div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
								</div>
								<div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
									<h3 className="text-xl font-serif font-bold text-white mb-0.5 leading-tight">Las Loungewear</h3>
									<p className="text-white/90 text-xs mb-1.5 leading-tight">Premium loungewear brand</p>
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
				<section className="py-16 sm:py-20 md:py-24 bg-[#F5F2EB] relative overflow-hidden">
					{/* Subtle background pattern */}
					<div className="absolute inset-0 opacity-5">
						<div className="absolute top-10 left-10 w-32 h-32 border-2 border-[#CBB49A] transform rotate-45"></div>
						<div className="absolute bottom-10 right-10 w-24 h-24 border-2 border-[#6BA292] transform -rotate-45"></div>
						<div className="absolute top-1/2 left-1/3 w-16 h-16 border border-[#CBB49A] rounded-full"></div>
					</div>

					<div className="max-w-5xl mx-auto px-4 md:px-8 text-center relative z-10">
						{/* Enhanced Header */}
						<div className="mb-8 sm:mb-10">
							<h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-[#2D2A2E] mb-6 sm:mb-8 tracking-tight leading-tight uppercase">
								READY TO BUILD A BRAND THAT<br />
								<span className="text-[#CBB49A]">STANDS OUT?</span>
							</h2>

							{/* Corner brackets */}
							<div className="flex justify-center items-center gap-6 mb-8">
								<div className="w-16 h-0.5 bg-[#CBB49A]"></div>
								<div className="w-4 h-4 border-2 border-[#CBB49A] transform rotate-45"></div>
								<div className="w-16 h-0.5 bg-[#CBB49A]"></div>
							</div>
						</div>

						{/* Pull quote subheadline */}
						<div className="relative max-w-4xl mx-auto mb-10 sm:mb-12">
							<div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-[#6BA292]"></div>
							<p className="text-lg sm:text-xl md:text-2xl text-[#3D3846] font-medium leading-relaxed px-16 italic">
								Let&apos;s create something bold, beautiful, and unapologetically yours. Your cultural heritage deserves to be celebrated in contemporary fashion.
							</p>
							<div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-0.5 bg-[#6BA292]"></div>
						</div>

						{/* Enhanced CTA Buttons */}
						<div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center items-center">
							<Button 
								size="lg" 
								className="group bg-[#CBB49A] text-white hover:bg-[#B7A078] text-base sm:text-lg font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 border-2 border-[#CBB49A]"
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
								className="group border-2 border-[#CBB49A] text-[#CBB49A] hover:bg-[#CBB49A] hover:text-white text-base sm:text-lg font-bold px-10 sm:px-14 py-4 sm:py-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
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
