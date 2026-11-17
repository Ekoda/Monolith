import type {User} from "@/backend/database/generated/prisma/browser";
import {System} from "@/pages/_app";
import {useCallback, useEffect, useRef, useState} from "react";
import {fetchJson} from "@/utils/apiUtils";


export type HostInfo = {
    host: string;
    baseUrl: string;
}
export const LOCALHOST: HostInfo = {
    host: "http://localhost:3000",
    baseUrl: "localhost:3000"
}

export const PRODUCTION: HostInfo = {
    host: "https://www.example.com",
    baseUrl: "example.com"
}

interface UseFetchServiceOptions<T, Args extends unknown[]> {
    fetchOnMount?: boolean; // Defaults to false if not specified
    defaultArgs?: Args; // Args passed on mount when fetchOnMount is true
    onReceive?: (data: T) => void;
    onError?: (error: Error) => void;
}

export function useFetch<T, Args extends unknown[]>(
    fetchFunction: (...args: Args) => Promise<T>,
    options?: UseFetchServiceOptions<T, Args>
) {
    const {
        fetchOnMount = false,
        onReceive,
        onError,
        defaultArgs = [] as unknown as Args
    } = options || {};

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<T | null>(null);
    const fetchCountRef = useRef<number>(0);

    const trigger = useCallback((...args: Args) => {
        setIsLoading(true);
        setError(null);

        fetchCountRef.current++;

        fetchFunction(...args)
            .then(response => {
                setData(response);
                if (onReceive) {
                    onReceive(response);
                }
            })
            .catch(err => {
                setError(err as Error);
                if (onError) {
                    onError(err as Error);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [fetchFunction, onReceive, onError]);

    useEffect(() => {
        if (fetchOnMount && fetchCountRef.current === 0) {
            trigger(...defaultArgs);
        }
    }, [fetchOnMount, trigger, ...defaultArgs]);

    return { isLoading, error, data, trigger };
}


export function fetchUser(system: System): Promise<User> {
    return fetchJson<User>(`${system.host}/api/users/current`);
}
