#!/bin sh


echo "Waiting for Database..."
while ! nc -z $DB_HOST $DB_PORT; do sleep 0.1; done
echo "Database available."

echo "Waiting for Redis..."
while ! nc -z $REDIS_HOST $REDIS_PORT; do sleep 0.1; done
echo "Redis available."


node -r dotenv/config ./node_modules/typeorm/cli.js query "CREATE SCHEMA IF NOT EXISTS $DB_SCHEMA;"

if [[ "$NODE_ENV" = "development" ]]; then
    npm run migration:run:dev
    npm run start:dev
else
    npm run migration:run
    npm run start:prod
fi
