import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { Header } from "../components/header";
import { ThemeProvider } from "../hooks/theme-context";
import "../styles/globals.css";

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
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default MyApp;
