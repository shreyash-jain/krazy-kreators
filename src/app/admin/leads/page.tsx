"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

type Lead = {
  id: string;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  services: string;
  source: string | null;
};

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadLeads() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/admin/leads", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to load leads");
      console.log("[admin/leads] fetched", data);
      setLeads(Array.isArray(data?.leads) ? data.leads : []);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      console.error("[admin/leads] error", msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const downloadCsv = () => {
    if (!leads || leads.length === 0) return;

    const headers = [
      "ID",
      "Date",
      "Name",
      "Email",
      "Phone",
      "Company",
      "Country",
      "Services",
      "Source",
    ];

    const csvContent = [
      headers.join(","),
      ...leads.map((lead) => {
        const row = [
          lead.id,
          new Date(lead.created_at).toISOString(),
          `"${(lead.full_name || "").replace(/"/g, '""')}"`,
          `"${(lead.email || "").replace(/"/g, '""')}"`,
          `"${(lead.phone || "").replace(/"/g, '""')}"`,
          `"${(lead.company || "").replace(/"/g, '""')}"`,
          `"${(lead.country || "").replace(/"/g, '""')}"`,
          `"${(lead.services || "").replace(/"/g, '""')}"`,
          `"${(lead.source || "").replace(/"/g, '""')}"`,
        ];
        return row.join(",");
      }),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `leads_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    loadLeads();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Leads</h1>
        <div className="flex gap-2">
          <Button onClick={downloadCsv} variant="outline" size="sm" disabled={loading || leads.length === 0}>
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
          <button onClick={loadLeads} className="text-sm underline">Refresh</button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="overflow-x-auto">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left border-b">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Phone</th>
                <th className="py-2 pr-4">Company</th>
                <th className="py-2 pr-4">Country</th>
                <th className="py-2 pr-4">Services</th>
                <th className="py-2 pr-4">Source</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-b">
                  <td className="py-2 pr-4">{new Date(lead.created_at).toLocaleString()}</td>
                  <td className="py-2 pr-4">{lead.full_name}</td>
                  <td className="py-2 pr-4">{lead.email}</td>
                  <td className="py-2 pr-4">{lead.phone}</td>
                  <td className="py-2 pr-4">{lead.company}</td>
                  <td className="py-2 pr-4">{lead.country}</td>
                  <td className="py-2 pr-4">{lead.services}</td>
                  <td className="py-2 pr-4">{lead.source ?? "—"}</td>
                </tr>
              ))}
              {leads.length === 0 && (
                <tr>
                  <td className="py-6 text-muted-foreground" colSpan={8}>No leads yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}


