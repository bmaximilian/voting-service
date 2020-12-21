// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path');

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,consistent-return
function getDatabaseUrl() {
    if (process.env.DB_URL) return process.env.DB_URL;

    if (process.env.DB_USER && process.env.DB_PASSWORD && process.env.DB_HOST && process.env.DB_DATABASE) {
        // eslint-disable-next-line max-len
        return `postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_DATABASE}`;
    }
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function getRootDir() {
    if (process.env.NODE_ENV === 'production') return join(__dirname, 'dist');

    return join(__dirname, 'src');
}

const rootDir = getRootDir();

module.exports = {
    type: 'postgres',
    url: getDatabaseUrl(),
    schema: process.env.DB_SCHEMA || 'public',
    entities: [join(rootDir, 'infrastructure/persistence/typeorm/entities/*')],
    migrations: [join(rootDir, 'infrastructure/persistence/typeorm/migrations/*')],
    synchronize: false, // Database changes should only happen via migration scripts.
    cli: {
        migrationsDir: join(rootDir, 'infrastructure/persistence/typeorm/migrations/*'),
    },
    ssl:
        process.env.DB_SSL === undefined
            ? process.env.NODE_ENV === 'production' && !process.env.CI
            : !!process.env.DB_SSL,
};
