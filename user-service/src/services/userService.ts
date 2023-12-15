import { autoInjectable } from "tsyringe";
import { UserRepository } from "../repositories/userRepository";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import {
    errorResponse,
    sucessResponse,
    getSalt,
    getHashedPassword,
    validatePassword,
    getToken,
    verifyToken,
    generateAccessCode,
    sendVerificationCodeSMS,

} from "../utils/helpers/";
import { plainToClass } from 'class-transformer';
import { SignupDto } from "../utils/dto/signupDto";
import { appValidationError } from "../utils/helpers/errors";
import { LoginDto } from "../utils/dto/loginDto";
import { User } from "../models/user";


@autoInjectable()
export class UserService {
    userRepository: UserRepository;

    constructor(repository: UserRepository) {
        this.userRepository = repository
    }

    // User Creation, Validation & Login
    // DONE
    async createUser(event: APIGatewayProxyEventV2) {
        try {
            const input: SignupDto = plainToClass(SignupDto, event.body)
            const error = await appValidationError(input)

            if (error) return errorResponse(404, error)

            const salt = await getSalt()
            const hashed_password = await getHashedPassword(input.password, salt)
            const user = await this.userRepository.createAccount({
                email: input.email,
                password: hashed_password,
                phone: input.phone,
                salt,
                userType: "BUYER"
            })

            return sucessResponse({ user })
        } catch (error) {
            errorResponse(500, error)
        }
    }
    //DONE
    async login(event: APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(LoginDto, event.body)
            const error = await appValidationError(input)

            if (error) return errorResponse(401, error)

            const user = await this.userRepository.findAccount(input.email) as User

            if (!user) {
                return errorResponse(401, new Error("Unexisted email"))
            }

            const verified = await validatePassword(input.password, user.password, user.salt)

            if (!verified) {
                return errorResponse(400, new Error("Incorrect password!"))
            }

            const token = getToken(user)

            return sucessResponse({
                token
            })
        } catch (error) {
            return errorResponse(500, error)
        }
    }

    //get
    async getVerificationToken(event: APIGatewayProxyEventV2) {
        try {
            const token = event.headers.authorization
            const payload = await verifyToken(token!)
            if (payload) {
                const { verifCode, expiry } = generateAccessCode()
                const response = await sendVerificationCodeSMS(verifCode, payload.phone)
                return sucessResponse({
                    message: "verification code is sent to your registered mobile number!",
                })
            }
        } catch (error) {
            errorResponse(500, error)
        }
        /* return sucessResponse({
            message: "response from UserService.getVerificationToken "
        }) */
    }
    //post
    async verifyUser(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from Verify User" });
    }

    // User profile
    async createProfile(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from UserService.createProfile" });
    }

    async getProfile(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from UserService.getProfile" });
    }
    async editProfile(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from UserService.editProfile" });
    }

    // User cart
    async CreateCart(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from Create Cart" });
    }

    async GetCart(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from Get Cart" });
    }

    async UpdateCart(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from Update Cart" });
    }

    // User payment
    async createPaymentMethod(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from Create Payment Method" });
    }

    async getPaymentMethod(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from Get Payment Method" });
    }

    async updatePaymentMethod(event: APIGatewayProxyEventV2) {
        return sucessResponse({ message: "response from Update Payment Method" });
    }
}
