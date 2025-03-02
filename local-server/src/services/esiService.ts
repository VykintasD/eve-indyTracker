import axios from 'axios';
import { AuthToken } from '../types/types';

export default class EsiService {
  async fetchWalletBalance(authToken: AuthToken) {
    const { character_id, token_type, access_token } = authToken;

    const result = await axios.get(
      `https://esi.evetech.net/latest/characters/${character_id}/wallet/`,
      {
        headers: {
          Authorization: `${token_type} ${access_token}`,
        },
      }
    );

    return result.data;
  }
}
