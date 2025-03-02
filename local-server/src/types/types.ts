import Token from '../../db/tables/Token';

interface Account {
  id: string;
  characters: Character['id'][];
}

interface Character {
  id: number;
  name: string;
  validate(): Character;
}

interface AuthToken {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  expires_in?: number;
  token_type: string;
  character_id: Character['id'];
  validate(): AuthToken;
}

interface AuthenticationState {
  character: Character;
  token: AuthToken;
}

interface AuthenticationRefreshState {}

export type { Account, Character, AuthToken, AuthenticationState };
