import { autoInjectable } from "tsyringe";
import { UserRepository } from "../repositories/userRepository";
import { APIGatewayProxyEventV2 } from "aws-lambda";
import { errorResponse, sucessResponse, getSalt, getHashedPassword } from "../utils/helpers/";
import { plainToClass } from 'class-transformer';
import { SignupDto } from "../utils/dto/signupDto";
import { appValidationError } from "../utils/helpers/errors";


@autoInjectable()
export class UserService {
    userRepository: UserRepository;

    constructor(repository?: UserRepository) {
        this.userRepository = repository!
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
            const user = await this.userRepository!.createAccount({
                email: input.email,
                password: hashed_password,
                phone: input.phone,
                salt,
                userType: "BUYER"
            })

            return sucessResponse({ user })
        } catch (error) {
            console.log({ error });
            errorResponse(500, error)

        }
    }

    async login(event: APIGatewayProxyEventV2) {
        return sucessResponse({
            message: "response from UserService.login "
        })
    }

    async getVerificationToken(event: APIGatewayProxyEventV2) {
        return sucessResponse({
            message: "response from UserService.getVerificationToken "
        })
    }

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
