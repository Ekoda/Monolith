import {fetchOrThrow} from "@/utils/apiUtils";

const URL = "https://jsonplaceholder.typicode.com";

const exampleApi = {

    async getPost(id: number): Promise<ExamplePost> {
        const response = await fetchOrThrow(`${URL}/posts/${id}`);
        return await response.json();
    },

    async createPost(post: ExamplePost): Promise<ExamplePost> {
        const response = await fetchOrThrow(`${URL}/posts`, {
            method: "POST",
            body: JSON.stringify(post)
        });
        return await response.json();
    }

}

export default exampleApi;