import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-[240px_1fr]">
      <aside className="border-r bg-[var(--sidebar)] text-[var(--sidebar-foreground)]">
        <div className="p-4 font-bold text-lg">Admin</div>
        <nav className="flex flex-col gap-1 p-2">
          <Link className="px-3 py-2 rounded hover:bg-[var(--sidebar-accent)]" href="/admin">Dashboard</Link>
          <Link className="px-3 py-2 rounded hover:bg-[var(--sidebar-accent)]" href="/admin/leads">Leads</Link>
          <Link className="px-3 py-2 rounded hover:bg-[var(--sidebar-accent)]" href="/admin/blogs">Blogs</Link>
        </nav>
      </aside>
      <main className="p-6">{children}</main>
    </div>
  );
}


