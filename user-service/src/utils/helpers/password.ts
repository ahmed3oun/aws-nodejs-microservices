import { User } from '../../models/user';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';


const APP_SECRET = "our_app_secret";

export const getSalt = async (): Promise<string> => {
    return await bcrypt.genSalt()
}

export const getHashedPassword = async (password: string, salt: string): Promise<string> => {
    return await bcrypt.hash(password, salt);
};

export const validatePassword = async (
    enteredPassword: string,
    savedPassword: string,
    salt: string
): Promise<boolean> => {
    return (await getHashedPassword(enteredPassword, salt) === savedPassword)
}

export const getToken = ({ user_id, email, phone, userType }: User): string => {
    return jwt.sign(
        { user_id, email, phone, userType },
        APP_SECRET,
        { expiresIn: '30d' }
    )
}

export const verifyToken = async (token: string): Promise<User | false> => {
    try {
        if (token !== "") {
            const payload: string | JwtPayload = await jwt.verify(token.split(" ")[1], APP_SECRET)
            return payload as User
        }
        return false
    } catch (error) {
        console.log({ error });
        return false
    }
}

