import { RssItem } from "../models/rss-item";

export const ItemLink: React.FC<{ item: RssItem }> = ({ item }) => {
  return (
    <a href={item.link} className="hover:underline">
      {item.siteName}: {item.title}
    </a>
  );
};
