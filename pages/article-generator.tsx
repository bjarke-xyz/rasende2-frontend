import { fetchEventSource } from "@microsoft/fetch-event-source";
import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL } from "../utils/constants";
import { FatalError, RetriableError } from "../utils/errors";
import { ContentEvent, ImageStatus } from "../utils/interfaces";
import { FakeNewsArticle } from "../components/fake-news-article";

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

  return (
    <div className="m-4">
      <Head>
        <title>
          {title.toString()} - {siteName.toString()} | Fake News Generator
        </title>
      </Head>
      <FakeNewsArticle generating={imageStatus === 'GENERATING' || sseStarted} article={{
        siteId: 0,
        siteName: siteName.toString(),
        title: title.toString(),
        content: content,
        imageUrl: imageUrl,
        published: "",
        votes: 0,
      }} />
    </div>
  );
};

export default ArticleGenerator;
