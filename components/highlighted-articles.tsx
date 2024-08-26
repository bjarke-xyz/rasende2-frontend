/* eslint-disable @next/next/no-img-element */
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { getHighlightedFakeNews } from "../api/fake-news";
import { FakeNewsItem, HighlightedFakeNewsResponse } from "../models/rss-item";
import { BASE_URL, placeholderImg } from "../utils/constants";
import { useRouter } from "next/router";
import { FakeNewsVotes } from "./fake-news-votes";
import { format } from 'date-fns/format'
import { makeArticleSlug, truncateText } from "../utils/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import React from "react";

export const featuredFakeNewsQueryKey = 'featured-fake-news'

export const HighlightedArticles: React.FC<{ highlightedFakeNews: HighlightedFakeNewsResponse | null, limit: number; initialSorting: string }> = (props) => {
    const { ref, inView } = useInView()
    const router = useRouter();
    const [sorting, setSorting] = useState<string>(props.initialSorting);
    const limit = 5
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: [featuredFakeNewsQueryKey, limit, sorting],
        queryFn: ({ pageParam }) => getHighlightedFakeNews(limit, pageParam, sorting),
        initialData: () => {
            if (props?.highlightedFakeNews) {
                return {
                    pageParams: [undefined],
                    pages: [props.highlightedFakeNews]
                }
            }
        },
        initialPageParam: "",
        getNextPageParam: (lastPage, pages) => {
            if (lastPage.cursor) {
                if (lastPage.fakeNews.length < limit) {
                    // We got less than requested, we have reached the end
                    return null;
                }
                return lastPage.cursor;
            } else {
                return null;
            }
        },
    })
    if (error) {
        console.log('error getting fake news', error)
    }
    useEffect(() => {
        if (inView) {
            fetchNextPage()
        }
    }, [fetchNextPage, inView])
    const handleSetSorting = (newSorting: string) => {
        setSorting(newSorting);
        router.query.sorting = newSorting;
        router.push(router);
    }
    return (
        <div>
            <div className="flex flex-row justify-between items-center flex-wrap gap-4">
                <h2 className="text-3xl font-bold">Falske Nyheder</h2>
                <div className="flex flex-col gap-4">
                    <Link className="btn-primary"
                        href="/title-generator">
                        Opret en falsk nyhed
                    </Link>
                    <div>
                        <label htmlFor="fake-news-sorting">Sortering</label>
                        <select id="fake-news-sorting" value={sorting} className="select" onChange={(e) => handleSetSorting(e.target.value)}>
                            <option value="popular">Mest populære</option>
                            <option value="latest">Nyeste</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 p-4 max-w-[2600px] m-auto">
                {status === 'pending' ? <p>Henter fremhævede artikler...</p> : null}
                {status === 'error' ? <p>Kunne ikke hente fremhævede artikler</p> : null}
                {status === 'success' && data?.pages?.length === 0 ? <p>Ingen fremhævede artikler endnu...</p> : null}
                {status === 'success' && data?.pages?.length > 0 ? (
                    data.pages.map((page, pageIndex) => (
                        <React.Fragment key={pageIndex}>
                            {page.fakeNews.map(article => (
                                <ArticleCard key={`${article.siteId}-${article.title}`} article={article} />
                            ))}
                        </React.Fragment>
                    ))
                )
                    : null}
            </div>
            {hasNextPage ? (
                <button
                    // ref={ref}
                    className="btn-primary"
                    onClick={(e) => fetchNextPage()}
                    disabled={!data || isFetchingNextPage || isFetching}
                >
                    {(isFetchingNextPage || isFetching) ? 'Henter falske nyheder...' : 'Vis mere'}
                </button>
            ) : null}
        </div>
    )
}


const ArticleCard: React.FC<{ article: FakeNewsItem }> = ({ article }) => {
    const router = useRouter();
    const admin = (router?.query?.admin ?? "false") === "true";
    const slug = makeArticleSlug(article)
    const urlObj = new URL(`${BASE_URL}/fake-news/${slug}`);
    if (admin) {
        urlObj.searchParams.append('admin', 'true');
    }
    const url = urlObj.toString();

    const getTimeDifference = (date: string) => {
        const now = new Date();
        const publishedDate = new Date(date);
        const diffInMilliseconds = now.getTime() - publishedDate.getTime();
        const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        const diffInHours = Math.floor(diffInMinutes / 60);

        if (diffInSeconds < 60) {
            return `${diffInSeconds}s`;
        } else if (diffInMinutes < 60) {
            return `${diffInMinutes}m`;
        } else if (diffInHours < 24) {
            return `${diffInHours}h`;
        } else {
            const options: Intl.DateTimeFormatOptions = {
                month: "short",
                day: "numeric",
            };
            if (publishedDate.getFullYear() !== now.getFullYear()) {
                options.year = "numeric";
            }
            return publishedDate.toLocaleDateString("en-US", options);
        }
    };

    const contentPreview = truncateText(article.content);
    const published = getTimeDifference(article.published)

    return (
        <div className="flex flex-col min-w-[256px] max-w-[512px] shadow-md rounded-lg dark:bg-slate-700">
            <img
                className="w-full h-[384px] object-cover"
                src={article.imageUrl ?? placeholderImg}
                onError={() => article.imageUrl = placeholderImg}
                alt={article.title}
            />
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                    <span className="bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                        {article.siteName}
                    </span>
                    <span className="text-gray-500 dark:text-gray-200 text-xs" title={format(article.published, 'yyyy-MM-dd HH:mm:ss')}>
                        {published}
                    </span>
                </div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-50 hover:underline">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {article.title}
                    </a>
                </h2>
                <p className="text-gray-600 dark:text-gray-200 mt-2 mb-auto">{contentPreview}</p>
                <div className="flex flex-row gap-4 justify-between content-end">
                    <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" text-blue-500 dark:text-blue-200 dark:hover:text-blue-300 hover:text-blue-700 mt-4 inline-block"
                    >
                        Læs mere
                    </a>
                    <FakeNewsVotes fakeNews={article} />
                </div>
            </div>
        </div>
    )
}