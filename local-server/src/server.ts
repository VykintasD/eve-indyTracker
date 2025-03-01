import { endpoints } from './config/shared.ts';
import fs from 'fs';
import path from 'path';
import express from 'express';
import https from 'https';
import axios from 'axios';
import cors from 'cors';
import { AuthenticationState } from './types/types.ts';

// HTTPS config
const httpsPrivateKey = fs.readFileSync(
  path.join('../certs', process.env.HTTPS_KEY_FILENAME!)
);
const httpsCertificate = fs.readFileSync(
  path.join('../certs', process.env.HTTPS_CERT_FILENAME!)
);

// Services
import AuthenticationService from './services/authenticationService.ts';
import Repository from '../db/repository.ts';

export default class Server {
  app: any;
  authService: AuthenticationService;
  repository: Repository;

  constructor() {
    this.app = express();
    this.authService = new AuthenticationService();
    this.repository = new Repository();
    this.configureMiddleware();
    this.configureRoutes();
    this.connectToDb();
  }

  configureMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  connectToDb() {
    this.repository.connect();
  }

  start() {
    https
      .createServer({ key: httpsPrivateKey, cert: httpsCertificate }, this.app)
      .listen(process.env.EXPRESS_PORT, () => {
        console.log(`Server running on ${endpoints.BASE} 🤖`);
      });
  }

  configureRoutes() {
    /**
     * Auth route to initiate SSO
     * @route '/auth'
     *  */
    this.app.get(endpoints.AUTH, (req: any, res: any) => {
      const { authUrl, state } = this.authService.generateSSOurl(
        `${endpoints.BASE}${endpoints.AUTH_CALLBACK}`
      );

      this.authService.registerOutboundState(state);
      res.redirect(authUrl);
    });

    /**
     * ESI Callback route after user is authenticated (OAuth callback)
     * @route '/auth/callback'
     *  */
    this.app.get(endpoints.AUTH_CALLBACK, async (req: any, res: any) => {
      try {
        // Get authentication state
        const authenticationState: AuthenticationState =
          await this.authService.handleEsiCallback(req, res);

        // Store authentication state for character
        console.log(authenticationState);

        console.log('writing character to DB');
        this.repository.storeAuth(authenticationState);

        // query all stored characters
        const chars = await this.repository.fetchAllCharacters();
        console.log(chars.rows);

        // Return to homepage
        res.redirect(endpoints.HOMEPAGE);
      } catch (err) {
        console.log(err);
      }
    });
  }
}
