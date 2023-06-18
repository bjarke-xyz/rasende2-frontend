import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import { API_URL } from "../utils/constants";
import { siteFetcher } from "../utils/fetcher";

interface ContentEvent {
  Content: string;
}

const TitleGenerator: NextPage = () => {
  const [sseStarted, setSseStarted] = useState(false);
  const [titles, setTitles] = useState<string>("");
  const { data: sites } = useSWR<string[]>([API_URL, "sites"], siteFetcher);
  const [site, setSite] = useState("");
  const onSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSite(e.target.value);
    setTitles("");
    startTitleGenerator(e.target.value);
  };
  const startTitleGenerator = (siteName: string) => {
    if (sseStarted || !siteName) {
      return;
    }
    setSseStarted(true);
    const sse = new EventSource(
      `${API_URL}/generate-titles?siteName=${siteName}`
    );
    sse.onmessage = (e) => {
      const event = JSON.parse(e.data) as ContentEvent;
      if (event.Content) {
        setTitles((oldTitles) => oldTitles + event.Content);
      }
    };
    sse.onerror = () => {
      sse.close();
      setSseStarted(false);
    };
  };
  const loadMore = () => {
    setTitles((oldTitles) => oldTitles + "\n");
    startTitleGenerator(site);
  };
  return (
    <div className="m-4">
      <Head>
        <title>Fake News Generator</title>
      </Head>
      <div className="flex justify-center">
        <div className="flex flex-row align-middle space-x-2">
          <div className="flex flex-col justify-center align-middle">
            <h3>Vælg nyhedsmedie</h3>
            <div>
              <select
                className="p-1 block border border-solid border-gray-300 rounded-md dark: text-slate-900"
                onChange={onSiteChange}
                disabled={sseStarted}
              >
                {(sites ?? []).map((site) => (
                  <option key={site}>{site}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center mt-16">
        <div className="flex flex-row">
          <h1 className="text-xl">{site}</h1>
          {site?.length > 0 ? (
            <button
              className="bg-blue-100 enabled:hover:bg-blue-200 mx-2 px-1 rounded-md text-slate-900"
              onClick={() => loadMore()}
              disabled={sseStarted}
            >
              Vis mere
            </button>
          ) : null}
        </div>
        {titles.split("\n").map((line, i) => (
          <p key={i}>{line}</p>
        ))}

        {sseStarted ? <p className="animate-pulse">- ...</p> : ""}
      </div>
    </div>
  );
};

export default TitleGenerator;
