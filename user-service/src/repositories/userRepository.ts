import ErrorHandler from '../utils/helpers/ErrorHandler';
import { User } from '../models/user';
import { prismaClient } from '../utils/helpers/';



export class UserRepository {

    async createAccount({
        phone,
        first_name,
        last_name,
        verification_code,
        expiry,
        email,
        password,
        salt,
        userType,
        isVerified
    }: User): Promise<User | null | any> {
        //try {
        await prismaClient.$connect();
        const existed_user = await prismaClient.user.findUnique({
            where: {
                email
            }
        })

        if (existed_user) {
            console.log('****************in case existed user');
            
            throw new ErrorHandler({
                message: 'This email is already existed!',
                statusCode: 400,
                description: 'Cannot register by an existed mail address.'
            })
        }

        const user = await prismaClient.user.create({
            data: {
                phone,
                first_name,
                last_name,
                verification_code,
                email,
                password,
                salt,
                expiry,
                userType,
                isVerified
            }
        })
        await prismaClient.$disconnect()
        return user
        //} catch (error) {
        //return JSON.stringify(error)
        //}
    }

    async findAccount(email: string): Promise<User | null | any> {
        await prismaClient.$connect();
        const user: User | null = await prismaClient.user.findUnique({
            where: {
                email
            }
        }) as User | null | any
        await prismaClient.$disconnect()
        return user;
    }

    async updateAccount(user: User): Promise<User | null | any> {
        await prismaClient.$connect();
        const _user: User | null = await prismaClient.user.update({
            where: {
                email: user.email
            },
            data: {
                email: user.email,
                first_name: user.first_name,
                last_name: user.last_name,
                phone: user.phone,
                password: user.password,
                userType: user.userType,
                profile_pic: user.profile_pic || undefined,
                verification_code: user.verification_code || null,
                isVerified: user.isVerified,
                salt: user.salt,
                expiry: user.expiry,
                created_at: user.created_at,
                user_id: user.user_id
            }
        }) as User | null | any
        await prismaClient.$disconnect()

        if (!_user) return null;

        return _user
    }
}