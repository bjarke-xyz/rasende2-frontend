import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useQuery } from "@tanstack/react-query";
import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import { getSites } from "../api/sites";
import { Badge } from "../components/badge";
import { HighlightedArticles } from "../components/highlighted-articles";
import { API_URL } from "../utils/constants";
import { FatalError, RetriableError } from "../utils/errors";
import { ContentEvent } from "../utils/interfaces";

const limit = 200;

const TitleGenerator: NextPage = () => {
  const [sseStarted, setSseStarted] = useState(false);
  const [titles, setTitles] = useState<string>("");
  const [cursor, setCursor] = useState<string | null>(null);
  const { data: sites } = useQuery({
    queryKey: ['sites'],
    queryFn: () => getSites(),
  })
  const [site, setSite] = useState("");
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [temperature, setTemperature] = useState(1);
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
        `${API_URL}/api/generate-titles?siteName=${siteName}&offset=${limit * page
        }&limit=${limit}&temperature=${temperature}&cursor=${cursor}`,
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
            if (event.cursor) {
              setCursor(event.cursor);
            }
          },
          onerror(err) {
            ctrl.abort();
            setSseStarted(false);
            if (err instanceof FatalError || err instanceof RetriableError) {
              if (err instanceof RetriableError) {
                alert("For mange forespørgsler, prøv igen om lidt");
              }
            }
            throw err; // rethrow to stop the operation
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
            <div className="mt-2 flex flex-col">
              <label htmlFor="slider">Temperature</label>
              <input
                id="slider"
                disabled={sseStarted}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setTemperature(parseFloat(e.target.value))
                }
                value={temperature}
                type="range"
                min="0"
                max="1"
                step="0.1"
              ></input>
            </div>
            <div>
              <label htmlFor="site">Nyhedsmedie</label>
              <select
                id="site"
                className="select"
                onChange={onSiteChange}
                disabled={sseStarted}
                defaultValue={""}
              >
                <option value="" disabled>
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
            <h1 className="text-3xl">
              <Badge text={site} />
            </h1>
          ) : null}
        </div>
        {titles
          .split("\n")
          .filter((line) => !!line?.trim())
          .map((line) => cleanLine(line))
          .map((line, i, lines) => (
            <p key={i}>
              <a
                className={sseStarted ? "" : "hover:underline"}
                target="_blank"
                href={
                  sseStarted
                    ? undefined
                    : `/article-generator?siteName=${site}&title=${encodeURIComponent(
                      line
                    )}`
                }
                rel="noreferrer"
              >
                - {line}
                {i === lines.length - 1 && sseStarted ? (
                  <span className="animate-pulse">...</span>
                ) : null}
              </a>
            </p>
          ))}
      </div>
      <div>
        {site?.length > 0 ? (
          <button
            className="btn-primary"
            onClick={() => loadMore()}
            disabled={sseStarted}
          >
            Vis mere
          </button>
        ) : null}
      </div>

      {/* <HighlightedArticles /> */}
    </div>
  );
};

export default TitleGenerator;
