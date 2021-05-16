FROM node:lts-alpine as production

RUN echo "Asia/Bangkok" > /etc/timezone

WORKDIR src/app

ARG NODE_ENV=production

COPY package.json ./

COPY yarn.lock ./
RUN yarn install --network-timeout 1000000
COPY . .
RUN yarn build
CMD ["yarn", "start:prod"]
