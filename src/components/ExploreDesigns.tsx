import { Button } from "@/components/ui/button";

const categories = [
  {
    name: "Tops",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop&crop=center",
    size: "medium",
  },
  {
    name: "Tees & Polos",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop&crop=center",
    size: "large",
  },
  {
    name: "Shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop&crop=center",
    size: "medium",
  },
  {
    name: "Dresses",
    image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop&crop=center",
    size: "large",
  },
  {
    name: "Sweatshirts",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=500&fit=crop&crop=center",
    size: "medium",
  },
  {
    name: "Kidswear",
    image: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=400&h=500&fit=crop&crop=center",
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
      <div className="max-w-[1200px] mx-auto relative z-10">
        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Left Column - Heading */}
          <div className="lg:sticky lg:top-8 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-serif font-bold text-[#2D2A2E] leading-tight mb-4 sm:mb-6">
              Explore<br />our<br />Designs
            </h2>
            <div className="w-12 sm:w-16 h-0.5 bg-[#6BA292] mb-6 sm:mb-8 mx-auto lg:mx-0"></div>
            <p className="text-sm sm:text-base md:text-lg text-[#3D3846] leading-relaxed mb-6 sm:mb-8 px-4 lg:px-0">
              Discover our comprehensive range of fashion categories, each crafted with precision and style.
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
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