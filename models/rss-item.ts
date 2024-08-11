export interface RssItem {
  itemId: string;
  siteName: string;
  title: string;
  content: string;
  link: string;
  published: string;
}

export interface SearchResult {
  items: RssItem[];
}

export interface FakeNewsItem {
  siteId: number;
  siteName: string;
  title: string;
  content: string;
  published: string;
  imageUrl: string;
}
export interface HighlightedFakeNewsResponse {
  fakeNews: FakeNewsItem[];
  cursor: string;
}