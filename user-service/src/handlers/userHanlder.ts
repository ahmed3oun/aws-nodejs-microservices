import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { errorResponse, middyfy } from "../utils/helpers";
import { UserService } from "../services/userService";
import { container } from "tsyringe";


const service: UserService = container.resolve(UserService)

export const login = middyfy((event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
    return service.login(event)
})

export const signup = middyfy((event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2 | undefined> => {
    return service.createUser(event)
})

export const verify = async (event: APIGatewayProxyEventV2) => {
    const httpMethod = event.requestContext.http.method.toLowerCase();
    if (httpMethod === "post") {
        return service.verifyUser(event);
    } else if (httpMethod === "get") {
        return service.getVerificationToken(event);
    } else {
        return errorResponse(404, "requested method is not supported!");
    }
};