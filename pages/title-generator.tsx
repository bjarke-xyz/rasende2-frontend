import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import useSWR from "swr";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { API_URL } from "../utils/constants";
import { siteFetcher } from "../utils/fetcher";
import { Badge } from "../components/badge";

interface ContentEvent {
  Content: string;
}

class RetriableError extends Error {}
class FatalError extends Error {}

const limit = 300;

const TitleGenerator: NextPage = () => {
  const [sseStarted, setSseStarted] = useState(false);
  const [titles, setTitles] = useState<string>("");
  const { data: sites } = useSWR<string[]>([API_URL, "sites"], siteFetcher);
  const [site, setSite] = useState("");
  const [numberOfPages, setNumberOfPages] = useState(0);
  const onSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSite(e.target.value);
    setTitles("");
    setNumberOfPages(0);
    startTitleGenerator(e.target.value, 0);
  };
  const startTitleGenerator = (siteName: string, page: number) => {
    if (sseStarted || !siteName) {
      return;
    }
    setSseStarted(true);
    try {
      const ctrl = new AbortController();
      fetchEventSource(
        `${API_URL}/generate-titles?siteName=${siteName}&offset=${
          limit * page
        }&limit=${limit}`,
        {
          async onopen(response) {
            if (response.ok) {
              return;
            } else if (response.status == 429) {
              throw new RetriableError("Try again later");
            } else {
              throw new FatalError("Error connecting");
            }
          },
          onmessage(ev) {
            const event = JSON.parse(ev.data) as ContentEvent;
            if (event.Content) {
              setTitles((oldTitles) => oldTitles + event.Content);
            }
          },
          onerror(err) {
            ctrl.abort();
            setSseStarted(false);
            if (err instanceof FatalError || err instanceof RetriableError) {
              if (err instanceof RetriableError) {
                alert("For mange forespørgsler, prøv igen om lidt");
              }
              throw err; // rethrow to stop the operation
            }
          },
          onclose() {
            setSseStarted(false);
          },
          signal: ctrl.signal,
          openWhenHidden: true,
        }
      );
    } catch (error) {
      console.log("caught error", error);
    }
  };
  const loadMore = () => {
    setTitles((oldTitles) => oldTitles + "\n");
    setNumberOfPages((oldNumber) => oldNumber + 1);
    startTitleGenerator(site, numberOfPages + 1);
  };
  const cleanLine = (line: string) => {
    if (line?.trim()?.startsWith("-")) {
      return line.replace("-", "").trim();
    }
    return line;
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
                <option value="" selected disabled>
                  Vælg
                </option>
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
          {!!site ? (
            <h1 className="text-xl">
              <Badge text={site} />
            </h1>
          ) : null}
        </div>
        {titles
          .split("\n")
          .filter((line) => !!line?.trim())
          .map((line, i) => (
            <p key={i}>- {cleanLine(line)}</p>
          ))}

        {sseStarted ? <p className="animate-pulse">- ...</p> : ""}
      </div>
      <div>
        {site?.length > 0 ? (
          <button
            className="bg-blue-100 enabled:hover:bg-blue-200 mt-5 p-2 rounded-md text-slate-900"
            onClick={() => loadMore()}
            disabled={sseStarted}
          >
            Vis mere
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default TitleGenerator;