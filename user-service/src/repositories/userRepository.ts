import { Prisma } from '@prisma/client';
import { User } from '../models/user';
import { prismaClient } from '../utils/helpers/';
import { DefaultArgs } from '@prisma/client/runtime/library';



export class UserRepository {

    async createAccount({ phone, email, password, salt, userType }: User): Promise<User | string> {
        try {
            await prismaClient.$connect();
            const user: User = await prismaClient.user.create({
                data: {
                    phone,
                    email,
                    password,
                    salt,
                    userType
                }
            })
            await prismaClient.$disconnect()
            return user
        } catch (error) {
            return JSON.stringify(error)
        }
    }

    async findAccount(email: string): Promise<User | null | string> {
        try {
            await prismaClient.$connect();
            const user: User | null = await prismaClient.user.findUnique({
                where: {
                    email
                }
            })
            await prismaClient.$disconnect()
            return user;
        } catch (error) {
            return JSON.stringify(error)
        }
        // TODO: find account
        return "User repo find account"
    }
}