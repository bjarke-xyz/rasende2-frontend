import debounce from "lodash.debounce";
import { NextPage } from "next";
import Head from "next/head";
import { ChangeEvent, useMemo, useState } from "react";
import useSWR from "swr";
import { RasendeChart, RasendeChartProps } from "../components/chart";
import { ItemLink } from "../components/item-link";
import { SearchResult } from "../models/rss-item";
import { API_URL } from "../utils/constants";
import { fetcher } from "../utils/fetcher";

const defaultValue = "rasende";

const Search: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>(defaultValue);
  const [searchContent, setSearchContent] = useState<boolean>(false);
  const { data: chartData } = useSWR<RasendeChartProps>(
    [API_URL, "charts", searchQuery, 1000, searchContent],
    fetcher
  );
  const [cnt, setCnt] = useState(1);
  const pages = [];
  for (let i = 0; i < cnt; i++) {
    const limit = 100;
    pages.push(
      <SearchResultPage
        offset={i * 100}
        limit={limit}
        key={i}
        searchQuery={searchQuery}
        searchContent={searchContent}
      />
    );
  }
  const eventHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCnt(1);
  };
  const debouncedEventHandler = useMemo(() => debounce(eventHandler, 300), []);
  return (
    <div className="m-4">
      <Head>
        <title>Søg | Rasende</title>
      </Head>
      <div className="flex justify-center">
        <div className="flex flex-row align-middle space-x-2">
          <input
            defaultValue={defaultValue}
            className="p-1 block border border-solid border-gray-300 rounded-md dark: text-slate-900"
            onChange={(e) => {
              debouncedEventHandler(e);
            }}
          />
          <div className="">
            <input
              type="checkbox"
              className="cursor-pointer mr-1"
              id="checkbox"
              checked={searchContent}
              onChange={(e) => setSearchContent(!searchContent)}
            />
            <label className="inline-block" htmlFor="checkbox">
              Søg i artikel indhold
            </label>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-16">{pages}</div>
      <button
        className="bg-blue-100 hover:bg-blue-200 mt-5 p-2 rounded-md text-slate-900"
        onClick={() => setCnt(cnt + 1)}
      >
        Hent flere
      </button>
      <div className="mt-8">{chartData && <RasendeChart {...chartData} />}</div>
    </div>
  );
};

interface SearchResultPageProps {
  searchQuery: string;
  searchContent: boolean;
  offset: number;
  limit: number;
}

const SearchResultPage = ({
  searchQuery,
  searchContent,
  offset,
  limit,
}: SearchResultPageProps) => {
  const { data, error } = useSWR<SearchResult>(
    [API_URL, "search", searchQuery, limit, searchContent, offset],
    fetcher
  );
  return (
    <div>
      {data?.items?.map((item) => (
        <div key={item.itemId}>
          <ItemLink item={item} />
        </div>
      ))}
    </div>
  );
};

export default Search;
