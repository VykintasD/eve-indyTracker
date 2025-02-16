import { Client } from 'pg';

export default class Repository {
  client: Client;

  constructor() {
    this.client = new Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: Number(process.env.PG_PORT),
    });
  }

  async connect() {
    this.client.connect();
    console.log('Connected to DB! 📚');
  }
}
