import { User } from '../models/user';

export class UserRepository {
    constructor() { }

    async createAccount({ phone, email, password, salt, userType }: User) {
        // TODO : create account
        return "User repo create account"
    }

    async findAccount(email: string) {
        // TODO: find account
        return "User repo find account"
    }
}