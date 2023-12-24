import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { errorResponse, middyfy } from "../utils/helpers";
import { UserService } from "../services/userService";
import { container } from "tsyringe";
import ErrorHandler from '../utils/helpers/ErrorHandler';


const service: UserService = container.resolve(UserService)

export const login = middyfy(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    return await service.login(event)
})

export const signup = middyfy(async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2 | undefined> => {
    return await service.createUser(event)
})

export const verify = async (event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if (httpMethod === "post") {
        return await service.verifyUser(event);
    } else {
        return await errorResponse(new ErrorHandler({
            message: "requested method is not supported!",
            statusCode: 404
        }));
    }
};