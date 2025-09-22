"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

export default function MensStreetwearClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  // const [currentSlide, setCurrentSlide] = useState(0);

  const filterCategories = [
    { id: "all", name: "All Products", count: 0 },
    { id: "casual-shirt", name: "Casual Shirts", count: 0 },
    { id: "embriodered-shirts", name: "Embroidered Shirts", count: 0 },
    { id: "sweat-shirts", name: "Sweat Shirts", count: 0 },
  ];

  // Portfolio products with grouped images (2 images per product)
  const portfolioProducts = [
    // Casual Shirts - 8 products (16 images grouped in pairs)
    {
      id: 1,
      category: "casual-shirt",
      name: "Classic Casual Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/casual-shirt/1.webp",
        "/portfolio/mens-streetwear/casual-shirt/2.webp"
      ]
    },
    {
      id: 2,
      category: "casual-shirt",
      name: "Modern Casual Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/casual-shirt/3.webp",
        "/portfolio/mens-streetwear/casual-shirt/4.webp"
      ]
    },
    {
      id: 3,
      category: "casual-shirt",
      name: "Premium Casual Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/casual-shirt/5.webp",
        "/portfolio/mens-streetwear/casual-shirt/6.webp"
      ]
    },
    {
      id: 4,
      category: "casual-shirt",
      name: "Designer Casual Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/casual-shirt/7.webp",
        "/portfolio/mens-streetwear/casual-shirt/8.webp"
      ]
    },
    {
      id: 5,
      category: "casual-shirt",
      name: "Trendy Casual Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/casual-shirt/9.webp",
        "/portfolio/mens-streetwear/casual-shirt/10.webp"
      ]
    },
    {
      id: 6,
      category: "casual-shirt",
      name: "Vintage Casual Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/casual-shirt/11.webp",
        "/portfolio/mens-streetwear/casual-shirt/12.webp"
      ]
    },
    {
      id: 7,
      category: "casual-shirt",
      name: "Contemporary Casual Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/casual-shirt/13.webp",
        "/portfolio/mens-streetwear/casual-shirt/14.webp"
      ]
    },
    {
      id: 8,
      category: "casual-shirt",
      name: "Elite Casual Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/casual-shirt/15.webp",
        "/portfolio/mens-streetwear/casual-shirt/16.webp"
      ]
    },
    // Embroidered Shirts - 4 products (8 images grouped in pairs)
    {
      id: 9,
      category: "embriodered-shirts",
      name: "Artisan Embroidered Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/embriodered-shirts/1.webp",
        "/portfolio/mens-streetwear/embriodered-shirts/2.webp"
      ]
    },
    {
      id: 10,
      category: "embriodered-shirts",
      name: "Luxury Embroidered Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/embriodered-shirts/3.webp",
        "/portfolio/mens-streetwear/embriodered-shirts/4.webp"
      ]
    },
    {
      id: 11,
      category: "embriodered-shirts",
      name: "Heritage Embroidered Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/embriodered-shirts/5.webp",
        "/portfolio/mens-streetwear/embriodered-shirts/6.webp"
      ]
    },
    {
      id: 12,
      category: "embriodered-shirts",
      name: "Modern Embroidered Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/embriodered-shirts/7.webp",
        "/portfolio/mens-streetwear/embriodered-shirts/8.webp"
      ]
    },
    // Sweat Shirts - 3 products (6 images grouped in pairs)
    {
      id: 13,
      category: "sweat-shirts",
      name: "Comfort Sweat Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/sweat-shirts/1.webp",
        "/portfolio/mens-streetwear/sweat-shirts/2.webp"
      ]
    },
    {
      id: 14,
      category: "sweat-shirts",
      name: "Athletic Sweat Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/sweat-shirts/3.webp",
        "/portfolio/mens-streetwear/sweat-shirts/4.webp"
      ]
    },
    {
      id: 15,
      category: "sweat-shirts",
      name: "Urban Sweat Shirt",
      brandName: "HY Official",
      images: [
        "/portfolio/mens-streetwear/sweat-shirts/5.webp",
        "/portfolio/mens-streetwear/sweat-shirts/6.webp"
      ]
    },
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

  // Auto-advance carousel every 5 seconds
  // useEffect(() => {
  //   if (filteredProducts.length > 0) {
  //     const interval = setInterval(() => {
  //       setCurrentSlide((prev) => (prev + 1) % filteredProducts.length);
  //     }, 5000);
  //     return () => clearInterval(interval);
  //   }
  // }, [filteredProducts.length]);

  // Manual navigation
  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % filteredProducts.length);
  // };

  // const prevSlide = () => {
  //   setCurrentSlide((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  // };

  // Product Card Component with internal carousel
  const ProductCard = ({ product }: { product: { images: string[]; brandName: string; category: string } }) => {
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
        <div className="relative h-80 overflow-hidden">
          {/* Image Carousel */}
          <div className="relative w-full h-full">
            <div 
              className="flex h-full transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
            >
              {product.images.map((image: string, index: number) => (
                <div key={index} className="w-full flex-shrink-0 relative">
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
            
            {/* Clean image without text overlays */}
            
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
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2D2A2E] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm opacity-0 group-hover:opacity-100"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#2D2A2E] p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 backdrop-blur-sm opacity-0 group-hover:opacity-100"
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
          <h3 className="text-xl font-bold text-[#2D2A2E] group-hover:text-[#CBB49A] transition-colors">
            {product.brandName}
          </h3>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-br from-[#F8F7F4] to-white overflow-hidden">
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D2A2E] mb-6">
              Men&apos;s Streetwear Portfolio
            </h1>
            <p className="text-lg sm:text-xl text-[#666666] max-w-3xl mx-auto mb-8">
              Urban and casual menswear that defines modern street style with comfort and attitude.
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
            <div className="text-center py-16">
              <div className="w-16 h-16 bg-[#F8F7F4] rounded-full flex items-center justify-center mx-auto mb-4">
                <Filter className="w-8 h-8 text-[#CBB49A]" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D2A2E] mb-2">No products found</h3>
              <p className="text-[#666666]">Try selecting a different category to see more products.</p>
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
            {/* Luxury Wear */}
            <Link href="/portfolio/luxury-wear" className="group">
              <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105">
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src="/brands/luxury_wear.jpg"
                    alt="Luxury Wear"
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
                    Luxury Wear
                  </h3>
                  <p className="text-[#666666] text-sm mt-2">
                    Premium high-end fashion pieces
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
      <section className="py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-[#F8F7F4] to-white">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-6">
            Ready to Create Your Streetwear Brand?
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-8">
            Let&apos;s work together to bring your streetwear vision to life with our premium manufacturing services.
          </p>
           <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Button
               className="bg-[#CBB49A] text-white hover:bg-[#b7a078] px-8 py-3 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
               onClick={() => setContactOpen(true)}
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

      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}