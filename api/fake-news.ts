import { HighlightedFakeNewsResponse } from "../models/rss-item";
import { API_URL } from "../utils/constants";

export async function getHighlightedFakeNews(limit: number, cursor?: string): Promise<HighlightedFakeNewsResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', (limit ?? 2).toString());
    if (cursor) {
        searchParams.append('cursor', cursor)
    }
    const resp = await fetch(`${API_URL}/highlighted-fake-news?${searchParams.toString()}`);
    return await resp.json();
}