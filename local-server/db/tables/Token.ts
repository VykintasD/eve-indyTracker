import { AuthToken } from '../../src/types/types';
import { TableError } from '../../src/types/errors';

export default class Token implements AuthToken {
  accessToken: string;
  expiresAt: number;
  tokenType: string;
  refreshToken: string;
  characterId: number;

  constructor(props: {
    accessToken: string;
    expiresAt: number;
    tokenType: string;
    refreshToken: string;
    characterId: number;
  }) {
    this.accessToken = props.accessToken;
    this.expiresAt = props.expiresAt;
    this.tokenType = props.tokenType;
    this.refreshToken = props.refreshToken;
    this.characterId = props.characterId;
  }

  validate() {
    if (
      !this.accessToken.length ||
      !this.expiresAt ||
      !this.refreshToken.length ||
      !this.characterId
    ) {
      throw new TableError('Invalid auth token');
    }
    return this;
  }
}
