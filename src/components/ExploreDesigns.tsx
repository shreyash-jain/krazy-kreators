import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Luxury Wear",
    image: "/brands/luxury_wear.jpg",
    size: "large",
  },
  {
    name: "Resort Wear",
    image: "/brands/resort_wear.jpg",
    size: "medium",
  },
  {
    name: "Men's Wear",
    image: "/brands/mens_wear.jpg",
    size: "medium",
  },
  {
    name: "Men's Streetwear",
    image: "/brands/mens_streetwear.jpg",
    size: "large",
  },
  {
    name: "Lounge Wear",
    image: "/brands/lounge_wear.jpg",
    size: "medium",
  },
  {
    name: "Accessories",
    image: "/brands/accessories.jpg",
    size: "medium",
  },
];

export default function ExploreDesigns() {
  return (
    <section className="w-full bg-gradient-to-br from-[#CBB49A]/20 via-[#D4C4A8]/30 to-[#E8E4DD]/40 py-12 sm:py-16 md:py-20 lg:py-24 px-4 md:px-0 lg:px-0 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-50" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23CBB49A' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="max-w-[80%] mx-auto relative z-10">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
          {/* Left Column - Heading */}
          <div className="lg:sticky lg:top-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#2D2A2E] leading-tight mb-4 sm:mb-6">
              Explore our Designs
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-[#6BA292] mb-6 sm:mb-8 mx-auto lg:mx-0"></div>
            <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed mb-6 sm:mb-8 px-4 lg:px-0">
              Discover our comprehensive range of fashion categories, each crafted with precision and style. From luxury wear to casual essentials, we specialize in custom clothing production and fashion brand manufacturing across diverse styles. Our expert design team creates everything from sophisticated luxury pieces to comfortable loungewear, ensuring every garment meets the highest quality standards. Whether you&apos;re launching a premium fashion brand or expanding your clothing line, our end-to-end services cover luxury wear, resort wear, men&apos;s fashion, streetwear, loungewear, and accessories — all designed to help you create your own clothing line with confidence.
            </p>
            <Button
              variant="link"
              size="lg"
              className="text-[#6BA292] hover:text-[#5A8A7A] transition-colors duration-200 font-medium text-base sm:text-lg p-0 h-auto"
            >
              Explore Portfolio &rarr;
            </Button>
          </div>

          {/* Right Column - Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {categories.map((category, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative overflow-hidden rounded-lg sm:rounded-xl h-32 sm:h-40 md:h-48 lg:h-52 mb-2 sm:mb-3">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-center text-xs sm:text-sm md:text-base font-medium text-[#2D2A2E] uppercase tracking-wide">
                  {category.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 