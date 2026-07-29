import type { Dispatch, SetStateAction } from 'react';

export type User = {
    name: string;
    login: string;
    avatar_url: string;
    html_url: string;
    bio: string;
};

export type SuggestedUser = {
    login: string;
    avatar_url: string;
    html_url: string;
};

export type SuggestedUserProps = {
    suggestions: SuggestedUser[];
    setDismissSuggestions: Dispatch<SetStateAction<boolean>>;
    selectSuggestion: (user: string) => void;
};

export type RecentSearchesProps = {
    searches: string[];
    searchedUserClicked: (user: string) => void;
};
