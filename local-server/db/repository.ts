import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { AuthenticationState, AuthToken } from '../src/types/types.ts';
import Character from './tables/Character.ts';
import Token from './tables/Token.ts';
import CharacterRepository from './repos/CharacterRepository.ts';
import TokenRepository from './repos/TokenRepository.ts';

const tableConfig = fs.readFileSync(
  path.join('./db/tables', 'createTables.sql'),
  'utf8'
);
const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});
const characterRepo = new CharacterRepository(client);
const tokenrepo = new TokenRepository(client);

export default class Repository {
  client: Client;
  characterRepo: CharacterRepository;
  tokenrepo: TokenRepository;

  constructor() {
    this.client = client;
    this.tokenrepo = tokenrepo;
    this.characterRepo = characterRepo;
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
    await this.storeCharacter(authState.character);
    await this.storeToken(authState.token);
  }

  async storeCharacter(char: Character) {
    const character = new Character(char).validate();
    await this.characterRepo.save(character);
  }

  async storeToken(authToken: AuthToken) {
    const token = new Token(authToken).validate();
    await this.tokenrepo.save(token);
  }

  async getAllCharacters() {
    const result = await this.characterRepo.fetchAll();
    return result.rows;
  }

  async getAccessToken(characterId: number): Promise<Token> {
    const result = await this.tokenrepo.getAccessToken(characterId);
    return result[0];
  }
}
