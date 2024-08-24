import { RasendeChartProps } from "../components/chart";
import { SearchResult } from "../models/rss-item";
import { API_URL, INTERNAL_API_URL } from "../utils/constants";
import { isServer } from "../utils/utils";

export async function search(searchTerm: string, limit: number, searchContent?: boolean, offset?: number): Promise<SearchResult> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', searchTerm)
    searchParams.append('limit', limit.toString());
    if (searchContent !== undefined) {
        searchParams.append('content', `${searchContent}`)
    }
    if (offset !== undefined) {
        searchParams.append('offset', offset.toString());
    }
    const apiUrl = isServer() ? INTERNAL_API_URL : API_URL
    const resp = await fetch(`${apiUrl}/api/search?${searchParams.toString()}`);
    return await resp.json();
}

export async function charts(searchTerm: string, limit?: number, searchContent?: boolean): Promise<RasendeChartProps> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', searchTerm)
    if (limit) {
        searchParams.append('limit', limit.toString());
    }
    if (searchContent !== undefined) {
        searchParams.append('content', `${searchContent}`)
    }
    const apiUrl = isServer() ? INTERNAL_API_URL : API_URL
    const resp = await fetch(`${apiUrl}/api/charts?${searchParams.toString()}`);
    return await resp.json();
}