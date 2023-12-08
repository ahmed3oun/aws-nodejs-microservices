import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { middyfy, sucessResponse } from "../utils/helpers";
import { UserService } from "../services/userService";


const service: UserService = new UserService()

export const login = middyfy((event: APIGatewayProxyEventV2) => {
    return service.login(event)
})

export const signup = middyfy((event: APIGatewayProxyEventV2) => {
    return service.createUser(event)
})