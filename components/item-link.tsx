import { RssItem } from "../models/rss-item";
import { Badge } from "./badge";

export const ItemLink: React.FC<{ item: RssItem }> = ({ item }) => {
  return (
    <a
      href={item.link}
      target="_blank"
      rel="noreferrer"
      className="hover:underline"
    >
      <Badge text={item.siteName} /> {item.title}
    </a>
  );
};
