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

export async function updateLastLogin(email: string) {
    await db.user.update({
            where: {email},
            data: {lastLogin: getCurrentTime()}
        }
    )
}

export async function createUser(user: NextAuthUser) {
    await db.user.create({
        data: {
            email: user.email as string,
            name: user.name as string,
            lastLogin: getCurrentTime()
        }
    })
}