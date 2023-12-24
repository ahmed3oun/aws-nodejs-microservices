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
    sendVerificationCodeMail,
    /* sendVerificationCodeSMS,
    sendVerificationCodeMail, */
} from "../utils/helpers/";
import { plainToClass } from 'class-transformer';
import { SignupDto } from "../utils/dto/signupDto";
import { appValidationError } from "../utils/helpers/errors";
import { LoginDto } from "../utils/dto/loginDto";
import { User } from "../models/user";
import { VerifyDto } from "../utils/dto/verifyDto";
import ErrorHandler from '../utils/helpers/ErrorHandler';


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

            if (error) throw new ErrorHandler({
                message: 'Input validation error',
                description: `${JSON.stringify(error)}`,
                statusCode: 400
            })

            const salt = await getSalt()
            const hashed_password = await getHashedPassword(input.password, salt)

            const { verification_code, expiry } = generateAccessCode()
            console.log({
                verification_code,
                expiry
            });

            //await sendVerificationCodeSMS(verification_code, input.phone)
            const response = await sendVerificationCodeMail(verification_code, input.email)
            console.log({
                response
            });

            const user = await this.userRepository.createAccount({
                email: input.email,
                first_name: input.first_name,
                last_name: input.last_name,
                password: hashed_password,
                phone: input.phone,
                salt,
                userType: "BUYER",
                verification_code,
                expiry,
                isVerified: false
            })

            return await sucessResponse({ user })
        } catch (error: any) {
            console.log('*****************************ERRORS**************');
            console.log(error.message);
            await errorResponse(error)
        }
    }
    //DONE
    async login(event: APIGatewayProxyEventV2) {
        try {
            const input = plainToClass(LoginDto, event.body)
            const error = await appValidationError(input)

            if (error) throw new ErrorHandler({
                message: 'Input validation error',
                description: `${JSON.stringify(error)}`,
                statusCode: 400
            })

            const user = await this.userRepository.findAccount(input.email) as User

            if (!user) {
                throw new ErrorHandler({
                    message: 'Unexisted email',
                    statusCode: 400,
                    description: 'Bad request'
                });
            }

            const verified = await validatePassword(input.password, user.password, user.salt)

            if (!verified) {
                throw new ErrorHandler({
                    message: 'Incorrect password!',
                    statusCode: 400,
                    description: 'Bad request'
                });
            }

            const token = getToken(user)

            return await sucessResponse({
                token
            })
        } catch (error: any) {
            return await errorResponse(error)
        }
    }

    //get
    async getVerificationToken(event: APIGatewayProxyEventV2) {
        try {
            /* const token = event.headers.authorization
            const payload = await verifyToken(token!)
            if (payload) {
                const { verification_code, expiry } = generateAccessCode()
                const response = await sendVerificationCodeSMS(verification_code, payload.phone)
                return sucessResponse({
                    message: "verification code is sent to your registered mobile number!",
                })
            } */

        } catch (error) {
            errorResponse(500, error)
        }
    }
    //post
    async verifyUser(event: APIGatewayProxyEventV2) {
        try {
            const token = event.headers.autorization
            const payload = await verifyToken(token!)

            if (!payload) throw new ErrorHandler({
                message: 'Invalid Token',
                statusCode: 401,
                description: 'Unautorized'
            })

            const input: VerifyDto = plainToClass(VerifyDto, event.body);
            const error = await appValidationError(input);

            if (error) throw new ErrorHandler({
                message: 'Invalid entered code',
                statusCode: 400,
                description: `${JSON.stringify(error)}`
            })
            const user = await this.userRepository.findAccount(payload.email);

            if (!user) throw new ErrorHandler({
                message: 'Internal server error',
                statusCode: 500
            })

            if (input.code === user.verification_code) {
                user.isVerified = true;
                const _user = await this.userRepository.updateAccount(user);
                const updated_user = { ..._user }
                delete updated_user.password
                delete updated_user.salt
                delete updated_user.expiry
                delete updated_user.created_at

                return await sucessResponse({
                    message: 'Verified successfully',
                    user: updated_user
                })
            } else {
                throw new ErrorHandler({
                    message: 'Verification is failed',
                    statusCode: 400,
                    description: 'Bad request'
                })
            }
        } catch (error: any) {
            return await errorResponse(error)
        }
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
