import { useQueryClient } from "@tanstack/react-query";
import { FakeNewsItem } from "../models/rss-item";
import { featuredFakeNewsQueryKey } from "./highlighted-articles";
import { getVoted, setVoted, voteFakeNews } from "../api/fake-news";

export const FakeNewsVotes: React.FC<{ fakeNews: FakeNewsItem }> = ({ fakeNews }) => {
    const queryClient = useQueryClient();
    function handleVote(direction: 'up' | 'down') {
        voteFakeNews(fakeNews.siteName, fakeNews.title, direction).then(resp => {
            queryClient.invalidateQueries({ queryKey: [featuredFakeNewsQueryKey] })
            setVoted(fakeNews.siteName, fakeNews.title, direction)
        }).catch(error => {
            console.log('error voting', error)
        })
    }
    const alreadyVoted = getVoted(fakeNews.siteName, fakeNews.title)
    return (
        <div className="flex flex-col justify-center text-2xl">
            <button className={alreadyVoted === 'up' ? "bg-green-300 rounded p-0.5" : ""} disabled={alreadyVoted === 'up'} onClick={() => handleVote('up')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px">
                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                </svg>

            </button>
            <div>{fakeNews.votes}</div>
            <button className={alreadyVoted === 'down' ? "bg-red-400 rounded p-0.5" : ""} disabled={alreadyVoted === 'down'} onClick={() => handleVote('down')}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24px">
                    <path fillRule="evenodd" d="M12 2.25a.75.75 0 0 1 .75.75v16.19l6.22-6.22a.75.75 0 1 1 1.06 1.06l-7.5 7.5a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 1 1 1.06-1.06l6.22 6.22V3a.75.75 0 0 1 .75-.75Z" clipRule="evenodd" />
                </svg>

            </button>
        </div>
    )
}