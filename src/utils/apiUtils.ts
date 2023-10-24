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

export function or404<T>(res: NextApiResponse, data: T): void | T {
    return data == null ? notFound404(res) : data;
}

export function or403(res: NextApiResponse, condition: boolean, message?: string): void | boolean {
    return condition || forbidden403(res, message);
}

type RequestHeaders = [string, string][] | Record<string, string> | Headers | undefined;

export function sanitizeHeaders(headers: RequestHeaders): RequestHeaders {
    const sensitiveHeaders: string[] = ["Authorization", "Cookie", "Set-Cookie"];

    if (!headers) {
        return headers;
    }

    if (headers instanceof Headers) {
        sensitiveHeaders.forEach(sensitiveHeader => {
            if (headers.has(sensitiveHeader)) {
                headers.set(sensitiveHeader, "***");
            }
        });
        return headers;
    }

    if (Array.isArray(headers)) {
        return headers.map(header =>
            sensitiveHeaders.includes(header[0]) ? [header[0], "***"] : header
        ) as [string, string][];
    }

    const sanitizedHeaders: Record<string, string> = {};
    for (const [key, value] of Object.entries(headers)) {
        sanitizedHeaders[key] = sensitiveHeaders.includes(key) ? "***" : value;
    }
    return sanitizedHeaders;
}

export async function fetchOrThrow(input: RequestInfo, init?: RequestInit, logError: boolean = false): Promise<Response> {
    const response = await fetch(input, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init?.headers
        },
    });
    if (!response.ok) {
        const errorMessage = `HTTP error: ${response.status} ${response.statusText}`;
        if (logError) {
            logger.log({
                level: "error",
                message: errorMessage,
                metadata: {
                    request: {
                        method: init?.method || "GET",
                        headers: sanitizeHeaders(init?.headers),
                        body: init?.body,
                    },
                    response: {
                        status: response.status,
                        statusText: response.statusText,
                        url: response.url,
                        body: await response.text()
                    }
                }
            }).catch(console.error);
        }
        throw new Error(errorMessage);
    }
    return response;
}

export function getHostInfo(environment: "test" | "development" | "production"): HostInfo {
    switch (environment) {
        case "test": return LOCALHOST;
        case "development": return LOCALHOST;
        case "production": return PRODUCTION;
        default: throw new Error(`Unknown environment: ${environment}`);
    }
}