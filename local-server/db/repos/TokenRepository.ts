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
      !token.accesstoken.length ||
      !token.refreshtoken ||
      !token.characterid
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
      text: `SELECT * FROM tokens WHERE characterId = $1`,
      values: [characterId],
    });

    return result.rows;
  }

  private buildInsertQuery(token: AuthToken) {
    return {
      name: 'save-token',
      text: `
      INSERT INTO
        tokens(accessToken, expiresAt, tokenType, refreshToken, characterId)
        VALUES($1, $2, $3, $4, $5)
        ON CONFLICT (characterId)
            DO UPDATE SET
                accessToken = EXCLUDED.accessToken,
                refreshToken = EXCLUDED.refreshToken,
                expiresAt = EXCLUDED.expiresAt,
                tokenType = EXCLUDED.tokenType
            RETURNING *`,
      values: [
        token.accesstoken,
        token.expiresat,
        token.tokentype,
        token.refreshtoken,
        token.characterid,
      ],
      rowMode: 'array',
    };
  }
}
