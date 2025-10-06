const STORAGE_KEY = 'blog-like-sync';

type SyncState = Record<string, number>;

const parseState = (raw: string | null): SyncState => {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed as SyncState : {};
  } catch {
    return {};
  }
};

export const readBlogLikeSyncState = (): SyncState => {
  if (typeof window === 'undefined') return {};
  return parseState(window.sessionStorage.getItem(STORAGE_KEY));
};

export const recordBlogLikeUpdate = (slug: string, count: number) => {
  if (typeof window === 'undefined') return;
  try {
    const state = parseState(window.sessionStorage.getItem(STORAGE_KEY));
    state[slug] = count;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('blog-like-updated', { detail: { slug, count } }));
  } catch {
    // no-op
  }
};

