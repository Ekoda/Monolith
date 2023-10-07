import exampleApi from "@/backend/integrations/example/exampleApi";
import {getCurrentTime} from "@/utils/timeUtils";

export async function getExamplePost(id: number): Promise<Example> {
    return {
        fetchedAt: getCurrentTime(),
        post: await exampleApi.getPost(id)
    }

}

export async function createExamplePost(post: ExamplePost): Promise<Example> {
    return {
        fetchedAt: getCurrentTime(),
        post: await exampleApi.createPost(post)
    }
}
