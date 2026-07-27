import { FaClock, FaUser } from 'react-icons/fa';
import type { RecentSearchesProps } from '../types';

const RecentSearches = ({
    searches,
    searchedUserClicked,
}: RecentSearchesProps) => {
    return (
        <section className="text-center bg-gray-100 rounded-lg p-8 my-4">
            <header className="flex items-center gap-2 mb-6">
                <FaClock />
                <h1 className="text-xl font-bold ">Recent Searches</h1>
            </header>
            <ul>
                {searches.map((user) => (
                    <li
                        key={user}
                        className="flex items-center justify-center gap-2 cursor-pointer p-3 bg-gray-200 rounded-lg my-2"
                        onClick={() => searchedUserClicked(user)}
                    >
                        <FaUser />
                        {user}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default RecentSearches;
