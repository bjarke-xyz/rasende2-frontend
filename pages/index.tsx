import { format, formatDistanceStrict, parseISO } from "date-fns";
import daLocale from "date-fns/locale/da";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { RssItem, SearchResult } from "../models/rss-item";
import { API_URL } from "../utils/constants";

export const fetcher = (url: string, query: string) =>
  fetch(`${url}/search?q=${query}`).then((res) => res.json());

const Item: React.FC<{ item: RssItem }> = ({ item }) => {
  return (
    <a href={item.link} className="hover:underline">
      {item.siteName}: {item.title}
    </a>
  );
};

const Home: NextPage = () => {
  const [queryParam, setQueryParam] = useState<string>("rase");
  const { data, error } = useSWR<SearchResult>([API_URL, queryParam], fetcher);

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
          <div className="flex justify-center">
            <div className="text-5xl">
              <p>Seneste raseri:</p>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="text-3xl">
              {data.items.length === 0 && <p>Ingen raseri!</p>}
              {data.items.length > 0 && (
                <div>
                  <Item item={data.items[0]} />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-center">
            <div className="text-3xl">
              {data.items.length > 0 && (
                <div>
                  {formatDistanceStrict(
                    now,
                    parseISO(data.items[0].published),
                    {
                      locale: daLocale,
                    }
                  )}{" "}
                  siden
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col m-4 mt-8">
            <p className="text-lg font-bold">Tidligere raserier:</p>
            {data.items.slice(1).map((item) => (
              <div key={item.itemId}>
                <Item item={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
