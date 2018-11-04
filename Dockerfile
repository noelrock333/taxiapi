FROM node:10-alpine
ENV NODE_ENV=production

RUN apk add --update --no-cache curl

RUN yarn global add pm2@latest
WORKDIR /usr/src/taxiapi

ADD package.json yarn.lock /usr/src/taxiapi/
RUN yarn install --frozen-lockfile
RUN pm2 --version

ADD . .

EXPOSE 3000
ENTRYPOINT [ "sh" ]
CMD [ "bin/start" ]
