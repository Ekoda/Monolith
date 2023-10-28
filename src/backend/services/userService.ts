import db from "../database/database"
import {User} from ".prisma/client";
import {getCurrentTime} from "@/utils/timeUtils";
import { User as NextAuthUser} from "next-auth";


export async function findUserById(id: string): Promise<User | null> {
    return db.user.findUnique({where: {id}});
}

export async function findUserByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({where: {email}});
}


export async function createUser(user: NextAuthUser): Promise<User> {
    return db.user.create({
        data: {
            email: user.email as string,
            name: user.name as string,
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

export async function upsertUser(user: NextAuthUser): Promise<User> {
    return db.user.upsert({
        where: {email: user.email as string},
        create: {
            email: user.email as string,
            name: user.name as string,
            lastLoginAt: getCurrentTime()
        },
        update: {
            name: user.name as string,
            lastLoginAt: getCurrentTime()
        }
    })
}