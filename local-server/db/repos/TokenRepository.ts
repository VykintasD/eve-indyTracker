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
      !token.accessToken.length ||
      !token.refreshToken ||
      !token.characterId
    ) {
      throw new DatabaseError('Invalid token data');
    }

    const result = await this.client.query(this.buildQuery(token));

    if (!result.rows.length) {
      console.error(`could not save token`);
    }

    return result;
  }

  private buildQuery(token: AuthToken) {
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
        token.accessToken,
        token.expiresAt,
        token.tokenType,
        token.refreshToken,
        token.characterId,
      ],
      rowMode: 'array',
    };
  }
}
