import db from "@/backend/database/database";
import {User} from "@prisma/client";
import {getCurrentTime} from "@/utils/timeUtils";


export async function findUserById(id: string): Promise<User | null> {
    return db.user.findUnique({where: {id}});
}

export async function findUserByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({where: {email}});
}

export async function createUser(email: string, name?: string | null): Promise<User> {
    return db.user.create({
        data: {
            email,
            name: name ?? null,
            lastLoginAt: getCurrentTime()
        }
    })
}

export async function updateUser(email: string, user: Partial<User>): Promise<User>{
    return db.user.update({
            where: {email},
            data: user
        }
    )
}

/**
 * Some providers (e.g. Apple) only send the name on the first login,
 * so a missing name never overwrites one we already have.
 */
export async function upsertUser(email: string, name?: string | null): Promise<User> {
    return db.user.upsert({
        where: {email},
        create: {
            email,
            name: name ?? null,
            lastLoginAt: getCurrentTime()
        },
        update: {
            ...(name ? {name} : {}),
            lastLoginAt: getCurrentTime()
        }
    })
}
