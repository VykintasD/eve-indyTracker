import { endpoints } from './config/shared.ts';
import fs from 'fs';
import path from 'path';
import express from 'express';
import https from 'https';
import cors from 'cors';
import routes from './routes/index.ts';

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
    this.app.use(routes);
  }
}
