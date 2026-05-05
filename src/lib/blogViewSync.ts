const COUNT_KEY = 'blog-view-sync';
const SEEN_KEY = 'blog-view-seen';

type SyncState = Record<string, number>;

const parseObject = (raw: string | null): Record<string, unknown> => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
};

export const readBlogViewSyncState = (): SyncState => {
  if (typeof window === 'undefined') return {};
  const raw = parseObject(window.sessionStorage.getItem(COUNT_KEY));
  const out: SyncState = {};
  for (const [k, v] of Object.entries(raw)) {
    if (typeof v === 'number') out[k] = v;
  }
  return out;
};

export const recordBlogViewUpdate = (slug: string, count: number) => {
  if (typeof window === 'undefined') return;
  try {
    const state = readBlogViewSyncState();
    state[slug] = count;
    window.sessionStorage.setItem(COUNT_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('blog-view-updated', { detail: { slug, count } }));
  } catch {
    // no-op
  }
};

export const hasViewedThisSession = (slug: string): boolean => {
  if (typeof window === 'undefined') return true;
  try {
    const seen = parseObject(window.sessionStorage.getItem(SEEN_KEY));
    return Boolean(seen[slug]);
  } catch {
    return false;
  }
};

export const markViewedThisSession = (slug: string) => {
  if (typeof window === 'undefined') return;
  try {
    const seen = parseObject(window.sessionStorage.getItem(SEEN_KEY));
    seen[slug] = true;
    window.sessionStorage.setItem(SEEN_KEY, JSON.stringify(seen));
  } catch {
    // no-op
  }
};
