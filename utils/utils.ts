import { format } from "date-fns";
import { FakeNewsItem } from "../models/rss-item";

export function isServer() {
    return typeof window === "undefined"
}
export const truncateText = (text: string, maxLength = 160) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
};


export function makeArticleSlug(fakeNewsItem: FakeNewsItem): string {
    return `${fakeNewsItem.siteId}-${format(fakeNewsItem.published, "yyyy-MM-dd")}-${encodeURIComponent(fakeNewsItem.title)}`;
}
export function parseArticleSlug(slug: string): [number, Date, string, Error | null] {
    // slug = {site-id:123}-{date:2024-08-19}-{title:article title qwerty}
    let siteId = 0;
    let date = new Date();
    let title = "";
    let err: Error | null = null;

    const parts = slug.split("-");

    if (parts.length < 4) {
        return [siteId, date, title, new Error("invalid slug")];
    }

    siteId = parseInt(parts[0]);
    if (isNaN(siteId)) {
        return [siteId, date, title, new Error("error parsing site id")];
    }

    const year = parts[1];
    const month = parts[2];
    const day = parts[3];
    const dateString = `${year}-${month}-${day}`;

    date = new Date(dateString);
    if (isNaN(date.getTime())) {
        return [siteId, date, title, new Error("error parsing date")];
    }

    title = parts.slice(4).join("-");

    return [siteId, date, title, null];
}