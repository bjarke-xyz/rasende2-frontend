import { NextPage } from "next";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { Centered } from "../components/centered";
import { ItemLink } from "../components/item-link";
import { SearchResult } from "../models/rss-item";
import { API_URL } from "../utils/constants";
import { fetcher } from "../utils/fetcher";
import debounce from "lodash.debounce";
import { RasendeChart, RasendeChartProps } from "../components/chart";

const defaultValue = "rasende";

const Search: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState<string>(defaultValue);
  const [searchContent, setSearchContent] = useState<boolean>(false);
  const { data, error } = useSWR<SearchResult>(
    [API_URL, "search", searchQuery, 1000, searchContent],
    fetcher
  );
  const { data: chartData } = useSWR<RasendeChartProps>(
    [API_URL, "charts", searchQuery, 1000, searchContent],
    fetcher
  );
  const eventHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  const debouncedEventHandler = useMemo(() => debounce(eventHandler, 300), []);
  return (
    <div className="m-4">
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
      <div className="flex flex-col justify-center mt-16">
        {data?.items?.map((item) => (
          <div key={item.itemId}>
            <ItemLink item={item} />
          </div>
        ))}
      </div>
      <div className="mt-8">{chartData && <RasendeChart {...chartData} />}</div>
    </div>
  );
};
export default Search;
