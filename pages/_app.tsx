import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Header } from "../components/header";
import { ThemeProvider } from "../hooks/theme-context";
import "../styles/globals.css";
import Head from "next/head";
import Script from "next/script";

export type Fueltype = "unleaded95" | "diesel" | "octane100";

// Create a client
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <Head>
        <link rel="manifest" href="site.webmanifest" />
      </Head>
      <Script data-goatcounter="https://rasende2.goatcounter.com/count" async src="//gc.zgo.at/count.js" />
      <ThemeProvider>
        <div className="h-screen flex flex-col">
          <Header />
          <main className="mb-auto mt-10">
            <Component {...pageProps} />
          </main>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
