import 'reflect-metadata';
import 'dotenv/config';
import { createConnections } from 'typeorm';
import * as path from 'path';

export default createConnections([
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'domains',
        'users',
        'infra',
        'typeorm',
        'entities',
        '*{.js,.ts}',
      ),
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'domains',
        'complaints',
        'infra',
        'typeorm',
        'entities',
        '*{.js,.ts}',
      ),
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'domains',
        'notifications',
        'infra',
        'typeorm',
        'entities',
        '*{.js,.ts}',
      ),
    ],
    synchronize: true,
  },
  {
    name: 'mongo',
    type: 'mongodb',
    host: process.env.MONGO_HOST,
    port: 27017,
    database: process.env.MONGO_DB_NAME,
    useUnifiedTopology: true,
    entities: [
      path.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'domains',
        '**',
        'infra',
        'typeorm',
        'schemas',
        '*{.js,.ts}',
      ),
    ],
  },
]).then(_ => {
  console.log('Database was sucessfuly connected');
});
