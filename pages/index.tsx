import { useQuery } from "@tanstack/react-query";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { charts, search } from "../api/search";
import { Centered } from "../components/centered";
import { RasendeChart, RasendeChartProps } from "../components/chart";
import { ItemLink } from "../components/item-link";
import { formatDistanceStrict } from "date-fns/formatDistanceStrict";
import { parseISO } from "date-fns/parseISO";
import { da } from 'date-fns/locale'
import { SearchResult } from "../models/rss-item";
import { NextSeo } from "next-seo";

interface IndexProps {
  queryParam: string;
  limit: number;
  searchResult: SearchResult | null;
  chartData: RasendeChartProps | null;
}

const defaultQueryParam = "rasende";
const defaultLimit = 10;

const Home: NextPage<IndexProps> = (props) => {
  const { data, error } = useQuery({
    queryKey: ['search', props.queryParam ?? defaultQueryParam, props.limit ?? defaultLimit],
    queryFn: () => search(props.queryParam ?? defaultQueryParam, props.limit ?? defaultLimit),
    initialData: props.searchResult,
  })

  const { data: chartData } = useQuery({
    queryKey: ['charts', props.queryParam ?? defaultQueryParam],
    queryFn: () => charts(props.queryParam ?? defaultQueryParam),
    initialData: props.chartData,
  })

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="m-4">
      <Head>
        <title>Raseri i de danske medier | Rasende</title>
      </Head>
      <NextSeo title="Raseri i de danske medier" />
      {error && <p>Der skete en fejl :(</p>}
      {!error && data && data.items && (
        <div>
          <Centered>
            <p>Seneste raseri:</p>
          </Centered>
          <Centered bigText>
            {data.items.length === 0 && <p>Ingen raseri!</p>}
            {data.items.length > 0 && (
              <div>
                <ItemLink item={data.items[0]} />
              </div>
            )}
          </Centered>
          <Centered>
            {data.items.length > 0 && (
              <div title={data.items[0].published}>
                {formatDistanceStrict(now, parseISO(data.items[0].published), { locale: da })}{" "}
                siden
              </div>
            )}
          </Centered>
          <div className="flex flex-col m-4 mt-8">
            <p className="text-lg font-bold">Tidligere raserier:</p>
            {data.items.slice(1).map((item) => (
              <div key={item.itemId}>
                <ItemLink item={item} />
              </div>
            ))}
          </div>
          <div className="mt-8">
            {chartData && <RasendeChart {...chartData} />}
          </div>
          <div>
            Inspireret af{" "}
            <a
              className="underline"
              href="https://web.archive.org/web/20200628061846/https://rasende.dk/"
            >
              https://rasende.dk/
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(): Promise<{ props: IndexProps }> {
  const queryParam = defaultQueryParam;
  const limit = defaultLimit;
  const searchResultPromise = search(queryParam, limit);
  const chartDataPromise = charts(queryParam);
  const results = await Promise.allSettled([searchResultPromise, chartDataPromise]);
  const searchResult = results[0].status === 'fulfilled' ? results[0].value : null;
  const chartData = results[1].status === 'fulfilled' ? results[1].value : null;

  return {
    props: {
      queryParam,
      limit,
      searchResult,
      chartData,
    } as IndexProps
  }
}

export default Home;
