import { FakeNewsItem, HighlightedFakeNewsResponse } from "../models/rss-item";
import { API_URL } from "../utils/constants";

export async function getHighlightedFakeNews(limit: number, cursor?: string): Promise<HighlightedFakeNewsResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', (limit ?? 2).toString());
    if (cursor) {
        searchParams.append('cursor', cursor)
    }
    const resp = await fetch(`${API_URL}/api/highlighted-fake-news?${searchParams.toString()}`);
    return await resp.json();
}

export async function voteFakeNews(siteName: string, title: string, direction: 'up' | 'down'): Promise<FakeNewsItem> {
    const formData = new FormData();
    formData.append('siteName', siteName);
    formData.append('title', title);
    formData.append('direction', direction);
    const resp = await fetch(`${API_URL}/api/vote-fake-news`, {
        method: 'POST',
        body: formData
    });
    return await resp.json();
}

export function setVoted(siteName: string, title: string, direction: 'up' | 'down') {
    localStorage.setItem(`VOTED:${siteName}:${title}`, direction);
}
export function getVoted(siteName: string, title: string): 'up' | 'down' | null {
    const value = localStorage.getItem(`VOTED:${siteName}:${title}`);
    if (value === 'up' || value === 'down') return value
    return null;
}