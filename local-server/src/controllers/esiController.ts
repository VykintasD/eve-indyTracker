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

    const chars = await repo.getAllCharacters();

    const charAccessToken = await repo.getAccessToken(Number(characterId));
    console.log(charAccessToken.accesstoken);

    if (Date.parse(charAccessToken.accesstoken))
      try {
        await esi.fetchWalletBalance(chars[0].id, charAccessToken.accesstoken);
      } catch (err: any) {
        console.log(err);
      }
  }
}
