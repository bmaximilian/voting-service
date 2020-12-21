/* eslint-disable @typescript-eslint/no-var-requires */

const childProcess = require('child_process');
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

console.log(
    process.env.DB_SSL === undefined ? process.env.NODE_ENV === 'production' && !process.env.CI : !!process.env.DB_SSL,
    process.env.DB_HOST,
    process.env.DB_DATABASE,
);

function dropSchemaAndMigrate(): void {
    childProcess.execSync('npm run typeorm -- schema:drop');
    childProcess.execSync(`npm run typeorm -- query "CREATE SCHEMA IF NOT EXISTS ${process.env.DB_SCHEMA};"`);
    childProcess.execSync('npm run migration:run:dev');
}

module.exports = (): void => {
    process.env.NODE_ENV = 'test';
    process.env.DB_SCHEMA = 'testing';
    process.env.TZ = 'Etc/UTC';

    dropSchemaAndMigrate();
};
