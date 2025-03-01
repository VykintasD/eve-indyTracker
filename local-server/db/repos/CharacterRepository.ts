import { Client } from 'pg';
import { DatabaseError } from '../../src/types/errors';
import { Character } from '../../src/types/types';

export default class CharacterRepository {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async save(character: Character) {
    if (!character.name.length || !character.id) {
      throw new DatabaseError('Invalid character data');
    }

    const result = await this.client.query(this.buildInsertQuery(character));

    if (!result.rows.length) {
      console.log(`character ${character.name} already exists`);
    } else {
      console.log('inserted new character: ', result.rows);
    }

    return result;
  }

  async fetchAll() {
    return await this.client.query(`SELECT * FROM characters`);
  }

  private buildInsertQuery(character: Character) {
    return {
      name: 'save-character',
      text: 'INSERT INTO characters(id, name) VALUES($1, $2)  ON CONFLICT DO NOTHING RETURNING *',
      values: [character.id, character.name],
      rowMode: 'array',
    };
  }
}
