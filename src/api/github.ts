import type { SuggestedUser } from '../types';
import { GithubApiError } from './errors';

const findGithubUser = async (username: string) => {
    const res = await fetch('/api/github/users/' + username, {
        headers: {
            Accept: 'application/vnd.github+json',
        },
    }).catch((error: Error) => {
        throw handleNetworkError(error);
    });
    const data = await handleResponse(res, username);
    console.log(data);
    return data;
};

const findGithubSuggestions = async (
    username: string,
): Promise<SuggestedUser[]> => {
    const res = await fetch('/api/github/search/users?q=' + username, {
        headers: {
            Accept: 'application/vnd.github+json',
        },
    }).catch((error) => {
        throw handleNetworkError(error);
    });
    const data = await handleResponse(res, username);
    console.log(data.items);
    return data.items.slice(0, 10);
};

const checkIfFollowingUser = async (username: string) => {
    const res = await fetch('/api/github/user/following/' + username).catch(
        (error) => {
            throw handleNetworkError(error);
        },
    );

    try {
        const data = await handleResponse(res, username);
        if (data) return true;
    } catch (error) {
        if (error instanceof GithubApiError && error.statusCode === 404) {
            return false;
        } else {
            throw error;
        }
    }
};

const followGithubUser = async (username: string) => {
    const res = await fetch('/api/github/user/following/' + username, {
        method: 'PUT',
    }).catch((error) => {
        throw handleNetworkError(error);
    });

    try {
        const data = await handleResponse(res, username);
        if (data) return true;
    } catch (error) {
        throw error;
    }
};

const unfollowGithubUser = async (username: string) => {
    const res = await fetch('/api/github/user/following/' + username, {
        method: 'DELETE',
    }).catch((error) => {
        throw handleNetworkError(error);
    });

    try {
        const data = await handleResponse(res, username);
        if (data) return true;
    } catch (error) {
        throw error;
    }
};

const handleResponse = async (response: Response, username: string) => {
    if (response.status === 204) {
        return { items: [] };
    }
    const contentType: string | null = response.headers.get('content-type');
    if (!contentType || !contentType!.includes('application/json')) {
        const error = new GithubApiError(
            'SERVER',
            'Server responded with an unexpected format',
        );
        throw error;
    }

    const payload = await response.json();

    if (!response.ok) {
        if (response.status >= 400 && response.status < 500) {
            switch (response.status) {
                case 400:
                    throw new GithubApiError(
                        'BAD_REQUEST',
                        `Bad request from client`,
                        400,
                    );
                case 404:
                    throw new GithubApiError(
                        'NOT_FOUND',
                        `User ${username} was not found`,
                        404,
                    );

                case 422:
                    throw new GithubApiError(
                        'VALIDATION',
                        `VALIDATION FAILED`,
                        422,
                        payload.errors,
                    );

                case 403:
                case 429:
                    throw new GithubApiError(
                        'RATE_LIMIT',
                        `GitHub rate limit exceeded - try again later`,
                        response.status,
                    );

                default:
                    throw new GithubApiError(
                        'CLIENT',
                        payload.message ||
                            `Something went wrong in the client side`,
                        response.status,
                    );
            }
        } else if (response.status >= 500)
            throw new GithubApiError(
                'SERVER',
                `Something went wrong in the server side`,
                response.status,
            );
        else {
            throw new GithubApiError(
                'UNKNOWN',
                `Something went wrong`,
                response.status,
            );
        }
    }

    return payload;
};

const handleNetworkError = (error: Error): GithubApiError => {
    console.error(error);
    return new GithubApiError(
        'NETWORK',
        'Network error while fetching the data',
    );
};

export {
    findGithubUser,
    findGithubSuggestions,
    checkIfFollowingUser,
    followGithubUser,
    unfollowGithubUser,
};
