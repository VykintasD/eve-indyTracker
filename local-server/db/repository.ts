import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { AuthenticationState } from '../src/types/types.ts';
import Character from './tables/Character.ts';
import Token from './tables/Token.ts';
import CharacterRepository from './repos/CharacterRepository.ts';
import TokenRepository from './repos/TokenRepository.ts';

const tableConfig = fs.readFileSync(
  path.join('./db/tables', 'createTables.sql'),
  'utf8'
);
export default class Repository {
  client: Client;
  characterRepo: CharacterRepository;
  tokenrepo: TokenRepository;

  constructor() {
    this.client = new Client({
      user: process.env.PG_USER,
      host: process.env.PG_HOST,
      database: process.env.PG_DATABASE,
      password: process.env.PG_PASSWORD,
      port: Number(process.env.PG_PORT),
    });

    this.characterRepo = new CharacterRepository(this.client);
    this.tokenrepo = new TokenRepository(this.client);
  }

  async connect() {
    await this.client.connect();
    console.log('Connected to DB! 📚');

    await this.setupTables();
  }

  async setupTables() {
    this.client.query(tableConfig);
  }

  async storeAuth(authState: AuthenticationState) {
    const character = new Character(authState.character).validate();
    this.characterRepo.save(character);

    const token = new Token(authState.token).validate();
    this.tokenrepo.save(token);
  }

  async fetchAllCharacters() {
    return this.characterRepo.fetchAll();
  }
}
