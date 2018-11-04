FROM keymetrics/pm2:10-alpine
ENV NODE_ENV=production

RUN apk add --update --no-cache curl

WORKDIR /usr/src/taxiapi

ADD package.json yarn.lock /usr/src/taxiapi/
RUN yarn install --frozen-lockfile

ADD . .

EXPOSE 80
EXPOSE 8080
ENTRYPOINT [ "sh" ]
CMD [ "bin/start" ]
