import { Client } from 'pg';
import { DatabaseError } from '../../src/types/errors';
import { AuthToken } from '../../src/types/types';

export default class TokenRepository {
  client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  async save(token: AuthToken) {
    if (
      !token.access_token.length ||
      !token.refresh_token ||
      !token.character_id
    ) {
      throw new DatabaseError('Invalid token data');
    }

    const result = await this.client.query(this.buildInsertQuery(token));

    if (!result.rows.length) {
      console.error(`could not save token`);
    }

    return result;
  }

  async getAccessToken(characterId: number) {
    const result = await this.client.query({
      name: 'query-token',
      text: `SELECT * FROM tokens WHERE character_id = $1`,
      values: [characterId],
    });

    return result.rows;
  }

  private buildInsertQuery(token: AuthToken) {
    return {
      name: 'save-token',
      text: `
      INSERT INTO
        tokens(access_token, expires_at, token_type, refresh_token, character_id)
        VALUES($1, $2, $3, $4, $5)
        ON CONFLICT (character_id)
            DO UPDATE SET
                access_token = EXCLUDED.access_token,
                refresh_token = EXCLUDED.refresh_token,
                expires_at = EXCLUDED.expires_at,
                token_type = EXCLUDED.token_type
            RETURNING *`,
      values: [
        token.access_token,
        token.expires_at,
        token.token_type,
        token.refresh_token,
        token.character_id,
      ],
      rowMode: 'array',
    };
  }
}
