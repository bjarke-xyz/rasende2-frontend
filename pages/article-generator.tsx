/* eslint-disable @next/next/no-img-element */
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL } from "../utils/constants";
import { FatalError, RetriableError } from "../utils/errors";
import { ContentEvent, ImageStatus } from "../utils/interfaces";
import { Badge } from "../components/badge";
import { Loader } from "../components/loader";

const ArticleGenerator: NextPage = () => {
  const router = useRouter();
  const [sseStarted, setSseStarted] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageStatus, setImageStatus] = useState<ImageStatus>("GENERATING")
  const siteName = router?.query?.siteName ?? "";
  const title = router?.query?.title ?? "";
  const admin = (router?.query?.admin ?? "false") === "true";
  console.log({ admin })
  useEffect(() => {
    async function generateContent() {
      if (sseStarted || hasGenerated) return;
      setSseStarted(true);
      setHasGenerated(true);
      const ctrl = new AbortController();
      const encodedSiteName = encodeURIComponent(siteName.toString());
      const encodedTitle = encodeURIComponent(title.toString());
      fetchEventSource(
        `${API_URL}/api/generate-content?siteName=${encodedSiteName}&title=${encodedTitle}`,
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
              setContent((oldContent) => oldContent + event.Content);
            } else if (event.imageUrl) {
              setImageUrl(event.imageUrl)
            }
            if (event.imageStatus) {
              setImageStatus(event.imageStatus)
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
    }
    if (siteName && title) {
      generateContent();
    }
  });
  async function toggleFeatured() {
    const password = prompt('password?')
    if (!password) {
      alert(':(')
      return;
    }
    const formData = new FormData();
    formData.append('password', password);
    formData.append('siteName', Array.isArray(siteName) ? siteName[0] : siteName);
    formData.append('title', Array.isArray(title) ? title[0] : title);
    fetch(`${API_URL}/api/set-highlight`, {
      method: "POST",
      body: formData,
    }).then(async resp => {
      if (resp.status > 299) {
        const text = await resp.text();
        alert(`STATUS: ${resp.status} // ${text}`);
      }
    }).catch(error => {
      alert(error)
    })
  }
  return (
    <div className="m-4">
      <Head>
        <title>
          {title} - {siteName} | Fake News Generator
        </title>
      </Head>
      <div className="flex flex-col justify-center max-w-3xl">
        <div className="flex flex-row">
          {!!siteName ? (
            <h1 className="text-3xl">
              <Badge text={siteName.toString()} />
            </h1>
          ) : null}
        </div>
        {admin ? (
          <>
            <button onClick={toggleFeatured} className="bg-slate-200 w-52">Toggle featured</button>
          </>
        ) : null}
        <h1 className="text-xl font-bold mt-4">{title}</h1>
        <div>
          {!!imageUrl ? (
            <img className={imageStatus === 'GENERATING' ? 'animate-pulse' : ''} src={imageUrl} width="512" height="512" alt={Array.isArray(title) ? title[0] : title}></img>
          ) : null}
        </div>
        <div>
          {content
            .split("\n")
            .filter((line) => !!line?.trim())
            .map((line, i, lines) => (
              <p key={i} className="my-3">
                {line}
                {i === lines.length - 1 && sseStarted ? (
                  <span className="animate-pulse">...</span>
                ) : null}
              </p>
            ))}
        </div>
      </div>
    </div>
  );
};

export default ArticleGenerator;
