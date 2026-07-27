export type User = {
    name: string;
    avatar_url: string;
    html_url: string;
    bio: string;
};

export type RecentSearchesProps = {
    searches: string[];
    searchedUserClicked: (user: string) => void;
};
