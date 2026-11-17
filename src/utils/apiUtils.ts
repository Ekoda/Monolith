import { NextApiResponse } from "next";
import {logger} from "@/backend/logging";
import {HostInfo, LOCALHOST, PRODUCTION} from "@/services/apiService";

const OK = 200;
const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const INTERNAL_SERVER_ERROR = 500;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const METHOD_NOT_ALLOWED = 405;
const CONFLICT = 409;

export function ok200<T>(res: NextApiResponse, data: T) {
    res.status(OK).json(data);
}

export function notFound404(res: NextApiResponse, message?: string) {
    res.status(NOT_FOUND).json({
        error: message || "Not found"
    });
}

export function methodNotAllowed405(res: NextApiResponse, message?: string) {
    res.status(METHOD_NOT_ALLOWED).json({
        error: message || "Method not allowed"
    });
}

export function badRequest400(res: NextApiResponse, message?: string) {
    res.status(BAD_REQUEST).json({
        error: message || "Bad request"
    });
}

export function internalError500(res: NextApiResponse, message?: string) {
    res.status(INTERNAL_SERVER_ERROR).json({
        error: message || "Internal server error"
    });
}

export function unauthorized401(res: NextApiResponse, message?: string) {
    res.status(UNAUTHORIZED).json({
        error: message || "Unauthorized"
    });
}

export function forbidden403(res: NextApiResponse, message?: string) {
    res.status(FORBIDDEN).json({
        error: message || "Forbidden"
    });
}

export function conflict409(res: NextApiResponse, message?: string) {
    res.status(CONFLICT).json({
        error: message || "Conflict"
    });
}

type RequestHeaders = [string, string][] | Record<string, string> | Headers | undefined;

const SENSITIVE_HEADERS = ["authorization", "cookie", "set-cookie", "proxy-authorization", "x-api-key"];
const REDACTED = "***";
const MAX_LOGGED_BODY_LENGTH = 1000;

function isSensitiveHeader(name: string): boolean {
    return SENSITIVE_HEADERS.includes(name.toLowerCase());
}

/**
 * Returns a copy of the headers with credentials redacted (case-insensitive).
 * Never mutates the input, so it is safe to call on headers that are still in use.
 */
export function sanitizeHeaders(headers: RequestHeaders): RequestHeaders {
    if (!headers) {
        return headers;
    }

    if (headers instanceof Headers) {
        const copy = new Headers();
        headers.forEach((value, key) => copy.set(key, isSensitiveHeader(key) ? REDACTED : value));
        return copy;
    }

    if (Array.isArray(headers)) {
        return headers.map(([key, value]) =>
            [key, isSensitiveHeader(key) ? REDACTED : value]
        ) as [string, string][];
    }

    const sanitizedHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
        sanitizedHeaders[key] = isSensitiveHeader(key) ? REDACTED : value;
    }
    return sanitizedHeaders;
}

/** Thrown by fetchOrThrow for non-2xx responses. Carries everything callers need to branch on. */
export class HttpError extends Error {
    constructor(
        public readonly status: number,
        public readonly statusText: string,
        public readonly url: string,
        /** Parsed JSON body if the response was JSON, otherwise the raw text (may be empty). */
        public readonly body: unknown,
    ) {
        super(HttpError.messageFor(status, statusText, body));
        this.name = "HttpError";
    }

    private static messageFor(status: number, statusText: string, body: unknown): string {
        // Our own API returns {error: "..."}; surface that message when present
        const apiMessage = typeof body === "object" && body !== null && "error" in body
            ? String((body as {error: unknown}).error)
            : undefined;
        return `HTTP error: ${status} ${statusText}`.trim() + (apiMessage ? ` - ${apiMessage}` : "");
    }
}

export interface FetchOptions extends RequestInit {
    /** Log failed responses through the app logger. Defaults to false. */
    logError?: boolean;
    /** Abort the request after this many milliseconds. Defaults to 30s; pass 0 to disable. */
    timeoutMs?: number;
}

const DEFAULT_TIMEOUT_MS = 30_000;

function hasJsonBody(body: BodyInit | null | undefined): boolean {
    // Only plain string bodies are assumed to be JSON. FormData, Blob, URLSearchParams etc.
    // must keep the Content-Type the browser/runtime sets (e.g. multipart boundaries).
    return typeof body === "string";
}

async function readBody(response: Response): Promise<unknown> {
    const text = await response.text();
    if (!text) return text;
    if (response.headers.get("content-type")?.includes("application/json")) {
        try {
            return JSON.parse(text);
        } catch {
            return text;
        }
    }
    return text;
}

/**
 * fetch() that throws an HttpError on non-2xx responses and on timeouts.
 * - Merges headers of any shape (object, array or Headers)
 * - Sets Content-Type: application/json only for string bodies without an explicit Content-Type
 * - Times out after 30s by default, while still honouring a caller-provided AbortSignal
 */
export async function fetchOrThrow(input: RequestInfo | URL, options: FetchOptions = {}): Promise<Response> {
    const {logError = false, timeoutMs = DEFAULT_TIMEOUT_MS, ...init} = options;

    const headers = new Headers(init.headers);
    if (hasJsonBody(init.body) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const signals = [init.signal, timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined]
        .filter((s): s is AbortSignal => !!s);
    const signal = signals.length > 1 ? AbortSignal.any(signals) : signals[0];

    const response = await fetch(input, {...init, headers, signal});
    if (response.ok) {
        return response;
    }

    const body = await readBody(response);
    const error = new HttpError(response.status, response.statusText, response.url, body);

    if (logError) {
        const loggedBody = typeof body === "string" ? body : JSON.stringify(body);
        logger.log({
            level: "error",
            message: error.message,
            error,
            metadata: {
                // Request bodies are deliberately not logged: they often hold passwords or personal data
                request: {
                    method: init.method || "GET",
                    headers: sanitizeHeaders(headers),
                },
                response: {
                    status: response.status,
                    statusText: response.statusText,
                    url: response.url,
                    body: loggedBody.slice(0, MAX_LOGGED_BODY_LENGTH),
                }
            }
        }).catch(console.error);
    }

    throw error;
}

/** fetchOrThrow + JSON parsing. Returns undefined for empty responses (e.g. 204 No Content). */
export async function fetchJson<T>(input: RequestInfo | URL, options?: FetchOptions): Promise<T> {
    const response = await fetchOrThrow(input, options);
    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
}

export function getHostInfo(environment: "test" | "development" | "production"): HostInfo {
    switch (environment) {
        case "test": return LOCALHOST;
        case "development": return LOCALHOST;
        case "production": return PRODUCTION;
        default: throw new Error(`Unknown environment: ${environment}`);
    }
}