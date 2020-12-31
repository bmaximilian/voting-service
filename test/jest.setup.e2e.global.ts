/* eslint-disable @typescript-eslint/no-var-requires */

const childProcess = require('child_process');
const setup = require('../jest.setup.global').default;

function dropSchemaAndMigrate(): void {
    childProcess.execSync('npm run typeorm:dev -- schema:drop', { stdio: 'inherit' });
    childProcess.execSync(`npm run typeorm:dev -- query "CREATE SCHEMA IF NOT EXISTS ${process.env.DB_SCHEMA};"`, {
        stdio: 'inherit',
    });
    childProcess.execSync('npm run migration:run:dev', { stdio: 'inherit' });
}

export default (): void => {
    setup();

    if (!process.env.NO_DB) {
        dropSchemaAndMigrate();
    }
};
