import { GetServerSidePropsContext, NextPage } from "next";
import { useRouter } from "next/router";
import { FakeNewsItem } from "../../models/rss-item";
import { getFakeNewsArticle } from "../../api/fake-news";
import { useQuery } from "@tanstack/react-query";
import { NextSeo } from "next-seo";
import { FakeNewsArticle } from "../../components/fake-news-article";
import Head from "next/head";
import { parseArticleSlug, truncateText } from "../../utils/utils";
import { BASE_URL, placeholderImg } from "../../utils/constants";
import { formatISO } from "date-fns/formatISO";


interface FakeNewsArticlePageProps {
    fakeNewsItem: FakeNewsItem | null;
}

const FakeNewsArticlePage: NextPage<FakeNewsArticlePageProps> = (props) => {
    const router = useRouter()
    const slug = Array.isArray(router.query.slug) ? router.query.slug[0] : router.query.slug;
    const [siteId, date, title, slugError] = parseArticleSlug(slug ?? "");
    const { data, error, isPending } = useQuery({
        queryKey: ['fake-news-article', siteId, title],
        queryFn: () => getFakeNewsArticle(siteId, title),
        initialData: props.fakeNewsItem,
    })
    const admin = (router?.query?.admin ?? "false") === "true";
    if (slugError) {
        return <p>{slugError.message}</p>
    }
    if (error) {
        return <p>Kunne ikke hente artikel: {error?.message}</p>
    }
    if (isPending) {
        return <p>Henter artikel...</p>
    }
    if (!data) {
        return <p>Artikel ikke fundet</p>
    }
    return (
        <div className="m-4">
            <>
                <Head><title>{data.title} | Falske Nyheder</title></Head>
                <NextSeo openGraph={{
                    title: `${data.title} | Falske Nyheder`,
                    description: truncateText(data.content),
                    url: `${BASE_URL}/fake-news/${slug}`,
                    type: 'article',
                    article: {
                        publishedTime: formatISO(data.published),
                    },
                    images: [
                        {
                            url: data.imageUrl ?? placeholderImg,
                            width: 512,
                            height: 512,
                            alt: data.title,
                        }
                    ]
                }} />
            </>
            <FakeNewsArticle admin={admin} article={data} />
        </div>
    )
}
export default FakeNewsArticlePage;

export async function getServerSideProps(context: GetServerSidePropsContext): Promise<{ props: FakeNewsArticlePageProps }> {
    const slug = Array.isArray(context.params?.slug) ? context.params.slug[0] : context.params?.slug;
    const [siteId, date, title, error] = parseArticleSlug(slug ?? "");
    if (error) {
        return {
            props: {
                fakeNewsItem: null,
            }
        }
    }
    const fakeNewsArticle = await getFakeNewsArticle(siteId, title);
    return {
        props: {
            fakeNewsItem: fakeNewsArticle,
        }
    }
}

