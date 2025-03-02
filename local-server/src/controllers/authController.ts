import { NextFunction, Request, Response } from 'express';
import AuthenticationService from '../services/authenticationService';
import { endpoints } from '../config/shared';
import { AuthenticationState, AuthToken } from '../types/types';
import Repository from '../../db/repository';

const authService = new AuthenticationService();
const repo = new Repository();

export default class AuthController {
  repo: Repository;

  constructor() {
    this.repo = repo;
  }

  initiateSSO(req: Request, res: Response) {
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
  }

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

  async verifyAndRefreshToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { characterId } = req.params;

      if (characterId) {
        const token = await this.getToken(characterId);
        // check if token valid for next 2min
        if (this.isTokenExpired(token)) {
          const refreshedToken: AuthToken =
            await authService.requestTokenRefresh(token, characterId);

          this.repo.storeToken(refreshedToken);
        }
      }
      next();
    } catch (err: any) {
      console.error(err);
    }
  }

  private isTokenExpired(token: AuthToken) {
    let tokenExpiry;

    if (token.expires_at) {
      tokenExpiry = new Date(token.expires_at * 1000);
    } else {
      return true;
    }

    const now = new Date();
    now.setMinutes(now.getMinutes() + 2);

    return tokenExpiry < now;
  }

  private async getToken(characterId: string) {
    return await repo.getAccessToken(Number(characterId));
  }
}
