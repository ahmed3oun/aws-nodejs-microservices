FROM node:18.16.0-alpine3.17
#FROM public.ecr.aws/lambda/nodejs:18

WORKDIR /app

RUN npm install -g serverless

RUN npm install -g yarn

COPY ["package*.json", "yarn.lock", "./"]

RUN npm install

# Copy the rest of your project's files
COPY . .

ENV NODE_ENV=dev

CMD [ "src/handlers.hello" ]
#CMD [ "yarn", "dev" ]
# docker build -t sls-aws-nodejs-ts:1.0.0 .

#               host:container
# docker run -p 3000:3000 --name product-service -v product-service-nodejs-volume:/app
#       -d sls-aws-nodejs-ts:1.0.0 ./