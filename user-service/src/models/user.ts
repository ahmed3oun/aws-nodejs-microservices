export interface User {
    user_id?: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    phone: string;
    salt: string;
    userType: "BUYER" | "SELLER";
    verification_code: number;
    isVerified?: boolean | false;
    expiry: Date;
    profile_pic?: string;
    created_at?: Date;
}