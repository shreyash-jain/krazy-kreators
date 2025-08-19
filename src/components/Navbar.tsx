"use client";

import { Button } from "@/components/ui/button";
import {
	Menu,
	Palette,
	Factory,
	Infinity,
	Grid3X3,
	FolderKanban,
	Newspaper,
	FileText,
	Video,
	Building2,
	BadgeDollarSign,
	Phone,
	ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
const ContactDialog = dynamic(() => import("./ContactDialog"), { ssr: false });

const menuItems = ["Solutions", "Portfolio", "Blogs", "Resources", "Company"] as const;
type TopTab = typeof menuItems[number];

const megaContent: Record<TopTab, { title: string; desc: string; href: string; icon: React.ComponentType<{ className?: string }> }[]> = {
	Solutions: [
		{ title: "Design Services", desc: "Concepts, prints, and garment design", href: "/design-services", icon: Palette },
		{ title: "Manufacturing Services", desc: "Sampling to bulk production", href: "/manufacturing-services", icon: Factory },
		{ title: "End‑to‑End Services", desc: "From tech packs to delivery", href: "/end-to-end-services", icon: Infinity },
		{ title: "Product Categories", desc: "Tops, shirts, dresses, kidswear", href: "/#explore-designs", icon: Grid3X3 },
	],
	Portfolio: [
		{ title: "Drover Cowboy Threads", desc: "Modern westernwear case study", href: "/case-studies/drover", icon: FolderKanban },
		{ title: "Tilted Lotus", desc: "Premium apparel brand", href: "#", icon: FolderKanban },
		{ title: "Las Loungewear", desc: "Comfort-first everyday wear", href: "#", icon: FolderKanban },
		{ title: "HY Official", desc: "Lifestyle essentials", href: "#", icon: FolderKanban },
		{ title: "Badri Al Shihhi", desc: "Label development & rollout", href: "#", icon: FolderKanban },
	],
	Blogs: [
		{ title: "All Blogs", desc: "Insights on building a fashion brand", href: "#", icon: Newspaper },
	],
	Resources: [
		{ title: "Tech Packs", desc: "Download sample tech packs", href: "/#blog-and-tech-packs", icon: FileText },
		{ title: "Educational Videos", desc: "Short videos on process & quality", href: "#", icon: Video },
	],
	Company: [
		{ title: "About Us", desc: "Story, vision, and team", href: "/about", icon: Building2 },
		{ title: "Pricing", desc: "Transparent retainers & custom packs", href: "/pricing", icon: BadgeDollarSign },
		{ title: "Contact", desc: "Talk to the team", href: "/contact", icon: Phone },
	],
};

export default function Navbar() {
	const [open, setOpen] = useState(false);
	const [scrolled, setScrolled] = useState(false);
	const [activeTab, setActiveTab] = useState<TopTab | null>(null);
	const [heroInView, setHeroInView] = useState(false);
	const [contactOpen, setContactOpen] = useState(false);
	const pathname = usePathname();
	const isDroverPage = pathname === "/case-studies/drover";

	useEffect(() => {
		const onScroll = () => {
			setScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", onScroll);
		return () => window.removeEventListener("scroll", onScroll);
	}, []);

	// Detect dark hero sections to invert tab colors when at top
	useEffect(() => {
		const el = document.querySelector<HTMLElement>(".kk-hero-dark");
		if (!el) return;
		const io = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				setHeroInView(entry.isIntersecting);
			},
			{ root: null, threshold: 0.1 }
		);
		io.observe(el);
		return () => io.disconnect();
	}, []);

	const invertTabs = (isDroverPage && !scrolled) || (heroInView && !scrolled);

	return (
		<>
		<nav
			className={`w-full fixed top-0 left-0 z-30 transition-all duration-300 ${
				scrolled
					? "bg-white border-b border-[#e2d6f0] shadow-md"
					: isDroverPage
						? "bg-transparent border-none shadow-none"
						: "bg-transparent border-none shadow-none"
			}`}
			onMouseLeave={() => setActiveTab(null)}
		>
			<div className="max-w-[1200px] mx-auto flex items-center justify-between py-4 px-4 md:px-0 lg:px-0">
				{/* Logo and Company Name */}
				<div className="flex items-center gap-3">
					<Link href="/" className="block">
						<img
							src="/brands/logo.svg"
							alt="Krazy Kreators"
							className="h-10 w-auto opacity-90 hover:opacity-100 transition-opacity duration-300"
						/>
					</Link>
					<span
						className={`font-serif font-bold text-xl transition-colors ${invertTabs ? "text-white" : "text-[#2D2A2E]"}`}
					>
						Krazy Kreators
					</span>
				</div>
				{/* Desktop Menu */}
				<ul className="hidden md:flex gap-8 ml-12 text-base font-medium">
					{menuItems.map((tab) => {
						const items = megaContent[tab];
						const hasDropdown = items.length > 1;
						const baseCls = invertTabs ? "text-white hover:text-white/80" : "text-[#2D2A2E] hover:text-[#CBB49A]";
						return (
							<li key={tab} className="relative">
								{hasDropdown ? (
									<button
										onMouseEnter={() => setActiveTab(tab)}
										className={`flex items-center gap-1 ${baseCls}`}
									>
										<span style={{ color: "inherit" }}>{tab}</span>
										<ChevronDown className="w-4 h-4" />
									</button>
								) : (
									<a href={items[0].href} className={baseCls}>{tab}</a>
								)}
							</li>
						);
					})}
				</ul>
				{/* Right Buttons */}
				<div className="hidden md:flex gap-3 items-center">
					<Button
						className={`rounded-full transition-all duration-300 ${
							invertTabs
								? "bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/50"
								: "bg-[#CBB49A] text-white hover:bg-[#b7a078] transform hover:scale-105"
						}`}
						onClick={() => setContactOpen(true)}
					>
						Get In Touch
					</Button>
				</div>
				{/* Mobile Hamburger */}
				<div className="md:hidden flex items-center">
					<Menu
						className={`w-7 h-7 ${invertTabs ? "text-white" : "text-[#2D2A2E]"}`}
						onClick={() => setOpen(true)}
					/>
				</div>
			</div>

			{/* Desktop Mega Menu */}
			{activeTab && megaContent[activeTab].length > 1 && (
				<div className="hidden md:block absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[min(92vw,1100px)]">
					<div className="rounded-2xl border border-[#EEE8F6] bg-white/95 backdrop-blur shadow-xl p-5 sm:p-6">
						<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
							{megaContent[activeTab].map((it) => {
								const Icon = it.icon;
								return (
									<a key={it.title} href={it.href} className="group flex items-start gap-4 rounded-lg px-4 py-3 hover:bg-[#F8F7F4] transition-colors">
										<span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#6BA292]/10 text-[#6BA292]">
											<Icon className="w-4 h-4" />
										</span>
										<span className="flex-1 space-y-1">
											<span className="block font-semibold text-[#2D2A2E]">{it.title}</span>
											<span className="block text-sm text-[#5C5C5C]">{it.desc}</span>
										</span>
									</a>
								);
							})}
						</div>
					</div>
				</div>
			)}

			{/* Mobile Drawer */}
			{open && (
				<div className="fixed inset-0 z-40 flex justify-end">
					<div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
					<div className="relative w-64 bg-[#EDE6F5] h-full shadow-lg flex flex-col animate-slide-in">
						{/* Header with close button */}
						<div className="flex-shrink-0 p-6 pb-4">
							<button className="self-end" onClick={() => setOpen(false)}>
								<span className="text-2xl">&times;</span>
							</button>
						</div>
						
						{/* Scrollable content */}
						<div className="flex-1 overflow-y-auto px-6 pb-6">
							<div className="space-y-6">
								{menuItems.map((tab) => (
									<div key={tab} className="mb-4">
										<div className="text-sm font-semibold text-[#2D2A2E] mb-2">{tab}</div>
										<ul className="flex flex-col gap-3">
											{megaContent[tab].map((it) => {
												const Icon = it.icon;
												return (
													<li key={it.title}>
														<a href={it.href} className="flex items-start gap-4 rounded-lg p-4 hover:bg-white/60 text-[#2D2A2E]" onClick={() => setOpen(false)}>
															<span className="mt-0.5 inline-flex h-9 w-9 items-center justify-center rounded-md bg-[#6BA292]/10 text-[#6BA292]">
																<Icon className="w-4 h-4" />
															</span>
															<span className="flex-1 space-y-0.5">
																<span className="block text-sm font-medium">{it.title}</span>
																<span className="block text-xs text-[#4B4652]">{it.desc}</span>
															</span>
														</a>
													</li>
												);
											})}
										</ul>
									</div>
								))}
							</div>
						</div>
						
						{/* Footer with CTA button */}
						<div className="flex-shrink-0 p-6 pt-4 border-t border-[#D4CCE8]">
							<Button className="w-full rounded-full bg-[#CBB49A] text-white px-5 py-2 hover:bg-[#b7a078] transition-all duration-300">Get In Touch</Button>
						</div>
					</div>
				</div>
			)}
		</nav>
		{/* Contact dialog */}
		<ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
		</>
	);
} 