FROM node:10

WORKDIR /app

ADD . .

RUN yarn install ;

CMD ["yarn", "run", "start"]