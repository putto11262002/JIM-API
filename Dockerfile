FROM node:20 as build

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn prisma generate
RUN yarn build

CMD [ "node", "dist/index.js" ]
