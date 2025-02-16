import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import Server from './server.ts';

const server = new Server();
server.start();
