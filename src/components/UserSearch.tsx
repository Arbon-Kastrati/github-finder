import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { findGithubUser, findGithubSuggestions } from '../api/github';
import { parseApiError } from '../api/errors';
import UserCard from './UserCard';
import RecentSearches from './RecentSearches';
import SuggestionDropdown from './SuggestionDropdown';
import GenericError from './errors/GenericError';
import ValidationError from './errors/ValidationError';
import UnexpectedError from './errors/UnexpectedError';
import { useDebounce } from 'use-debounce';

const UserSearch = () => {
    const [username, setUsername] = useState<string>('');
    const [submittedUsername, setSubmittedUsername] = useState<string>('');
    const [recentSearches, setRecentSearches] = useState<string[]>([]);
    const [dismissSuggestions, setDismissSuggestions] =
        useState<boolean>(false);

    const {
        data: userData,
        isLoading: userIsLoading,
        error: userError,
        status: userStatus,
    } = useQuery({
        queryKey: ['users', submittedUsername],
        queryFn: () => findGithubUser(submittedUsername),
        enabled: !!submittedUsername,
    });

    const [debouncedUsername] = useDebounce(username, 300);

    const {
        data: suggestions,
        status: suggestionsStatus,
        isLoading: suggestionsIsLoading,
        error: suggestionsError,
    } = useQuery({
        queryKey: ['suggestions', debouncedUsername],
        queryFn: () => findGithubSuggestions(debouncedUsername),
        enabled: !!debouncedUsername,
    });

    useEffect(() => {
        if (userData && userStatus === 'success') {
            setRecentSearches((prev) => {
                return [
                    submittedUsername,
                    ...prev.filter((item) => item !== submittedUsername),
                ].slice(0, 5);
            });
        }
    }, [submittedUsername, userData, userStatus]);

    const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const sanitizedUsername = username.trim();
        if (sanitizedUsername === '') return;
        setSubmittedUsername(sanitizedUsername);
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const sanitizedUsername = e.target.value.trim();
        if (sanitizedUsername === '') return;
        setUsername(sanitizedUsername);
        setDismissSuggestions(false);
    };

    const showSuggestions = !!(
        suggestionsStatus === 'success' &&
        suggestions &&
        !dismissSuggestions
    );

    const parsedUserError = parseApiError(userError);
    const parsedSuggestionsError = parseApiError(suggestionsError);

    return (
        <section className="w-md m-auto p-6 bg-white rounded-lg shadow-md mt-20 mb-10">
            {parsedUserError && (
                <GenericError message={parsedUserError.message} />
            )}
            {parsedSuggestionsError && (
                <GenericError message={parsedSuggestionsError.message} />
            )}
            <div className="text-center mb-10">
                <h1 className="text-3xl font-bold">Github Finder</h1>
            </div>
            <form onSubmit={handleSubmit} className="relative">
                <input
                    onChange={(e) => handleSearch(e)}
                    onFocus={(e) => handleSearch(e)}
                    value={username}
                    type="text"
                    placeholder="Search GitHub profile..."
                    className="dropdown w-full rounded-lg p-3 border border-2 border-gray-300 mb-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                {suggestionsIsLoading && (
                    <p className="text-center mb-2">Loading...</p>
                )}
                {showSuggestions && (
                    <SuggestionDropdown
                        suggestions={suggestions}
                        selectSuggestion={(user) => {
                            setUsername('');
                            setSubmittedUsername(user);
                        }}
                        setDismissSuggestions={setDismissSuggestions}
                    />
                )}
                {userIsLoading && (
                    <p className="text-center my-2">Loading...</p>
                )}
                {parsedUserError?.isValidation && (
                    <ValidationError
                        message={parsedUserError.fieldErrors?.username[0]}
                    />
                )}
                {parsedSuggestionsError?.isValidation && (
                    <ValidationError
                        message={
                            parsedSuggestionsError.fieldErrors?.username[0]
                        }
                    />
                )}
                <button className="w-full p-3 bg-blue-600 text-white text-lg rounded-lg cursor-pointer hover:bg-blue-700">
                    Submit
                </button>
            </form>
            {userData && <UserCard user={userData} />}
            {recentSearches.length > 0 && (
                <RecentSearches
                    searches={recentSearches}
                    searchedUserClicked={(user: string) => {
                        setSubmittedUsername(user);
                        setUsername('');
                    }}
                />
            )}
            {parsedUserError?.isUnexpected && (
                <UnexpectedError message={parsedUserError.message} />
            )}{' '}
            {parsedSuggestionsError?.isUnexpected && (
                <UnexpectedError message={parsedSuggestionsError.message} />
            )}
        </section>
    );
};

export default UserSearch;
