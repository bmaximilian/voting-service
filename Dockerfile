FROM node:14.15.1 as builder

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# copy project source code
COPY --chown=node:node . /opt/app

USER node

WORKDIR /opt/app

ENV PATH /opt/app/node_modules/.bin:$PATH
RUN npm install && npm cache clean --force && npm run build

FROM node:14.15.1-alpine

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG DB_HOST
ENV DB_HOST $DB_HOST
ARG DB_POST
ENV DB_POST $DB_PORT

WORKDIR /opt/app

# start the node application
CMD [ "sh", "start.sh" ]

COPY --from=builder ./node_modules ./dist ./package.json ./package-lock.json ./wait-for-it.sh /opt/app/
