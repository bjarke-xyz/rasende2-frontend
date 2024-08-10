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
            <h2 className="text-xl font-bold">Fremhævede falske artikler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
                {/* <div className="flex flex-wrap mt-4 gap-4"> */}
                {!data ? <p>Ingen fremhævede artikler endnu...</p> : data.map(article => <ArticleCard key={article.title} article={article} />)}
            </div>
        </div>
    )
}

const placeholder = "https://static.bjarke.xyz/placeholder.png"

const ArticleCard: React.FC<{ article: FakeNewsItem }> = ({ article }) => {
    const urlObj = new URL(`${window.location.origin}/article-generator`);
    urlObj.searchParams.append('siteName', article.siteName);
    urlObj.searchParams.append('title', article.title);
    const url = urlObj.toString();
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + "...";
    };

    const contentPreview = truncateText(article.content, 100);

    return (
        <div className="min-w-[8rem] shadow-md rounded-lg dark:bg-slate-700">
            <img
                className="w-full h-48 object-cover"
                src={article.imageUrl}
                onError={() => article.imageUrl = placeholder}
                alt={article.title}
            />
            <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {article.siteName}
                    </span>
                    <span className="text-gray-500 dark:text-gray-200 text-xs">
                        {new Date(article.published).toLocaleDateString()}
                    </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-50 hover:underline">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                    </a>
                </h2>
                <p className="text-gray-600 dark:text-gray-200 mt-2">{contentPreview}</p>
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 dark:text-blue-200 dark:hover:text-blue-300 hover:text-blue-700 mt-4 inline-block"
                >
                    Læs mere
                </a>
            </div>
        </div>
    )
}