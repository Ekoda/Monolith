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
    onReceive?: (data: T) => void;
    onError?: (error: Error) => void;
}

export function useFetch<T>(fetchFunction: () => Promise<T>, options?: UseFetchServiceOptions<T>) {
    const {
        fetchOnMount = false,
        onReceive,
        onError
    } = options || {};

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [data, setData] = useState<T | null>(null);
    const initialized = useRef(false);

    const trigger = useCallback(() => {
        (async () => {
            setIsLoading(true);
            setError(null);
            initialized.current = true;
            fetchFunction()
                .then(r => {
                    setData(r);
                    if (onReceive) {
                        onReceive(r);
                    }
                })
                .catch(e => {
                    setError(e as Error);
                    if (onError) {
                        onError(e as Error);
                    }
                })
                .finally(() => {
                    initialized.current = false;
                    setIsLoading(false);
                });

        })();
    }, [fetchFunction, onReceive, onError]);

    useEffect(() => {
        if (fetchOnMount && !data && !initialized.current) {
            trigger();
        }
    }, [trigger, fetchOnMount]);

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