import db from '../database/database'
import {User} from ".prisma/client";

export async function fetchUserById(id: string): Promise<User | null> {
    return db.user.findUnique({where: {id}});
}