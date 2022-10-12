import { formatDistanceStrict, parseISO } from "date-fns";
import daLocale from "date-fns/locale/da";
import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Centered } from "../components/centered";
import { RasendeChart, RasendeChartProps } from "../components/chart";
import { ItemLink } from "../components/item-link";
import { RssItem, SearchResult } from "../models/rss-item";
import { API_URL } from "../utils/constants";
import { fetcher } from "../utils/fetcher";

const Home: NextPage = () => {
  const [queryParam, setQueryParam] = useState<string>("rasende");
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
    <div className="m-4">
      {error && <p>Der skete en fejl :(</p>}
      {!error && data && (
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
                <ItemLink item={item} />
              </div>
            ))}
          </div>
          <div className="mt-8">
            {chartData && <RasendeChart {...chartData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
