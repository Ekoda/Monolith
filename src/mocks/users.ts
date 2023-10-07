import {User} from "@prisma/client";

const users: User[] = [
    {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        createdAt: new Date("2023-01-20T00:00:00Z"),
        updatedAt: new Date("2023-01-20T00:00:00Z"),
        lastLogin: new Date("2023-01-20T00:00:00Z")
    },
    {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        createdAt: new Date("2023-01-21T00:00:00Z"),
        updatedAt: new Date("2023-01-21T00:00:00Z"),
        lastLogin: new Date("2023-01-21T00:00:00Z")
    },
];
