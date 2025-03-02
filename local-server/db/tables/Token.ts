import { AuthToken } from '../../src/types/types';
import { TableError } from '../../src/types/errors';

export default class Token implements AuthToken {
  access_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type: string;
  refresh_token: string;
  character_id: number;

  constructor(props: {
    access_token: string;
    expires_at?: number;
    expires_in?: number;
    token_type: string;
    refresh_token: string;
    character_id: number;
  }) {
    this.access_token = props.access_token;
    this.expires_at = props.expires_at;
    this.expires_in = props.expires_in;
    this.token_type = props.token_type;
    this.refresh_token = props.refresh_token;
    this.character_id = props.character_id;
  }

  validate() {
    if (
      !this.access_token.length ||
      !this.expires_at ||
      !this.refresh_token.length ||
      !this.character_id
    ) {
      throw new TableError('Invalid auth token');
    }
    return this;
  }
}
