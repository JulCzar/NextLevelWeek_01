FROM node:11 as node

WORKDIR /app

COPY ./server .

RUN yarn install --production

RUN yarn migrate
RUN yarn seed

EXPOSE 4000

CMD [ "yarn", "start" ]