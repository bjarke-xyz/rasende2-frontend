/* eslint-disable @next/next/no-img-element */
import { resetContent, toggleFeatured } from "../api/fake-news";
import { FakeNewsItem } from "../models/rss-item";
import { Badge } from "./badge";

export const FakeNewsArticle: React.FC<{ article: FakeNewsItem; admin?: boolean; generating?: boolean; }> = ({ article, admin, generating }) => {
    function handleToggleFeatured() {
        if (admin) {
            const password = prompt("password?");
            if (!password) return;
            return toggleFeatured(article.siteName, article.title, password);
        }
    }
    return (
        <div className="flex flex-col justify-center max-w-3xl">
            <div className="flex flex-row">
                {!!article?.siteName ? (
                    <h1 className="text-3xl">
                        <Badge text={article?.siteName.toString()} />
                    </h1>
                ) : null}
            </div>
            {admin ? (
                <div className="flex flex-row gap-4">
                    <button onClick={() => handleToggleFeatured()} className="btn-primary">Toggle featured</button>
                    <button onClick={() => resetContent(article.siteName, article.title)} className="btn-primary">Reset content</button>
                </div>
            ) : null}
            <h1 className="text-xl font-bold mt-4">{article.title}</h1>
            <div>
                {!!article.imageUrl ? (
                    <img className={generating ? 'animate-pulse' : ''} src={article.imageUrl} width="512" height="512" alt={article.title}></img>
                ) : null}
            </div>
            <div>
                {article.content
                    .split("\n")
                    .filter((line) => !!line?.trim())
                    .map((line, i, lines) => (
                        <p key={i} className="my-3">
                            {line}
                            {i === lines.length - 1 && generating ? (
                                <span className="animate-pulse">...</span>
                            ) : null}
                        </p>
                    ))}
            </div>
        </div>
    )
}