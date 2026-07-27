export type ErrorType =
    | 'CLIENT'
    | 'NETWORK'
    | 'SERVER'
    | 'VALIDATION'
    | 'RATE_LIMIT'
    | 'BAD_REQUEST'
    | 'UNKNOWN'
    | 'NOT_FOUND';

export class GithubApiError extends Error {
    type: ErrorType;
    statusCode?: number;
    fieldErrors?: Record<string, string>;
    constructor(
        type: ErrorType,
        message?: string,
        statusCode?: number,
        fieldErrors?: Record<string, string>,
    ) {
        super(message);
        this.name = 'GitHubApiError';
        this.type = type;
        this.statusCode = statusCode;
        this.fieldErrors = fieldErrors;
    }
}
