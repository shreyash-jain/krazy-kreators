"use client";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Hammer,
  Package,
  Boxes,
  Tag,
  Calendar,
  BarChart2,
  Sparkles,
} from "lucide-react";

const navItems = [
  { label: "Sell", icon: ShoppingCart },
  { label: "Make", icon: Hammer },
  { label: "Buy", icon: Package },
  { label: "Stock", icon: Boxes },
  { label: "Items", icon: Tag },
  { label: "Plan", icon: Calendar },
  { label: "Insights", icon: BarChart2 },
  { label: "Create", icon: Sparkles },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[#EDE6F5] border-t border-[#e2d6f0] flex justify-around items-center py-2 z-30 md:hidden">
      {navItems.map(({ label, icon: Icon }) => (
        <Button
          key={label}
          variant="ghost"
          size="icon"
          className="flex flex-col items-center justify-center rounded-full p-2 hover:bg-[#CBB49A]/20 group"
        >
          <Icon className="w-6 h-6 mb-1 text-[#2D2A2E] group-hover:text-[#CBB49A]" />
          <span className="text-xs font-medium text-[#2D2A2E] group-hover:text-[#CBB49A]">{label}</span>
        </Button>
      ))}
    </nav>
  );
} 