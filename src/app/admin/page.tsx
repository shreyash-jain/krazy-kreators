"use client";

import { useEffect, useState, ReactNode } from "react";
import { Eye, Activity, Zap, Globe, Smartphone, Monitor, Tablet, ShoppingBag, TrendingUp } from "lucide-react";
import Link from "next/link";

type AnalyticsData = {
  overview: {
    rows: {
      date: string;
      activeUsers: number;
      screenPageViews: number;
      sessions: number;
      formattedDate?: string;
    }[];
    totals: {
      activeUsers: number;
      screenPageViews: number;
      sessions: number;
      newUsers: number;
      avgSessionDuration: number;
      avgEngagementRate: number;
    };
  };
  pages: {
    path: string;
    title: string;
    views: number;
    users: number;
    avgDuration: number;
  }[];
  countries: {
    country: string;
    users: number;
  }[];
  trafficSources: {
    channel: string;
    users: number;
  }[];
  devices: {
    device: string;
    users: number;
  }[];
};

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s}s`;
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin/analytics");
        const json = await res.json();
        if (json.error) throw new Error(json.error);

        // Format dates in overview
        if (json.overview?.rows) {
          json.overview.rows = json.overview.rows.map((r: { date: string } & Record<string, unknown>) => ({
            ...r,
            formattedDate: `${r.date.substring(4, 6)}/${r.date.substring(6, 8)}`
          }));
        }

        setData(json);
      } catch (err) {
        setError("Failed to load analytics data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-sm font-medium text-gray-500 uppercase tracking-widest">Loading Insights...</div>
      </div>
    </div>
  );
  
  if (error) return <div className="p-8 text-center text-red-500 bg-red-50 rounded-lg m-4">{error}</div>;

  const { overview, pages, countries, trafficSources = [], devices = [] } = data!;
  const { totals, rows } = overview;
  const maxViews = Math.max(...rows.map((r) => r.screenPageViews), 1);
  const totalDeviceUsers = devices.reduce((acc, d) => acc + d.users, 0) || 1;

  // Helper for Device Icons
  const getDeviceIcon = (device: string) => {
    const d = device.toLowerCase();
    if (d.includes('mobile')) return <Smartphone className="w-4 h-4" />;
    if (d.includes('tablet')) return <Tablet className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">Executive Dashboard</h1>
          <p className="text-gray-500 mt-2 font-light">Real-time performance metrics for your brand.</p>
        </div>
        <div className="text-right">
           <div className="text-sm font-medium text-gray-900">Last 30 Days</div>
           <div className="text-xs text-gray-400">Updates automatically</div>
        </div>
      </div>

      {/* KPI Grid - Elegant & Minimal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Shoppers"
          value={totals.activeUsers.toLocaleString()}
          subValue={`${totals.newUsers.toLocaleString()} new leads`}
          icon={<ShoppingBag className="w-5 h-5 text-gray-900" />}
        />
        <StatCard
          title="Traffic Volume"
          value={totals.screenPageViews.toLocaleString()}
          subValue="Views per session: "
          highlightValue={(totals.screenPageViews / (totals.sessions || 1)).toFixed(1)}
          icon={<Eye className="w-5 h-5 text-gray-900" />}
        />
        <StatCard
          title="Engagement"
          value={`${(totals.avgEngagementRate * 100).toFixed(1)}%`}
          subValue="Avg Duration: "
          highlightValue={formatDuration(totals.avgSessionDuration)}
          icon={<Activity className="w-5 h-5 text-gray-900" />}
        />
        <StatCard
          title="Top Region"
          value={countries[0]?.country || "Global"}
          subValue={countries[0] ? `${((countries[0].users / totals.activeUsers) * 100).toFixed(1)}% of traffic` : ""}
          icon={<Globe className="w-5 h-5 text-gray-900" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Section - Traffic Trend */}
        <div className="lg:col-span-2 bg-white p-8 rounded-xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              Traffic Velocity
            </h3>
          </div>

          <div className="relative h-64 flex items-end gap-1 sm:gap-2">
            {rows.map((row, i) => (
              <div key={row.date} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                <div
                  className="w-full bg-gray-900/90 rounded-t-sm transition-all duration-300 hover:bg-black relative"
                  style={{
                    height: `${(row.screenPageViews / maxViews) * 100}%`,
                    minHeight: "4px",
                    opacity: 0.2 + (row.screenPageViews / maxViews) * 0.8
                  }}
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none transform transition-all duration-200 translate-y-2 group-hover:translate-y-0">
                    <div className="font-semibold text-sm mb-1">{row.formattedDate}</div>
                    <div className="flex justify-between gap-4 text-gray-300">
                      <span>Views</span>
                      <span className="text-white font-medium">{row.screenPageViews}</span>
                    </div>
                    <div className="flex justify-between gap-4 text-gray-300">
                      <span>Shoppers</span>
                      <span className="text-white font-medium">{row.activeUsers}</span>
                    </div>
                    {/* Tiny triangle */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs text-gray-400 font-medium tracking-widest uppercase">
             <span>{rows[0]?.formattedDate}</span>
             <span>{rows[Math.floor(rows.length/2)]?.formattedDate}</span>
             <span>{rows[rows.length-1]?.formattedDate}</span>
          </div>
        </div>

        {/* Audience Insights Column */}
        <div className="space-y-8">
           {/* Device Breakdown */}
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
             <h3 className="font-medium text-gray-900 mb-6 flex items-center gap-2">
               Platform Mix
             </h3>
             <div className="space-y-5">
               {devices.map((d) => (
                 <div key={d.device} className="group">
                   <div className="flex items-center justify-between mb-2">
                     <div className="flex items-center gap-2 text-gray-600">
                       {getDeviceIcon(d.device)}
                       <span className="text-sm capitalize">{d.device}</span>
                     </div>
                     <span className="text-sm font-semibold text-gray-900">{((d.users / totalDeviceUsers) * 100).toFixed(0)}%</span>
                   </div>
                   <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                     <div 
                        className="h-full bg-gray-900 rounded-full transition-all duration-500 ease-out group-hover:bg-black"
                        style={{ width: `${(d.users / totalDeviceUsers) * 100}%` }}
                     />
                   </div>
                 </div>
               ))}
               {devices.length === 0 && <div className="text-sm text-gray-400 italic">No device data detected</div>}
             </div>
           </div>

           {/* Acquisition Channels */}
           <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
             <h3 className="font-medium text-gray-900 mb-6 flex items-center gap-2">
               Acquisition Channels
             </h3>
             <div className="space-y-4">
               {trafficSources.map((t, i) => (
                 <div key={t.channel} className="flex items-center justify-between pb-3 border-b border-gray-50 last:border-0 last:pb-0">
                   <div className="flex items-center gap-3">
                     <span className="w-5 h-5 flex items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-500">
                       {i + 1}
                     </span>
                     <span className="text-sm text-gray-700 capitalize">{t.channel}</span>
                   </div>
                   <div className="text-sm font-medium text-gray-900">{t.users.toLocaleString()}</div>
                 </div>
               ))}
               {trafficSources.length === 0 && <div className="text-sm text-gray-400 italic">No channel data available</div>}
             </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top Locations */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)]">
            <h3 className="font-medium text-gray-900 mb-6 flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-400" />
            Top Locations
            </h3>
            <div className="space-y-4">
              {countries.slice(0, 5).map((c, i) => (
                <div key={c.country} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-50 text-xs font-bold text-gray-400">
                      {i + 1}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{c.country}</span>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{c.users.toLocaleString()}</div>
                </div>
              ))}
              {countries.length === 0 && <div className="text-sm text-gray-400">No geo data available</div>}
            </div>
        </div>

        {/* Pages Table */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-400" />
              Top Performing Content
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50/50 text-gray-500">
                <tr>
                  <th className="px-6 py-3 font-medium tracking-wide text-xs uppercase">Content</th>
                  <th className="px-6 py-3 font-medium tracking-wide text-xs uppercase">Views</th>
                  <th className="px-6 py-3 font-medium tracking-wide text-xs uppercase">Shoppers</th>
                  <th className="px-6 py-3 font-medium tracking-wide text-xs uppercase">Avg. Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {pages.map((page) => (
                  <tr key={page.path} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900 truncate max-w-xs sm:max-w-sm" title={page.title}>
                        {page.title || "(No Title)"}
                      </div>
                      <Link href={page.path} target="_blank" className="text-xs text-gray-400 group-hover:text-black transition-colors truncate block mt-1">
                        {page.path}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">{page.views.toLocaleString()}</td>
                    <td className="px-6 py-4 text-gray-600">{page.users.toLocaleString()}</td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                      {formatDuration(page.avgDuration)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, subValue, highlightValue, icon }: { title: string, value: string, subValue?: string, highlightValue?: string, icon: ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-[0_2px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.05)] transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div>
           <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</p>
           <h3 className="text-2xl font-light text-gray-900 tracking-tight">{value}</h3>
        </div>
        <div className="p-3 rounded-full bg-gray-50 text-gray-900">
          {icon}
        </div>
      </div>
      {subValue && (
        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium">
           {subValue} <span className="text-gray-900 font-semibold">{highlightValue}</span>
        </div>
      )}
    </div>
  );
}
