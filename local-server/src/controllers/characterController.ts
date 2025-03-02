import { Request, Response } from 'express';
import Repository from '../../db/repository';

const repo = new Repository();

export default class CharacterController {
  repo: Repository;

  constructor() {
    this.repo = repo;
  }

  async getCharacters(req: Request, res: Response) {
    try {
      const result = await this.repo.getAllCharacters();
      res.status(200).json(result);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
