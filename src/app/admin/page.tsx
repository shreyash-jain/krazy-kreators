export const dynamic = 'force-dynamic';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Google Analytics overview will appear here. (Hook GA4 later)</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Visitors (7d)</div>
          <div className="text-3xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Leads (7d)</div>
          <div className="text-3xl font-semibold">—</div>
        </div>
        <div className="rounded-lg border bg-card p-4">
          <div className="text-sm text-muted-foreground">Top Blog</div>
          <div className="text-3xl font-semibold">—</div>
        </div>
      </div>
    </div>
  );
}


