import { FakeNewsItem, HighlightedFakeNewsResponse } from "../models/rss-item";
import { API_URL } from "../utils/constants";
import { isServer } from "../utils/utils";

export async function getHighlightedFakeNews(limit: number, cursor?: string, sorting = 'popular'): Promise<HighlightedFakeNewsResponse> {
    const searchParams = new URLSearchParams();
    searchParams.append('limit', (limit ?? 2).toString());
    if (cursor) {
        searchParams.append('cursor', cursor)
    }
    searchParams.append('sorting', sorting);
    const resp = await fetch(`${API_URL}/api/highlighted-fake-news?${searchParams.toString()}`);
    return await resp.json();
}

export async function getFakeNewsArticle(siteId: number, title: string): Promise<FakeNewsItem | null> {
    const searchParams = new URLSearchParams();
    searchParams.append('siteId', siteId.toString());
    searchParams.append('title', title);
    const resp = await fetch(`${API_URL}/api/fake-news-article?${searchParams.toString()}`);
    if (resp.status === 200) {
        return await resp.json();
    } else {
        return null;
    }
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

export function setVotedStorage(siteName: string, title: string, direction: 'up' | 'down') {
    if (isServer()) return;
    localStorage.setItem(`VOTED:${siteName}:${title}`, direction);
}
export function getVotedStorage(siteName: string, title: string): 'up' | 'down' | null {
    if (isServer()) return null;
    const value = localStorage.getItem(`VOTED:${siteName}:${title}`);
    if (value === 'up' || value === 'down') return value
    return null;
}
export async function toggleFeatured(siteName: string, title: string) {
    const password = prompt('password?')
    if (!password) {
        alert(':(')
        return;
    }
    const formData = new FormData();
    formData.append('password', password);
    formData.append('siteName', siteName);
    formData.append('title', title);
    fetch(`${API_URL}/api/set-highlight`, {
        method: "POST",
        body: formData,
    }).then(async resp => {
        if (resp.status > 299) {
            const text = await resp.text();
            alert(`STATUS: ${resp.status} // ${text}`);
        }
    }).catch(error => {
        alert(error)
    })
}

export async function resetContent(siteName: string, title: string) {
    const password = prompt('password?')
    if (!password) {
        alert(':(')
        return;
    }
    const formData = new FormData();
    formData.append('password', password);
    formData.append('siteName', siteName);
    formData.append('title', title);
    fetch(`${API_URL}/api/reset-content`, {
        method: "POST",
        body: formData,
    }).then(async resp => {
        if (resp.status > 299) {
            const text = await resp.text();
            alert(`STATUS: ${resp.status} // ${text}`);
        }
    }).catch(error => {
        alert(error)
    })
}