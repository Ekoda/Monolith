import {fetchJson} from "@/utils/apiUtils";

const URL = "https://jsonplaceholder.typicode.com";

const exampleApi = {

    async getPost(id: number): Promise<ExamplePost> {
        return fetchJson<ExamplePost>(`${URL}/posts/${id}`);
    },

    async createPost(post: ExamplePost): Promise<ExamplePost> {
        return fetchJson<ExamplePost>(`${URL}/posts`, {
            method: "POST",
            body: JSON.stringify(post),
            logError: true,
        });
    }

}

export default exampleApi;
