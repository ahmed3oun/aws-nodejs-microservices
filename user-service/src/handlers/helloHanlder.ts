//import { middyfy } from "src/utils/helpers/lambda";
//import { sucessResponse } from "src/utils/helpers/response";
import { middyfy, sucessResponse } from "../utils/helpers/";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";


export const hello = middyfy((event: APIGatewayProxyEventV2) => {
    return sucessResponse({
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
    })
})