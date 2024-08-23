import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "../hooks/theme-context";

export const Header: React.FC = () => {
  const router = useRouter();
  const { theme, toggle } = useTheme();
  const currentRoute = router.pathname;
  return (
    <div className="flex flex-col items-center py-2">
      {/* <div>
        <span className="text-2xl">Rasende!</span>
      </div> */}
      <div className="flex flex-row space-x-4">
        <div>
          <Link href="/" className={currentRoute === "/" ? "font-bold" : ""}>
            Rasende
          </Link>
        </div>
        <div>
          <Link href="/search" className={currentRoute === "/search" ? "font-bold" : ""}>
            Søg
          </Link>
        </div>
        <div>
          <Link
            href="/fake-news"
            className={currentRoute === "/fake-news" ? "font-bold" : ""}>
            Falske Nyheder
          </Link>
        </div>
        <button title="Toggle color theme" onClick={() => toggle()}>
          {theme === "auto" && "🌓"}
          {theme === "dark" && "🌚"}
          {theme === "light" && "🌞"}
        </button>
      </div>
    </div>
  );
};
