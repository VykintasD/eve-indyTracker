import pkg from 'pg';
const { Client } = pkg;
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

export default class Repository {
  async createTables() {
    await client.query(`
            CREATE TABLE IF NOT EXISTS Users (
              id SERIAL PRIMARY KEY,
              authProviderId TEXT UNIQUE NOT NULL,
              createdAt TIMESTAMP DEFAULT NOW()
            );
          `);

    await client.query(`
            CREATE TABLE IF NOT EXISTS Characters (
              id SERIAL PRIMARY KEY,
              userId INTEGER REFERENCES Users(id),
              characterId TEXT UNIQUE NOT NULL,
              accessToken TEXT NOT NULL,
              refreshToken TEXT, 
              createdAt TIMESTAMP DEFAULT NOW()
            );
          `);
  }

  async connect() {
    const client = new Client({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: process.env.DB_PASSWORD,
      port: 5432,
    });

    client.connect();
    console.log('Connected to DB');
  }
}
