import { Request, Response } from 'express';
import Repository from '../../db/repository';
import EsiService from '../services/esiService';
import AuthenticationService from '../services/authenticationService';

const repo = new Repository();
const esi = new EsiService();
const auth = new AuthenticationService();

export default class EsiController {
  async getWallet(req: Request, res: Response) {
    const { characterId } = req.params;

    console.log('got charID ', characterId);
    console.log('getting wallet');

    const charAccessToken = await repo.getAccessToken(Number(characterId));

    if (charAccessToken.access_token)
      try {
        const resp = await esi.fetchWalletBalance(charAccessToken);
        console.log(`Wallet balance for character ${characterId}:`, resp);
      } catch (err: any) {
        console.log(err);
      }
  }
}
