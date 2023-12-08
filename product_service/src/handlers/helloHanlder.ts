import { middyfy } from "@src/utils/helpers/lambda";
import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { sucessResponse } from '@src/utils/helpers/response';

export const hello = middyfy((event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {

    return sucessResponse({
        message: "Go Serverless v1.0! Your function executed successfully!",
        input: event,
    })
})