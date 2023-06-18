export const fetcher = (
  url: string,
  resource: string,
  query: string,
  limit: number,
  searchContent: boolean = false,
  offset: number = 0
) =>
  fetch(
    `${url}/${resource}?q=${query}&limit=${limit}&content=${searchContent}&offset=${offset}`
  ).then((res) => res.json());

export const siteFetcher = (url: string, resource: string) =>
  fetch(`${url}/${resource}`).then((res) => res.json());
