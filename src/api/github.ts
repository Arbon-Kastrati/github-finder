import { GithubApiError } from './errors';

const findGithubUser = async (user: string) => {
    const res = await fetch('/api/github/users/' + user).catch(
        (error: unknown) => {
            throw handleNetworkError(error);
        },
    );
    return await handleResponse(res, user);
};

const handleResponse = async (response: Response, username: string) => {
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

    console.log(payload);
    return payload;
};

const handleNetworkError = (error: unknown): GithubApiError => {
    console.error(error);
    return new GithubApiError(
        'NETWORK',
        'Network error while fetching the data',
    );
};

export { findGithubUser };
