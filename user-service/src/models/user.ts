export interface User {
    user_id?: number;
    email: string;
    password: string;
    salt: string;
    phone: string;
    userType: "BUYER" | "SELLER";
    verification_code: number;
    isVerified?: boolean | false;
    expiry: Date
}