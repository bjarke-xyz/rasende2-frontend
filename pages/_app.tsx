import "../styles/globals.css";
import type { AppProps } from "next/app";
import React, { useEffect, useState } from "react";
import { ThemeProvider } from "../hooks/theme-context";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export type Fueltype = "unleaded95" | "diesel" | "octane100";

// Create a client
const queryClient = new QueryClient()

function MyApp({ Component, pageProps }: AppProps) {

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <div className="h-screen flex flex-col">
          <Header />
          <main className="mb-auto mt-10">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
