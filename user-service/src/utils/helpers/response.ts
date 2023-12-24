import { APIGatewayProxyResultV2 } from "aws-lambda";

const formatResponse = async (statusCode: number, message: string, data?: unknown): Promise<APIGatewayProxyResultV2> => {
    console.log('******FROM formatResponse ********');
    console.log({
        statusCode,
        message,
        data: data
    });


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

export const sucessResponse = async (data: object) => {
    return await formatResponse(200, "success", data);
};

export const errorResponse = async (error: any) => {
    console.log("****FROM errorResponse :>> ", error);

    if (Array.isArray(error)) {
        const errorObject = error[0].constraints;
        const errorMesssage =
            errorObject[Object.keys(errorObject)[0]] || "Error Occured";
        return formatResponse(500, errorMesssage, errorMesssage);
    }
    console.log({
        status: error.statusCode,
        msg: error.message
    });
    return await formatResponse(error.statusCode, error.message);
};