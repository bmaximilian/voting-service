#!/usr/bin/env bash


echo "Waiting for Database..."
sh wait-for-it.sh -t 600 $DB_HOST:$DB_PORT --strict


if [[ "$NODE_ENV" = "development" ]]; then
    npm run seeds
    npm run start:dev
else
    npm run migration:run
    npm run start:prod
fi
