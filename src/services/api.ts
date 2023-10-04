import useFetch from "react-fetch-hook";
import {User} from "@prisma/client";

const BASE_URL = process.env.BASE_URL + "/api";

export function useFetchUser(id: number): useFetch.FetchResult<User> {
    return useFetch(
        `${BASE_URL}/users/${id}`,
        {
            method: "GET"
        }
    );
}