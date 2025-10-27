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

export default function MensWearClient() {
  const [contactOpen, setContactOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [modalImages, setModalImages] = useState<string[]>([]);
  const [modalCurrentIndex, setModalCurrentIndex] = useState(0);
  const [modalProductName, setModalProductName] = useState("");
  const [modalCategoryName, setModalCategoryName] = useState("");

  const filterCategories = [
    { id: "all", name: "All Products", count: 0 },
    { id: "shirt", name: "Shirts", count: 0 },
    { id: "t-shirt", name: "T-Shirts", count: 0 },
    { id: "denim", name: "Denim", count: 0 },
    { id: "winter-wear", name: "Winter Wear", count: 0 },
  ];

  // Portfolio products with grouped images
  const portfolioProducts = [
    // Shirts - Grouped images
    {
      id: 1,
      category: "shirt",
      name: "Classic Dress Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/1.png",
        "/portfolio/mens-wear/shirt/2.png"
      ]
    },
    {
      id: 2,
      category: "shirt",
      name: "Formal Business Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/3.png",
        "/portfolio/mens-wear/shirt/4.png"
      ]
    },
    {
      id: 3,
      category: "shirt",
      name: "Casual Button-Up",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/5.png",
        "/portfolio/mens-wear/shirt/6.png"
      ]
    },
    {
      id: 4,
      category: "shirt",
      name: "Oxford Shirt Collection",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/7.png",
        "/portfolio/mens-wear/shirt/8.png",
        "/portfolio/mens-wear/shirt/9.png"
      ]
    },
    // Shirts - Single images (no pagination)
    {
      id: 5,
      category: "shirt",
      name: "Premium Dress Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/10.png"
      ]
    },
    {
      id: 6,
      category: "shirt",
      name: "Linen Blend Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/11.png"
      ]
    },
    {
      id: 7,
      category: "shirt",
      name: "Cotton Oxford Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/12.png"
      ]
    },
    {
      id: 8,
      category: "shirt",
      name: "Business Casual Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/13.png"
      ]
    },
    {
      id: 9,
      category: "shirt",
      name: "Formal White Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/14.png"
      ]
    },
    {
      id: 10,
      category: "shirt",
      name: "Striped Dress Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/15.png"
      ]
    },
    {
      id: 11,
      category: "shirt",
      name: "Checkered Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/16.png"
      ]
    },
    {
      id: 12,
      category: "shirt",
      name: "Denim Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/17.png"
      ]
    },
    {
      id: 13,
      category: "shirt",
      name: "Plaid Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/18.png"
      ]
    },
    {
      id: 14,
      category: "shirt",
      name: "Polo Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/19.png"
      ]
    },
    {
      id: 15,
      category: "shirt",
      name: "Henley Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/20.png"
      ]
    },
    {
      id: 16,
      category: "shirt",
      name: "Turtleneck Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/21.png"
      ]
    },
    {
      id: 17,
      category: "shirt",
      name: "V-Neck Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/22.png"
      ]
    },
    {
      id: 18,
      category: "shirt",
      name: "Crew Neck Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/23.png"
      ]
    },
    {
      id: 19,
      category: "shirt",
      name: "Long Sleeve Tee",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/24.png"
      ]
    },
    {
      id: 20,
      category: "shirt",
      name: "Short Sleeve Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/25.png"
      ]
    },
    {
      id: 21,
      category: "shirt",
      name: "Sleeveless Shirt",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/26.png"
      ]
    },
    {
      id: 22,
      category: "shirt",
      name: "Tank Top",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/shirt/27.png"
      ]
    },

    // T-Shirts - Single images (no pagination)
    {
      id: 23,
      category: "t-shirt",
      name: "Classic Cotton Tee",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/t-shirt/image%20(36).png"
      ]
    },
    {
      id: 24,
      category: "t-shirt",
      name: "Vintage Graphic Tee",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/t-shirt/image%20(37).png"
      ]
    },
    {
      id: 25,
      category: "t-shirt",
      name: "Premium Cotton Tee",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/t-shirt/image%20(38).png"
      ]
    },
    {
      id: 26,
      category: "t-shirt",
      name: "Oversized Comfort Tee",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/t-shirt/image%20(39).png"
      ]
    },

    // Denim - Grouped images
    {
      id: 27,
      category: "denim",
      name: "Classic Blue Jeans",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/denim/image%20(40).png",
        "/portfolio/mens-wear/denim/image%20(41).png"
      ]
    },
    {
      id: 28,
      category: "denim",
      name: "Slim Fit Jeans",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/denim/image%20(42).png",
        "/portfolio/mens-wear/denim/image%20(43).png"
      ]
    },
    {
      id: 29,
      category: "denim",
      name: "Vintage Wash Jeans",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/denim/image%20(44).png",
        "/portfolio/mens-wear/denim/image%20(45).png"
      ]
    },
    {
      id: 30,
      category: "denim",
      name: "Raw Denim Jeans",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/denim/image%20(46).png",
        "/portfolio/mens-wear/denim/image%20(47).png"
      ]
    },

    // Winter Wear - Single images (no pagination)
    {
      id: 31,
      category: "winter-wear",
      name: "Wool Blend Jacket",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/winter-wear/image%20(48).png"
      ]
    },
    {
      id: 32,
      category: "winter-wear",
      name: "Thermal Hoodie",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/winter-wear/image%20(49).png"
      ]
    },
    {
      id: 33,
      category: "winter-wear",
      name: "Fleece Pullover",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/winter-wear/image%20(50).png"
      ]
    },
    {
      id: 34,
      category: "winter-wear",
      name: "Insulated Parka",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/winter-wear/image%20(51).png"
      ]
    },
    {
      id: 35,
      category: "winter-wear",
      name: "Winter Coat",
      brandName: "Drover Cowboy Threads",
      brandLogo: "/brands/drover.png",
      images: [
        "/portfolio/mens-wear/winter-wear/image%20(52).png"
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
    <main className="w-full bg-[#FAF9F7]">
      <h1 className="sr-only">Men&apos;s Wear Portfolio - Drover Cowboy Threads</h1>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 sm:pt-36 sm:pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-br from-[#F8F7F4] to-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/brands/mens_wear.jpg')] bg-cover bg-center opacity-10"></div>
        <div className="relative min-w-[80%] lg:max-w-[80%] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-[#2D2A2E] mb-6">
              Men&apos;s Wear Portfolio
            </h1>
            <p className="text-lg sm:text-xl text-[#666666] max-w-3xl mx-auto mb-8">
              Classic and contemporary menswear that defines modern style with quality and sophistication.
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
            Ready to Create Your Collection?
          </h2>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto mb-8">
            Let&apos;s discuss your vision and bring your men&apos;s wear ideas to life with our expert manufacturing services.
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
      <ImageModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        images={modalImages}
        currentIndex={modalCurrentIndex}
        onIndexChange={setModalCurrentIndex}
        productName={modalProductName}
        categoryName={modalCategoryName}
      />
      <Footer />
    </main>
  );
}
