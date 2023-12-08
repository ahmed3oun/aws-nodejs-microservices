import middy from "@middy/core"
import middyJsonBodyParser from "@middy/http-json-body-parser"
import { Context } from "aws-lambda"

export const middyfy = (handler: unknown | any | Error | Context) => {
  return middy(handler).use(middyJsonBodyParser())
}
