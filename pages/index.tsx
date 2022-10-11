import { formatDistanceStrict, parseISO } from "date-fns";
import daLocale from "date-fns/locale/da";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { RasendeChart, RasendeChartProps } from "../components/chart";
import { RssItem, SearchResult } from "../models/rss-item";
import { API_URL } from "../utils/constants";

export const fetcher = (
  url: string,
  resource: string,
  query: string,
  limit: number
) =>
  fetch(`${url}/${resource}?q=${query}&limit=${limit}`).then((res) =>
    res.json()
  );

const Centered: React.FC<{ children: React.ReactNode; size: number }> = ({
  children,
  size,
}) => {
  return (
    <div className="flex justify-center">
      <div className={`text-${size}xl leading-relaxed`}>{children}</div>
    </div>
  );
};

const Item: React.FC<{ item: RssItem }> = ({ item }) => {
  return (
    <a href={item.link} className="hover:underline">
      {item.siteName}: {item.title}
    </a>
  );
};

const Home: NextPage = () => {
  const [queryParam, setQueryParam] = useState<string>("rase");
  const { data, error } = useSWR<SearchResult>(
    [API_URL, "search", queryParam, 10],
    fetcher
  );

  const { data: chartData } = useSWR<RasendeChartProps>(
    [API_URL, "charts", queryParam],
    fetcher
  );

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div>
      {error && <p>Der skete en fejl :(</p>}
      {!error && data && (
        <div>
          <Centered size={3}>
            <p>Seneste raseri:</p>
          </Centered>
          <Centered size={5}>
            {data.items.length === 0 && <p>Ingen raseri!</p>}
            {data.items.length > 0 && (
              <div>
                <Item item={data.items[0]} />
              </div>
            )}
          </Centered>
          <Centered size={3}>
            {data.items.length > 0 && (
              <div>
                {formatDistanceStrict(now, parseISO(data.items[0].published), {
                  locale: daLocale,
                })}{" "}
                siden
              </div>
            )}
          </Centered>
          <div className="flex flex-col m-4 mt-8">
            <p className="text-lg font-bold">Tidligere raserier:</p>
            {data.items.slice(1).map((item) => (
              <div key={item.itemId}>
                <Item item={item} />
              </div>
            ))}
          </div>
          <div className="m-4 mt-8">
            {chartData && <RasendeChart {...chartData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
