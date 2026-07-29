import { useEffect, useRef } from 'react';
import type { SuggestedUserProps } from '../types';
const SuggestionDropdown = ({
    suggestions,
    selectSuggestion,
    setDismissSuggestions,
}: SuggestedUserProps) => {
    const suggestionsRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setDismissSuggestions(true);
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            const element = e.target as HTMLElement;
            if (!element?.closest('.dropdown')) {
                setDismissSuggestions(true);
            }
        };

        window.addEventListener('click', handleOutsideClick);

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <section
            ref={suggestionsRef}
            className="dropdown absolute w-full max-h-50 bg-white rounded-lg border border-2 border-gray-300 top-14 overflow-y-auto"
        >
            {suggestions.length === 0 ? (
                <p className="p-4 text-sm">No suggestion found</p>
            ) : (
                <ul className="p-2">
                    {suggestions.map((suggestion) => (
                        <li
                            className="flex items-center p-1 gap-2 cursor-pointer hover:bg-gray-200 rounded"
                            onClick={() => selectSuggestion(suggestion.login)}
                        >
                            <img
                                src={suggestion.avatar_url}
                                alt="user profile"
                                className="w-10 h-10 rounded-full"
                            />
                            {suggestion.login}
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
};

export default SuggestionDropdown;
