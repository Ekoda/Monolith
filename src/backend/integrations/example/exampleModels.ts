interface Example {
    fetchedAt: Date,
    post: ExamplePost
}

interface ExamplePost {
    userId: number,
    id: number,
    title: string,
    body: string
}