export const fetcher = (
  url: string,
  resource: string,
  query: string,
  limit: number,
  searchContent: boolean = false
) =>
  fetch(
    `${url}/${resource}?q=${query}&limit=${limit}&content=${searchContent}`
  ).then((res) => res.json());
