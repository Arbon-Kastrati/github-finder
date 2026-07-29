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

export function parseApiError(error: Error | null) {
    if (!error) return null;
    const isCustom = error instanceof GithubApiError;

    const parsedErr = {
        isValidation: isCustom && error.type === 'VALIDATION',
        isGeneric: isCustom && error.type !== 'VALIDATION',
        isUnexpected: error && !isCustom,
        message: error?.message,
    };

    if (isCustom) return { ...parsedErr, ...error };
}
