FROM node:14.15.1 as builder

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# copy project source code
COPY --chown=node:node . /opt/app

USER node

WORKDIR /opt/app

ENV PATH /opt/app/node_modules/.bin:$PATH
RUN NODE_ENV=development npm install && npm cache clean --force
RUN npm run build

FROM node:14.15.1-alpine

ENV DOCKER 1

ARG PORT=3000
ENV PORT $PORT
EXPOSE $PORT

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

ARG DB_HOST
ENV DB_HOST $DB_HOST
ARG DB_PORT
ENV DB_PORT $DB_PORT

ARG REDIS_HOST
ENV REDIS_HOST $REDIS_HOST
ARG REDIS_PORT
ENV REDIS_PORT $REDIS_PORT

ENV PATH /opt/app/node_modules/.bin:$PATH

WORKDIR /opt/app

# start the node application
CMD [ "sh", "start.sh" ]

COPY --from=builder /opt/app/dist/src /opt/app/dist/ormconfig.js /opt/app/package.json /opt/app/package-lock.json /opt/app/wait-for-it.sh /opt/app/
RUN npm install && npm cache clean --force
