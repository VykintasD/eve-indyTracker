interface Account {
  id: string;
  characters: Character['id'][];
}

interface Character {
  id: string;
  name: string;
}

interface AuthToken {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number | undefined;
  tokenType: string;
  characterId?: Character['id'];
}

interface AuthenticationState {
  character: Character;
  token: AuthToken;
}

export type { Account, Character, AuthToken, AuthenticationState };

export class AuthenticationError extends Error {
  constructor(message: string, cause?: Error) {
    super(message);
    this.cause = cause;
    this.name = 'AuthenticationError';
    Object.setPrototypeOf(this, AuthenticationError.prototype);
  }
}
