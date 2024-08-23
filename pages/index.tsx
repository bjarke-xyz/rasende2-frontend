import { useQuery } from "@tanstack/react-query";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { charts, search } from "../api/search";
import { Centered } from "../components/centered";
import { RasendeChart } from "../components/chart";
import { ItemLink } from "../components/item-link";
import { formatDistanceStrict } from "date-fns/formatDistanceStrict";
import { parseISO } from "date-fns/parseISO";
import { da } from 'date-fns/locale'

interface IndexProps {
  lol: string;
}

const Home: NextPage<IndexProps> = (props) => {
  console.log(props)
  const [queryParam, setQueryParam] = useState<string>("rasende");
  const limit = 10;
  const { data, error } = useQuery({
    queryKey: ['search', queryParam, limit],
    queryFn: () => search(queryParam, limit),
  })

  const { data: chartData } = useQuery({
    queryKey: ['charts', queryParam],
    queryFn: () => charts(queryParam),
  })

  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="m-4">
      <Head>
        <title>Raseri i de danske medier | Rasende</title>
      </Head>
      {error && <p>Der skete en fejl :(</p>}
      {!error && data && data.items && (
        <div>
          <Centered>
            <p>Seneste raseri:</p>
          </Centered>
          <Centered bigText>
            {data.items.length === 0 && <p>Ingen raseri!</p>}
            {data.items.length > 0 && (
              <div>
                <ItemLink item={data.items[0]} />
              </div>
            )}
          </Centered>
          <Centered>
            {data.items.length > 0 && (
              <div title={data.items[0].published}>
                {formatDistanceStrict(now, parseISO(data.items[0].published), { locale: da })}{" "}
                siden
              </div>
            )}
          </Centered>
          <div className="flex flex-col m-4 mt-8">
            <p className="text-lg font-bold">Tidligere raserier:</p>
            {data.items.slice(1).map((item) => (
              <div key={item.itemId}>
                <ItemLink item={item} />
              </div>
            ))}
          </div>
          <div className="mt-8">
            {chartData && <RasendeChart {...chartData} />}
          </div>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = (async () => {
  return {
    props: {
      lol: 'hej'
    }
  }
}) satisfies GetServerSideProps<IndexProps>;

export default Home;
