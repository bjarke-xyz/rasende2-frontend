import { useQueryClient } from "@tanstack/react-query";
import { FakeNewsItem } from "../models/rss-item";
import { featuredFakeNewsQueryKey } from "./highlighted-articles";
import { getVotedStorage, setVotedStorage, voteFakeNews } from "../api/fake-news";
import { useEffect, useState } from "react";

export const FakeNewsVotes: React.FC<{ fakeNews: FakeNewsItem }> = ({ fakeNews }) => {
    const queryClient = useQueryClient();
    const [votes, setVotes] = useState(fakeNews.votes);
    function handleVote(direction: 'up' | 'down') {
        if (direction === 'up') {
            setVotes(current => current + 1)
        } else {
            setVotes(current => {
                if (current === 0) {
                    return 0
                } else {
                    return current - 1;
                }
            })
        }
        voteFakeNews(fakeNews.siteName, fakeNews.title, direction).then(resp => {
            queryClient.invalidateQueries({ queryKey: [featuredFakeNewsQueryKey] })
            setVotedStorage(fakeNews.siteName, fakeNews.title, direction)
            setUserVote(direction);
        }).catch(error => {
            console.log('error voting', error)
            setVotes(fakeNews.votes);
        })
    }
    const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
    useEffect(() => {
        setUserVote(getVotedStorage(fakeNews.siteName, fakeNews.title))
    }, [fakeNews.siteName, fakeNews.title])
    return (
        <div className="flex items-center space-x-4">
            <button
                onClick={() => handleVote('up')}
                className={`text-2xl ${userVote === 'up' ? 'text-green-500' : 'text-gray-400'
                    }`}
            >
                ▲
            </button>
            <span className="text-lg font-semibold">{votes}</span>
            <button
                onClick={() => handleVote('down')}
                className={`text-2xl ${userVote === 'down' ? 'text-red-500' : 'text-gray-400'
                    }`}
            >
                ▼
            </button>
        </div>
    )
}