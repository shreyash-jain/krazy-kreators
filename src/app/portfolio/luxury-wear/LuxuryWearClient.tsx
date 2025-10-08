"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function LuxuryWearClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [contactOpen, setContactOpen] = useState(false);

  // Filter categories
  const filterCategories = [
    { id: "all", name: "All Products", count: 0 },
    { id: "top-bottoms", name: "Top Bottoms", count: 0 },
    { id: "dresses", name: "Dresses", count: 0 },
    { id: "abaya", name: "Abaya", count: 0 },
  ];

  // Portfolio products with grouped images
  const portfolioProducts = [
    // Top Bottoms - Grouped images
    {
      id: 1,
      category: "top-bottoms",
      name: "Luxury Silk Collection",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/top-bottoms/1_1.webp",
        "/portfolio/luxury-wear/top-bottoms/1_2.webp",
        "/portfolio/luxury-wear/top-bottoms/1_3.webp"
      ]
    },
    {
      id: 2,
      category: "top-bottoms",
      name: "Premium Cashmere Set",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/top-bottoms/2_1.webp",
        "/portfolio/luxury-wear/top-bottoms/2_2.webp",
        "/portfolio/luxury-wear/top-bottoms/2_3.webp"
      ]
    },
    {
      id: 3,
      category: "top-bottoms",
      name: "Designer Embroidered Collection",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/top-bottoms/3_1.webp",
        "/portfolio/luxury-wear/top-bottoms/3_2.webp",
        "/portfolio/luxury-wear/top-bottoms/3_3.webp"
      ]
    },
    {
      id: 4,
      category: "top-bottoms",
      name: "Luxury Silk Ensemble",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/top-bottoms/4_1.webp",
        "/portfolio/luxury-wear/top-bottoms/4_2.webp",
        "/portfolio/luxury-wear/top-bottoms/4_3.webp"
      ]
    },
    {
      id: 5,
      category: "top-bottoms",
      name: "Premium Wool Collection",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/top-bottoms/5_1.webp",
        "/portfolio/luxury-wear/top-bottoms/5_2.webp",
        "/portfolio/luxury-wear/top-bottoms/5_3.webp"
      ]
    },
    {
      id: 6,
      category: "top-bottoms",
      name: "Elegant Formal Wear",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/top-bottoms/6_1.webp",
        "/portfolio/luxury-wear/top-bottoms/6_2.webp",
        "/portfolio/luxury-wear/top-bottoms/6_3.webp"
      ]
    },
    {
      id: 7,
      category: "top-bottoms",
      name: "Designer Casual Set",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/top-bottoms/7_1.webp",
        "/portfolio/luxury-wear/top-bottoms/7_2.webp",
        "/portfolio/luxury-wear/top-bottoms/7_3.webp"
      ]
    },
    {
      id: 8,
      category: "top-bottoms",
      name: "Luxury Business Attire",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/top-bottoms/8_1.webp",
        "/portfolio/luxury-wear/top-bottoms/8_2.webp",
        "/portfolio/luxury-wear/top-bottoms/8_3.webp"
      ]
    },
    {
      id: 9,
      category: "top-bottoms",
      name: "Premium Evening Wear",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/top-bottoms/9_1.webp",
        "/portfolio/luxury-wear/top-bottoms/9_2.webp",
        "/portfolio/luxury-wear/top-bottoms/9_3.webp"
      ]
    },

    // Dresses - Grouped images
    {
      id: 10,
      category: "dresses",
      name: "Elegant Evening Gown",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/dresses/1_1.webp",
        "/portfolio/luxury-wear/dresses/1_2.webp",
        "/portfolio/luxury-wear/dresses/1_3.webp"
      ]
    },
    {
      id: 11,
      category: "dresses",
      name: "Designer Cocktail Dress",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/dresses/2_1.webp",
        "/portfolio/luxury-wear/dresses/2_2.webp",
        "/portfolio/luxury-wear/dresses/2_3.webp"
      ]
    },
    {
      id: 12,
      category: "dresses",
      name: "Luxury Formal Dress",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/dresses/3_1.webp",
        "/portfolio/luxury-wear/dresses/3_2.webp",
        "/portfolio/luxury-wear/dresses/3_3.webp"
      ]
    },
    {
      id: 13,
      category: "dresses",
      name: "Premium Silk Dress",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/dresses/4_1.webp",
        "/portfolio/luxury-wear/dresses/4_2.webp",
        "/portfolio/luxury-wear/dresses/4_3.webp"
      ]
    },
    {
      id: 14,
      category: "dresses",
      name: "Elegant Ball Gown",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/dresses/5_1.webp",
        "/portfolio/luxury-wear/dresses/5_2.webp",
        "/portfolio/luxury-wear/dresses/5_3.webp"
      ]
    },
    {
      id: 15,
      category: "dresses",
      name: "Designer Party Dress",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/dresses/6_1.webp",
        "/portfolio/luxury-wear/dresses/6_2.webp",
        "/portfolio/luxury-wear/dresses/6_3.webp"
      ]
    },
    {
      id: 16,
      category: "dresses",
      name: "Luxury Midi Dress",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/dresses/7_1.webp",
        "/portfolio/luxury-wear/dresses/7_2.webp",
        "/portfolio/luxury-wear/dresses/7_3.webp"
      ]
    },
    {
      id: 17,
      category: "dresses",
      name: "Premium Maxi Dress",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/dresses/8_1.webp",
        "/portfolio/luxury-wear/dresses/8_2.webp",
        "/portfolio/luxury-wear/dresses/8_3.webp"
      ]
    },
    {
      id: 18,
      category: "dresses",
      name: "Elegant A-Line Dress",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/dresses/9_1.webp",
        "/portfolio/luxury-wear/dresses/9_2.webp",
        "/portfolio/luxury-wear/dresses/9_3.webp"
      ]
    },

    // Abaya - Grouped images
    {
      id: 19,
      category: "abaya",
      name: "Luxury Embroidered Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badria-al-shihhi-logo.png",
      images: [
        "/portfolio/luxury-wear/abaya/1_1.webp",
        "/portfolio/luxury-wear/abaya/1_2.webp",
        "/portfolio/luxury-wear/abaya/1_3.webp"
      ]
    },
    {
      id: 20,
      category: "abaya",
      name: "Premium Silk Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/2_1.webp",
        "/portfolio/luxury-wear/abaya/2_2.webp",
        "/portfolio/luxury-wear/abaya/2_3.webp"
      ]
    },
    {
      id: 21,
      category: "abaya",
      name: "Designer Modern Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/3_1.webp",
        "/portfolio/luxury-wear/abaya/3_2.webp",
        "/portfolio/luxury-wear/abaya/3_3.webp"
      ]
    },
    {
      id: 22,
      category: "abaya",
      name: "Elegant Traditional Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/4_1.webp",
        "/portfolio/luxury-wear/abaya/4_2.webp",
        "/portfolio/luxury-wear/abaya/4_3.webp"
      ]
    },
    {
      id: 23,
      category: "abaya",
      name: "Luxury Evening Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/5_1.webp",
        "/portfolio/luxury-wear/abaya/5_2.webp",
        "/portfolio/luxury-wear/abaya/5_3.webp"
      ]
    },
    {
      id: 24,
      category: "abaya",
      name: "Premium Casual Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/6_1.webp",
        "/portfolio/luxury-wear/abaya/6_2.webp",
        "/portfolio/luxury-wear/abaya/6_3.webp"
      ]
    },
    {
      id: 25,
      category: "abaya",
      name: "Designer Formal Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/7_1.webp",
        "/portfolio/luxury-wear/abaya/7_2.webp",
        "/portfolio/luxury-wear/abaya/7_3.webp"
      ]
    },
    {
      id: 26,
      category: "abaya",
      name: "Elegant Wedding Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/8_1.webp",
        "/portfolio/luxury-wear/abaya/8_2.webp",
        "/portfolio/luxury-wear/abaya/8_3.webp"
      ]
    },
    {
      id: 27,
      category: "abaya",
      name: "Luxury Party Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/9_1.webp",
        "/portfolio/luxury-wear/abaya/9_2.webp",
        "/portfolio/luxury-wear/abaya/9_3.webp"
      ]
    },
    {
      id: 28,
      category: "abaya",
      name: "Premium Business Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/10_1.webp",
        "/portfolio/luxury-wear/abaya/10_2.webp",
        "/portfolio/luxury-wear/abaya/10_3.webp"
      ]
    },
    {
      id: 29,
      category: "abaya",
      name: "Designer Weekend Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/11_1.webp",
        "/portfolio/luxury-wear/abaya/11_2.webp",
        "/portfolio/luxury-wear/abaya/11_3.webp"
      ]
    },
    {
      id: 30,
      category: "abaya",
      name: "Elegant Special Occasion Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/12_1.webp",
        "/portfolio/luxury-wear/abaya/12_2.webp",
        "/portfolio/luxury-wear/abaya/12_3.webp"
      ]
    },
    {
      id: 31,
      category: "abaya",
      name: "Luxury Holiday Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/13_1.webp",
        "/portfolio/luxury-wear/abaya/13_2.webp",
        "/portfolio/luxury-wear/abaya/13_3.webp"
      ]
    },
    {
      id: 32,
      category: "abaya",
      name: "Premium Evening Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/14_1.webp",
        "/portfolio/luxury-wear/abaya/14_2.webp",
        "/portfolio/luxury-wear/abaya/14_3.webp"
      ]
    },
    {
      id: 33,
      category: "abaya",
      name: "Designer Classic Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/15_1.webp",
        "/portfolio/luxury-wear/abaya/15_2.webp",
        "/portfolio/luxury-wear/abaya/15_3.webp"
      ]
    },
    {
      id: 34,
      category: "abaya",
      name: "Elegant Modern Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/16_1.webp",
        "/portfolio/luxury-wear/abaya/16_2.webp",
        "/portfolio/luxury-wear/abaya/16_3.webp"
      ]
    },
    {
      id: 35,
      category: "abaya",
      name: "Luxury Contemporary Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/17_1.webp",
        "/portfolio/luxury-wear/abaya/17_2.webp",
        "/portfolio/luxury-wear/abaya/17_3.webp"
      ]
    },
    {
      id: 36,
      category: "abaya",
      name: "Premium Traditional Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/18_1.webp",
        "/portfolio/luxury-wear/abaya/18_2.webp",
        "/portfolio/luxury-wear/abaya/18_3.webp"
      ]
    },
    {
      id: 37,
      category: "abaya",
      name: "Designer Festive Abaya",
      brandName: "Badria Al Shihhi",
      brandLogo: "/brands/badri-al-shihhi.png",
      images: [
        "/portfolio/luxury-wear/abaya/19_1.webp",
        "/portfolio/luxury-wear/abaya/19_2.webp",
        "/portfolio/luxury-wear/abaya/19_3.webp"
      ]
    }
  ];

  // Calculate counts for each category
  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = { all: portfolioProducts.length };
    filterCategories.slice(1).forEach(category => {
      counts[category.id] = portfolioProducts.filter(product => product.category === category.id).length;
    });
    return counts;
  };

  const categoryCounts = getCategoryCounts();

  // Filter products based on active filter
  const filteredProducts = activeFilter === "all" 
    ? portfolioProducts 
    : portfolioProducts.filter(product => product.category === activeFilter);

  // ProductCard component
  const ProductCard = ({ product }: { product: { images: string[]; brandName: string; category: string; brandLogo?: string; name: string } }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    // Auto-advance internal carousel every 4 seconds
    useEffect(() => {
      if (product.images.length <= 1) return;
      
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % product.images.length);
      }, 4000);
      
      return () => clearInterval(interval);
    }, [product.images.length]);

    // Manual navigation for internal carousel
    const nextImage = () => {
      if (product.images.length <= 1) return;
      setCurrentImageIndex(prev => (prev + 1) % product.images.length);
    };

    const prevImage = () => {
      if (product.images.length <= 1) return;
      setCurrentImageIndex(prev => (prev - 1 + product.images.length) % product.images.length);
    };

    const goToImage = (index: number) => {
      setCurrentImageIndex(index);
    };

    return (
      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
        <div className="relative h-96 sm:h-[28rem] md:h-[30rem] lg:h-[26rem] overflow-hidden transform -skew-y-1">
          {/* Image Carousel */}
          <div className="relative w-full h-full">
            <div 
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {product.images.map((image: string, index: number) => (
                <div key={index} className="w-full flex-shrink-0 relative transform skew-y-1">
                  <Image
                    src={image}
                    alt={`Product Image ${index + 1}`}
                    fill
                    className="object-cover"
                    style={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden'
                    }}
                    onLoad={() => {
                      if (typeof window !== 'undefined') {
                        const img = document.querySelector(`img[src="${image}"]`) as HTMLImageElement;
                        if (img) {
                          img.style.opacity = '1';
                        }
                      }
                    }}
                  />
                </div>
              ))}
            </div>
            
            {/* Category chip */}
            <div className="absolute top-4 right-4">
              <span className="inline-block px-2 py-1 bg-white/90 text-[#2D2A2E] text-xs font-medium rounded-full border border-white/20 shadow-lg backdrop-blur-sm">
                {filterCategories.find(cat => cat.id === product.category)?.name}
              </span>
            </div>

            {/* Navigation Arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2D2A2E] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2D2A2E] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
          
          {/* Dots Indicator */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
              {product.images.map((_: string, index: number) => (
                <button
                  key={index}
                  onClick={() => goToImage(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? 'bg-white scale-125' 
                      : 'bg-white/50 hover:bg-white/75'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          )}
        </div>
        
        {/* Product Info */}
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#2D2A2E] group-hover:text-[#CBB49A] transition-colors">
              {product.brandName}
            </h3>
            {product.brandLogo && (
              <Image
                src={product.brandLogo}
                alt={`${product.brandName} Logo`}
                width={product.brandLogo === "/brands/badri-al-shihhi.png" ? 48 : 32}
                height={product.brandLogo === "/brands/badri-al-shihhi.png" ? 48 : 32}
                className="object-contain"
                style={{
                  WebkitTransform: 'translateZ(0)',
                  transform: 'translateZ(0)',
                  WebkitBackfaceVisibility: 'hidden',
                  backfaceVisibility: 'hidden'
                }}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-br from-[#F8F7F4] to-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/brands/luxury_wear.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D2A2E] mb-6">
              Luxury Wear Portfolio
            </h1>
            <p className="text-lg sm:text-xl text-[#666666] max-w-3xl mx-auto mb-8">
              Exquisite luxury fashion pieces that define elegance and sophistication with premium materials and craftsmanship.
            </p>
            <div className="w-16 h-0.5 bg-[#CBB49A] mx-auto mb-8"></div>
          </div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-[#ECE9E2]">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-[#CBB49A]" />
              <span className="text-lg font-semibold text-[#2D2A2E]">Filter by Category</span>
            </div>
            
            <div className="flex flex-wrap gap-2 sm:gap-3">
              {filterCategories.map((category) => (
                 <button
                   key={category.id}
                   onClick={() => setActiveFilter(category.id)}
                   className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                     activeFilter === category.id
                       ? "bg-[#CBB49A] text-white shadow-md"
                       : "bg-[#F8F7F4] text-[#2D2A2E] hover:bg-[#CBB49A]/10"
                   }`}
                 >
                   {category.name}
                   {categoryCounts[category.id] > 0 && (
                     <span className={`ml-2 text-xs ${
                       activeFilter === category.id ? "text-white opacity-75" : "text-[#2D2A2E] opacity-75"
                     }`}>
                       ({categoryCounts[category.id]})
                     </span>
                   )}
                 </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Products Grid */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-[#666666]">No products found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Explore Our Other Designs Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-4">
              Explore Our Other Designs
            </h2>
            <p className="text-lg text-[#666666] max-w-2xl mx-auto">
              Discover our diverse portfolio of fashion categories, each crafted with precision and style.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Men's Wear */}
            <Link href="/portfolio/mens-wear" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/brands/mens_wear.jpg"
                    alt="Men's Wear"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2D2A2E] group-hover:text-[#CBB49A] transition-colors">
                    Men&apos;s Wear
                  </h3>
                  <p className="text-[#666666] text-sm mt-2">
                    Classic menswear and formal attire
                  </p>
                </div>
              </div>
            </Link>

            {/* Men's Streetwear */}
            <Link href="/portfolio/mens-streetwear" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/brands/mens_streetwear.jpg"
                    alt="Men's Streetwear"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2D2A2E] group-hover:text-[#CBB49A] transition-colors">
                    Men&apos;s Streetwear
                  </h3>
                  <p className="text-[#666666] text-sm mt-2">
                    Urban and contemporary street fashion
                  </p>
                </div>
              </div>
            </Link>

            {/* Resort Wear */}
            <Link href="/portfolio/resort-wear" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/brands/resort_wear.jpg"
                    alt="Resort Wear"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2D2A2E] group-hover:text-[#CBB49A] transition-colors">
                    Resort Wear
                  </h3>
                  <p className="text-[#666666] text-sm mt-2">
                    Vacation and leisure clothing
                  </p>
                </div>
              </div>
            </Link>

            {/* Loungewear */}
            <Link href="/portfolio/loungewear" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/brands/lounge_wear.jpg"
                    alt="Loungewear"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2D2A2E] group-hover:text-[#CBB49A] transition-colors">
                    Loungewear
                  </h3>
                  <p className="text-[#666666] text-sm mt-2">
                    Comfortable home and casual wear
                  </p>
                </div>
              </div>
            </Link>

            {/* Accessories */}
            <Link href="/portfolio/accessories" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/brands/accessories.jpg"
                    alt="Accessories"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    style={{
                      WebkitTransform: 'translateZ(0)',
                      transform: 'translateZ(0)',
                      WebkitBackfaceVisibility: 'hidden',
                      backfaceVisibility: 'hidden'
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#2D2A2E] group-hover:text-[#CBB49A] transition-colors">
                    Accessories
                  </h3>
                  <p className="text-[#666666] text-sm mt-2">
                    Fashion accessories and add-ons
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F8F7F4] to-[#FAF9F7]">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-[#2D2A2E] mb-4">
            Ready to Create Your Luxury Collection?
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-8">
            Let&apos;s discuss your vision and bring your luxury fashion ideas to life with our expert manufacturing services.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setContactOpen(true)}
              className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              className="border-[#F8F7F4] text-[#2D2A2E] hover:bg-[#F8F7F4] hover:text-[#2D2A2E] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300"
              onClick={() => setContactOpen(true)}
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Get Consultation
            </Button>
          </div>
        </div>
      </section>

      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      <Footer />
    </div>
  );
}
