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
  title: string;
  content: string;
  published: string;
  imageUrl: string;
}