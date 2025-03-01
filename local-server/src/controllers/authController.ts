import { Request, Response } from 'express';
import AuthenticationService from '../services/authenticationService';
import { endpoints } from '../config/shared';
import { AuthenticationState } from '../types/types';
import Repository from '../../db/repository';

const authService = new AuthenticationService();
const repo = new Repository();

export default class AuthController {
  repo: Repository;

  constructor() {
    this.repo = repo;
  }

  initiateSSO = (req: Request, res: Response): void => {
    try {
      // Generate the SSO redirect URL and state challenge
      const { authUrl, state } = authService.generateSSOurl(
        `${endpoints.BASE}${endpoints.AUTH_CALLBACK}`
      );

      authService.registerOutboundState(state);

      // Redirect the user to the SSO provider
      res.redirect(authUrl);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  async handleEsiCallback(req: Request, res: Response): Promise<void> {
    try {
      // Get authentication state
      const authenticationState: AuthenticationState =
        await authService.handleEsiCallback(req, res);

      // Store authentication state for character
      await this.repo.storeAuth(authenticationState);

      // Return to homepage
      res.redirect(endpoints.HOMEPAGE);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}
