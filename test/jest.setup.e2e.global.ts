/* eslint-disable @typescript-eslint/no-var-requires */

const childProcess = require('child_process');
const setup = require('../jest.setup.global').default;

function dropSchemaAndMigrate(): void {
    childProcess.execSync('npm run typeorm -- schema:drop');
    childProcess.execSync(`npm run typeorm -- query "CREATE SCHEMA IF NOT EXISTS ${process.env.DB_SCHEMA};"`);
    childProcess.execSync('npm run migration:run:dev');
}

export default (): void => {
    setup();
    dropSchemaAndMigrate();
};
