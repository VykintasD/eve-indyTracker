interface Account {
  id: string;
  characters: Character['id'][];
}

interface Character {
  id: number;
  name: string;
}

interface AuthToken {
  accesstoken: string;
  refreshtoken: string;
  expiresat: number;
  tokentype: string;
  characterid: Character['id'];
}

interface AuthenticationState {
  character: Character;
  token: AuthToken;
}

export type { Account, Character, AuthToken, AuthenticationState };
