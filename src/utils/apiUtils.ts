import { NextApiResponse } from "next";

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
