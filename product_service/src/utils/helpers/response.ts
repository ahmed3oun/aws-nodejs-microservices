import { APIGatewayProxyResultV2 } from "aws-lambda";

const formatResponse = async (statusCode: number, message: string, data: unknown): Promise<APIGatewayProxyResultV2> => {
    if (data) {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                message,
                data
            })
        }
    } else {
        return {
            statusCode,
            headers: {
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({
                message
            })
        }
    }
}

export const sucessResponse = (data: object) => {
    return formatResponse(200, "success", data);
};

export const errorResponse = (code = 1000, error: unknown) => {
    if (Array.isArray(error)) {
        const errorObject = error[0].constraints;
        const errorMesssage =
            errorObject[Object.keys(errorObject)[0]] || "Error Occured";
        return formatResponse(code, errorMesssage, errorMesssage);
    }

    return formatResponse(code, `${error}`, error);
};