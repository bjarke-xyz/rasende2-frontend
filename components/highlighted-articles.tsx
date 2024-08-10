/* eslint-disable @next/next/no-img-element */
import useSWR from "swr";
import { FakeNewsItem, SearchResult } from "../models/rss-item";
import { API_URL } from "../utils/constants";
import { fetcher } from "../utils/fetcher";

export const HighlightedArticles: React.FC = () => {
    const { data, error } = useSWR<FakeNewsItem[]>(
        [API_URL, "highlighted-fake-news"],
        fetcher
    );
    return (
        <div>
            <h2 className="text-xl font-bold">Fremhævede artikler</h2>
            <div className="flex mt-4 gap-4">
                {!data ? <p>Ingen fremhævede artikler endnu...</p> : data.map(article => <ArticleCard key={article.title} article={article} />)}
            </div>
        </div>
    )
}

const placeholder = "https://static.bjarke.xyz/placeholder.png"

const ArticleCard: React.FC<{ article: FakeNewsItem }> = ({ article }) => {
    const urlObj = new URL(window.location.origin);
    urlObj.searchParams.append('siteName', article.siteName);
    urlObj.searchParams.append('title', article.title);
    const url = urlObj.toString();
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const contentPreview = truncateText(article.content, 100);

    return (
        <div className="w-80 shadow-md rounded-lg">
            <img
                className="w-full h-48 object-cover"
                src={article.imageUrl}
                onError={() => article.imageUrl = placeholder}
                alt={article.title}
            />
            <div className="p-4">
                <h2 className="text-md font-semibold text-gray-800">{article.title}</h2>
                <p className="text-gray-600 mt-2">{contentPreview}</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 mt-4 inline-block"
                >
                    Read more
                </a>
            </div>
        </div>
    )
}