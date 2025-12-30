"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, MessageSquare, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import ContactDialog from "@/components/ContactDialog";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { usePortfolioSync } from "@/lib/PortfolioSyncContext";
import ImageModal from "@/components/ImageModal";

export default function LoungewearClient() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [contactOpen, setContactOpen] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [modalProductName, setModalProductName] = useState("");
  const [modalCategoryName, setModalCategoryName] = useState("");

  const filterCategories = [
    { id: "all", name: "All Products", count: 0 },
    { id: "top", name: "Top", count: 0 },
    { id: "jacket-and-dress", name: "Jacket and Dress", count: 0 },
    { id: "compression", name: "Compression", count: 0 },
    { id: "bottom", name: "Bottom", count: 0 },
  ];

  // Portfolio products with grouped images (LAS Loungewear)
  const portfolioProducts = [
    // Top
    {
      id: 1,
      category: "top",
      name: "LAS Loungewear Top",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/top/1.webp"
      ]
    },
    {
      id: 2,
      category: "top",
      name: "LAS Loungewear Top Set",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/top/2_1.webp",
        "/portfolio/loungewear/top/2_2.webp"
      ]
    },

    // Jacket and Dress
    {
      id: 3,
      category: "jacket-and-dress",
      name: "Lounge Dress Set 1",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/1_1.webp",
        "/portfolio/loungewear/jacket-and-dress/1_2.webp"
      ]
    },
    {
      id: 4,
      category: "jacket-and-dress",
      name: "Lounge Dress Set 2",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/2_1.webp",
        "/portfolio/loungewear/jacket-and-dress/2_2.webp"
      ]
    },
    {
      id: 5,
      category: "jacket-and-dress",
      name: "Lounge Dress",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/3.webp"
      ]
    },
    {
      id: 6,
      category: "jacket-and-dress",
      name: "Lounge Jacket",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/4.webp"
      ]
    },
    {
      id: 7,
      category: "jacket-and-dress",
      name: "Lounge Set 5",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/5_1.webp",
        "/portfolio/loungewear/jacket-and-dress/5_2.webp"
      ]
    },
    {
      id: 8,
      category: "jacket-and-dress",
      name: "Lounge Set 6",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/6_1.webp",
        "/portfolio/loungewear/jacket-and-dress/6_2.webp"
      ]
    },
    {
      id: 9,
      category: "jacket-and-dress",
      name: "Lounge Set 7",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/7_1.webp",
        "/portfolio/loungewear/jacket-and-dress/7_2.webp"
      ]
    },
    {
      id: 10,
      category: "jacket-and-dress",
      name: "Lounge Set 8",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/8_1.webp",
        "/portfolio/loungewear/jacket-and-dress/8_2.webp"
      ]
    },
    {
      id: 11,
      category: "jacket-and-dress",
      name: "Lounge Dress 9",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/9.webp"
      ]
    },
    {
      id: 12,
      category: "jacket-and-dress",
      name: "Lounge Set 10",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/jacket-and-dress/10_1.webp",
        "/portfolio/loungewear/jacket-and-dress/10_2.webp"
      ]
    },

    // Compression
    {
      id: 13,
      category: "compression",
      name: "Compression Set 1",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/compression/1_1.webp",
        "/portfolio/loungewear/compression/1_2.webp"
      ]
    },
    {
      id: 14,
      category: "compression",
      name: "Compression Set 2",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/compression/2_1.webp",
        "/portfolio/loungewear/compression/2_2.webp"
      ]
    },
    {
      id: 15,
      category: "compression",
      name: "Compression Set 3",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/compression/3_1.webp",
        "/portfolio/loungewear/compression/3_2.webp"
      ]
    },
    {
      id: 16,
      category: "compression",
      name: "Compression Set 4",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/compression/4_1.webp",
        "/portfolio/loungewear/compression/4_2.webp"
      ]
    },

    // Bottom
    {
      id: 17,
      category: "bottom",
      name: "Lounge Bottom 1",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/bottom/1.webp"
      ]
    },
    {
      id: 18,
      category: "bottom",
      name: "Lounge Bottom Set 2",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/bottom/2_1.webp",
        "/portfolio/loungewear/bottom/2_2.webp"
      ]
    },
    {
      id: 19,
      category: "bottom",
      name: "Lounge Bottom 3",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/bottom/3.webp"
      ]
    },
    {
      id: 20,
      category: "bottom",
      name: "Lounge Bottom 4",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/bottom/4.webp"
      ]
    },
    {
      id: 21,
      category: "bottom",
      name: "Lounge Bottom Set 5",
      brandName: "LAS Loungewear",
      brandLogo: "/brands/las-loungewear.png",
      images: [
        "/portfolio/loungewear/bottom/5_1.webp",
        "/portfolio/loungewear/bottom/5_2.webp"
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

  // Function to open image modal
  const openImageModal = (images: string[], currentIndex: number, productName: string, categoryName: string) => {
    setModalImages(images);
    setModalCurrentIndex(currentIndex);
    setModalProductName(productName);
    setModalCategoryName(categoryName);
    setImageModalOpen(true);
  };

  // Product Card Component with internal carousel
  const ProductCard = ({ product }: { product: { images: string[]; brandName: string; category: string; brandLogo?: string; name: string } }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const { globalImageIndex } = usePortfolioSync();

    // Sync with global index when not hovered
    useEffect(() => {
      if (!isHovered && product.images.length > 1) {
        setCurrentImageIndex(globalImageIndex % product.images.length);
      }
    }, [globalImageIndex, isHovered, product.images.length]);

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
      <div 
        className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:scale-105"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div 
          className="relative h-96 sm:h-[28rem] md:h-[30rem] lg:h-[26rem] overflow-hidden transform -skew-y-1 cursor-pointer"
          onClick={() => openImageModal(product.images, currentImageIndex, product.name, filterCategories.find(cat => cat.id === product.category)?.name || product.name)}
        >
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
                width={32}
                height={32}
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
        <div className="absolute inset-0 bg-[url('/brands/lounge_wear.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D2A2E] mb-6">
              Loungewear Portfolio
            </h1>
            <p className="text-lg sm:text-xl text-[#666666] max-w-3xl mx-auto mb-8">
              Comfortable and stylish loungewear that combines relaxation with elegance for your everyday comfort.
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
                    Elegant vacation and resort clothing
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
      <section className="py-16 sm:py-20 lg:py-24 bg-[#F8F7F4]">
        <div className="min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#2D2A2E] mb-6">
              Ready to Create Your Perfect Loungewear?
            </h2>
            <p className="text-lg text-[#666666] mb-8">
              Let&apos;s discuss your loungewear vision and bring your comfort-focused designs to life.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setContactOpen(true)}
                className="bg-[#CBB49A] hover:bg-[#B8A088] text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Start Your Project
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                onClick={() => setContactOpen(true)}
                variant="outline"
                className="border-[#CBB49A] text-[#CBB49A] hover:bg-[#CBB49A] hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
              >
                <MessageSquare className="mr-2 w-5 h-5" />
                Get Consultation
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Dialog */}
      <ContactDialog open={contactOpen} onClose={() => setContactOpen(false)} />
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        images={modalImages}
        currentIndex={modalCurrentIndex}
        onIndexChange={setModalCurrentIndex}
        productName={modalProductName}
        categoryName={modalCategoryName}
      />
      
      {/* Footer */}
      <Footer />
    </div>
  );
}