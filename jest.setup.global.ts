/* eslint-disable @typescript-eslint/no-var-requires */

const { join } = require('path');
const { existsSync } = require('fs');
const dotenv = require('dotenv');
const dotEnvExpand = require('dotenv-expand');

[
    !process.env.DOCKER && join(__dirname, '.env.local'),
    join(__dirname, `.env.${process.env.NODE_ENV || 'development'}`),
    join(__dirname, '.env'),
]
    .filter(Boolean)
    .forEach((dotenvFile) => {
        if (existsSync(dotenvFile)) {
            dotEnvExpand(
                dotenv.config({
                    path: dotenvFile,
                }),
            );
        }
    });

module.exports = (): void => {
    process.env.NODE_ENV = 'test';
    process.env.DB_SCHEMA = 'testing';
    process.env.TZ = 'Etc/UTC';
};
