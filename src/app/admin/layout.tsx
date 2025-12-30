"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, Users, FileText, LogOut, Loader2 } from "lucide-react";
import Image from "next/image";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Skip check for login page
    if (pathname === "/admin/login") {
        setLoading(false);
        return;
    }

    const auth = localStorage.getItem("admin_auth");
    if (auth !== "true") {
      router.replace("/admin/login");
    } else {
      setIsAuthorized(true);
    }
    setLoading(false);
  }, [pathname, router]);

  function logout() {
    localStorage.removeItem("admin_auth");
    router.replace("/admin/login");
  }

  // If on login page, just render it full screen (no layout wrapper needed theoretically, but simple to keep structure)
  if (pathname === "/admin/login") {
     return <>{children}</>;
  }

  if (loading) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </div>
      );
  }

  if (!isAuthorized) return null;

  return (
    <div className="min-h-screen grid grid-cols-[260px_1fr]">
      <aside className="border-r border-gray-100 bg-white shadow-sm flex flex-col h-screen sticky top-0 z-50">
        <div className="p-6">
             <div className="font-bold text-xl tracking-tight text-gray-900 flex items-center gap-2">
                 <div className="w-8 h-8 bg-black rounded-lg"></div>
                 Krazy Kreators
             </div>
             <p className="text-xs text-gray-500 mt-1 pl-10">Admin Workspace</p>
        </div>
        
        <nav className="flex-1 flex flex-col gap-1 px-3 py-4">
          <NavLink href="/admin" icon={<LayoutDashboard className="w-5 h-5"/>}>Dashboard</NavLink>
          <NavLink href="/admin/leads" icon={<Users className="w-5 h-5"/>}>Leads</NavLink>
          <NavLink href="/admin/blogs" icon={<FileText className="w-5 h-5"/>}>Blogs</NavLink>
        </nav>

        <div className="p-4 mt-auto border-t border-gray-50">
             <button 
                onClick={logout}
                className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all"
             >
                 <LogOut className="w-5 h-5" />
                 Sign Out
             </button>
        </div>
      </aside>
      <main className="p-8 bg-gray-50/30 min-h-screen">{children}</main>
    </div>
  );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon: React.ReactNode }) {
    const pathname = usePathname();
    const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href));

    return (
        <Link 
            href={href} 
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive 
                    ? "bg-black text-white shadow-lg shadow-black/10" 
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
        >
            <span className={`${isActive ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}>
                {icon}
            </span>
            {children}
        </Link>
    );
}
