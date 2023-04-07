FROM node:11 as node

WORKDIR /app

COPY ./web .

RUN yarn install --production

RUN yarn build
RUN rm -rf node-modules

FROM nginx:1.17.1-alpine as nginx

COPY --from=node /app/build /usr/share/nginx/html


EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]