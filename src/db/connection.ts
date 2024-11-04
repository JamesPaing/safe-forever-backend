import mysql from 'mysql2';
import mysql2 from 'mysql2/promise';
import config from './config';

export const connection = mysql.createPool({
    host: config.host,
    user: config.username,
    database: config.database,
    password: config.password,
    multipleStatements: true,
    timezone: 'Z',
});

export const connection2 = mysql2.createPool({
    host: config.host,
    user: config.username,
    database: config.database,
    password: config.password,
    multipleStatements: true,
    timezone: 'Z',
});
