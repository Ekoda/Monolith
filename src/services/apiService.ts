import useFetch from "react-fetch-hook";
import {User} from "@prisma/client";

const BASE_URL = process.env.BASE_URL + "/api";

function getBaseHeaders() {
    return {
        "Content-Type": "application/json"
    }
}

export function useFetchUser(id: number): useFetch.FetchResult<User> {
    return useFetch(
        `${BASE_URL}/users/current`,
        {
            method: "GET",
            headers: getBaseHeaders()
        }
    );
}