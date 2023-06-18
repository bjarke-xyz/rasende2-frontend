import Link from "next/link";
import { useRouter } from "next/router";

export const Header: React.FC = () => {
  const router = useRouter();
  const currentRoute = router.pathname;
  return (
    <div className="flex flex-col items-center py-2">
      {/* <div>
        <span className="text-2xl">Rasende!</span>
      </div> */}
      <div className="flex flex-row space-x-4">
        <div>
          <Link href="/">
            <a className={currentRoute === "/" ? "font-bold" : ""}>Rasende</a>
          </Link>
        </div>
        <div>
          <Link href="/search">
            <a className={currentRoute === "/search" ? "font-bold" : ""}>Søg</a>
          </Link>
        </div>
        <div>
          <Link href="/title-generator">
            <a
              className={currentRoute === "/title-generator" ? "font-bold" : ""}
            >
              Fake News Generator
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
};
