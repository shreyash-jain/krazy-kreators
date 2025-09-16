import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://krazykreators.com";
  const now = new Date();
  const daily = "daily" as const;

  return [
    { url: `${base}/`, lastModified: now, changeFrequency: daily, priority: 1 },
    { url: `${base}/about`, lastModified: now, changeFrequency: daily, priority: 0.7 },
    { url: `${base}/pricing`, lastModified: now, changeFrequency: daily, priority: 0.6 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: daily, priority: 0.6 },
    { url: `${base}/design-services`, lastModified: now, changeFrequency: daily, priority: 0.7 },
    { url: `${base}/manufacturing-services`, lastModified: now, changeFrequency: daily, priority: 0.7 },
    { url: `${base}/end-to-end-services`, lastModified: now, changeFrequency: daily, priority: 0.7 },
    { url: `${base}/case-studies/drover`, lastModified: now, changeFrequency: daily, priority: 0.6 },
    { url: `${base}/case-studies/tilted-lotus`, lastModified: now, changeFrequency: daily, priority: 0.6 },
    { url: `${base}/case-studies/las`, lastModified: now, changeFrequency: daily, priority: 0.6 },
    { url: `${base}/case-studies/hy-official`, lastModified: now, changeFrequency: daily, priority: 0.6 },
    { url: `${base}/case-studies/badri-al-shihhi`, lastModified: now, changeFrequency: daily, priority: 0.6 },
  ];
}


