import { GetServerSidePropsContext, NextPage } from "next";
import { HighlightedFakeNewsResponse } from "../models/rss-item";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { getHighlightedFakeNews } from "../api/fake-news";
import { HighlightedArticles } from "../components/highlighted-articles";

const defaultLimit = 5;

interface FakeNewsPageProps {
    highlightedFakeNews: HighlightedFakeNewsResponse | null;
    limit: number | null;
    sorting: string;
}

const FakeNewsPage: NextPage<FakeNewsPageProps> = (props) => {
    return (
        <div className="m-4">
            <Head>
                <title>Falske Nyheder</title>
            </Head>
            <NextSeo title="Falske Nyheder" />
            <HighlightedArticles highlightedFakeNews={props.highlightedFakeNews} limit={props.limit ?? defaultLimit} initialSorting={props.sorting} />

        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: FakeNewsPageProps }> {
    let sorting = context.query.sorting?.toString() ?? '';
    if (!['popular', 'latest'].includes(sorting)) {
        sorting = 'popular'
    }
    const limit = defaultLimit;
    const highlightedFakeNews = await getHighlightedFakeNews(limit, undefined, sorting);
    return {
        props: {
            highlightedFakeNews: highlightedFakeNews,
            limit,
            sorting,
        }
    }
}


export default FakeNewsPage;