import { bootstrap } from './bootstrap';

// eslint-disable-next-line no-console
bootstrap(process.env.PORT || 3000).catch((reason) => console.error(reason));
