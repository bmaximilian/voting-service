/* eslint-disable @typescript-eslint/no-var-requires */

const childProcess = require('child_process');
const { join } = require('path');
const { existsSync } = require('fs');
const dotenv = require('dotenv');

if (existsSync(join(__dirname, '.env.secrets'))) {
    dotenv.config({
        path: join(__dirname, '.env.secrets'),
    });
}

function dropSchemaAndMigrate(): void {
    childProcess.execSync('npm run typeorm -- schema:drop');
    childProcess.execSync('npm run migration:run');
}

module.exports = (): void => {
    process.env.NODE_ENV = 'test';
    process.env.DB_SCHEMA = 'testing';
    process.env.TZ = 'Etc/UTC';

    dropSchemaAndMigrate();
};
