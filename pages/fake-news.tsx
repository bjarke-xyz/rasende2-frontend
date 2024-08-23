import { NextPage } from "next";
import { HighlightedFakeNewsResponse } from "../models/rss-item";
import Head from "next/head";
import { NextSeo } from "next-seo";
import { getHighlightedFakeNews } from "../api/fake-news";
import { HighlightedArticles } from "../components/highlighted-articles";

const defaultLimit = 5;

interface FakeNewsPageProps {
    highlightedFakeNews: HighlightedFakeNewsResponse | null;
    limit: number | null;
}

const FakeNewsPage: NextPage<FakeNewsPageProps> = (props) => {
    return (
        <div className="m-4">
            <Head>
                <title>Falske Nyheder</title>
            </Head>
            <NextSeo title="Falske Nyheder" />
            <HighlightedArticles highlightedFakeNews={props.highlightedFakeNews} limit={props.limit ?? defaultLimit} />

        </div>
    )
}

export async function getServerSideProps(): Promise<{ props: FakeNewsPageProps }> {
    const limit = defaultLimit;
    const highlightedFakeNews = await getHighlightedFakeNews(limit);
    return {
        props: {
            highlightedFakeNews: highlightedFakeNews,
            limit,
        }
    }
}


export default FakeNewsPage;