import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { findGithubUser } from '../api/github';
import { GithubApiError } from '../api/errors';
import UserCard from './UserCard';
import RecentSearches from './RecentSearches';

const UserSearch = () => {
    const [username, setUsername] = useState<string>('');
    const [submittedUsername, setSubmittedUsername] = useState<string>('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);

    const { data, isLoading, isError, error, status } = useQuery({
        queryKey: ['users', submittedUsername],
        queryFn: () => findGithubUser(submittedUsername),
        enabled: !!submittedUsername,
    });

    useEffect(() => {
        if (data && status === 'success') {
            setRecentSearches((prev) => {
                return [
                    submittedUsername,
                    ...prev.filter((item) => item !== submittedUsername),
                ].slice(0, 5);
            });
        }
    }, [submittedUsername, data, status]);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmittedUsername(username);
    };

    const customError = error instanceof GithubApiError;
    const isValidationError = customError && error.type === 'VALIDATION';
    const isGenericError = customError && error.type !== 'VALIDATION';
    const isUnexpectedError = isError && !customError;

    return (
        <section className="w-lg m-auto p-6 bg-white rounded-lg shadow-md mt-30 mb-10">
            {isGenericError && (
                <p className="bg-red-500 text-white ">{error.message}</p>
            )}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold">Github Finder</h1>
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    type="text"
                    placeholder="Search GitHub profile..."
                    className="w-full rounded-lg p-3 border border-2 border-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {isLoading && <p className="text-center my-2">Loading...</p>}
                {isValidationError && (
                    <p className="bg-red-500 text-white ">
                        {error.fieldErrors?.username[0]}
                    </p>
                )}
                <button className="w-full p-3 bg-blue-600 text-white text-lg rounded-lg cursor-pointer hover:bg-blue-700">
                    Submit
                </button>
                {data && <UserCard user={data} />}
                {recentSearches.length > 0 && (
                    <RecentSearches
                        searches={recentSearches}
                        searchedUserClicked={(user: string) => {
                            setSubmittedUsername(user);
                            setUsername('');
                        }}
                    />
                )}
            </form>
            {isUnexpectedError && (
                <p className="bg-red-500 text-white ">
                    An unexpected error occured: {error.message}
                </p>
            )}
        </section>
    );
};

export default UserSearch;
