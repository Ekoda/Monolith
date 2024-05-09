import {User} from "@prisma/client";
import {System} from "@/pages/_app";
import {useCallback, useEffect, useRef, useState} from "react";
import {fetchOrThrow} from "@/utils/apiUtils";


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

interface UseFetchServiceOptions<T> {
    fetchOnMount?: boolean; // Defaults to false if not specified
    defaultArgs?: any[]; // Defaults to empty array if not specified
    onReceive?: (data: T) => void;
    onError?: (error: Error) => void;
}

export function useFetch<T, Args extends any[]>(
    fetchFunction: (...args: Args) => Promise<T>,
    options?: UseFetchServiceOptions<T>
) {
    // @ts-ignore
    const {
        fetchOnMount = false,
        onReceive,
        onError,
        defaultArgs = []
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
            // @ts-ignore
            trigger(...defaultArgs);
        }
    }, [fetchOnMount, trigger, ...defaultArgs]);

    return { isLoading, error, data, trigger };
}


function getBaseHeaders() {
    return {
        "Content-Type": "application/json"
    }
}

export function fetchUser(system: System): Promise<User> {
    return fetchOrThrow(`${system.host}/api/users/current`, {
        method: "GET",
        headers: getBaseHeaders()
    }).then(r => r.json());
}