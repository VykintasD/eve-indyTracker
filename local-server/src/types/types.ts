interface Account {
  id: string;
  characters: Character['id'][];
}

interface Character {
  id: number;
  name: string;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  tokenType: string;
  characterId: Character['id'];
}

interface AuthenticationState {
  character: Character;
  token: AuthToken;
}

export type { Account, Character, AuthToken, AuthenticationState };
