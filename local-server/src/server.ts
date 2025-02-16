import { endpoints } from './config/shared.ts';
import fs from 'fs';
import path from 'path';
import express from 'express';
import https from 'https';
import axios from 'axios';
import cors from 'cors';

// HTTPS config
const httpsPrivateKey = fs.readFileSync(
  path.join('../certs', process.env.HTTPS_KEY_FILENAME!)
);
const httpsCertificate = fs.readFileSync(
  path.join('../certs', process.env.HTTPS_CERT_FILENAME!)
);

// Services
import AuthenticationService from './services/authenticationService.ts';

export default class Server {
  app: any;
  authService: AuthenticationService;
  PORT: string | undefined;
  state: string | undefined;
  accessToken: string;

  constructor() {
    this.app = express();
    this.authService = new AuthenticationService();
    this.accessToken = '';
    this.configureMiddleware();
    this.configureRoutes();
  }

  configureMiddleware() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  start() {
    https
      .createServer({ key: httpsPrivateKey, cert: httpsCertificate }, this.app)
      .listen(process.env.EXPRESS_PORT, () => {
        console.log(`Server running on ${endpoints.BASE}`);
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
      await this.authService.handleEsiCallback(req, res);
    });
  }
}
