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

    const charAccessToken = await repo.getAccessToken(Number(characterId));

    if (charAccessToken.access_token) {
      try {
        const resp = await esi.fetchWalletBalance(charAccessToken);
        res.status(200).json(resp);
      } catch (err: any) {
        console.log(err);
      }
    }
  }
}
