FROM node:18.16.0-alpine3.17

WORKDIR /app

COPY ["package.json", "yarn.lock", "./"]

RUN yarn install

COPY . .

ENV NODE_ENV=dev

EXPOSE 3000

CMD [ "yarn", "dev" ]
# docker build -t sls-aws-nodejs-ts:1.0.0 .

#               host:container
# docker run -p 3000:3000 --name product-service -v product-service-nodejs-volume:/app
#       -d sls-aws-nodejs-ts:1.0.0 ./