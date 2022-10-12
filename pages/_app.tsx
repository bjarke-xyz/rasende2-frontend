import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "../hooks/theme-context";
import { Footer } from "../components/footer";
import { Header } from "../components/header";

export type Fueltype = "unleaded95" | "diesel" | "octane100";

function MyApp({ Component, pageProps }: AppProps) {
  const [showing, setShowing] = useState(false);

  // nextjs hacks https://stackoverflow.com/a/71797054
  useEffect(() => {
    setShowing(true);
  }, []);

  if (!showing) {
    return null;
  }
  if (typeof window === "undefined") {
    return <></>;
  } else {
    return (
      <ThemeProvider>
        <div className="h-screen flex flex-col">
          <Header />
          <main className="mb-auto mt-10">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    );
  }
}

export default MyApp;
