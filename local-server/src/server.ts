import { Buffer } from 'buffer';
import fs from 'fs';
import path from 'path';
import express from 'express';
import https from 'https';
import axios from 'axios';
import cors from 'cors';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import AuthenticationService from './services/authenticationService.ts';

const privateKey = fs.readFileSync(
  path.join('../certs', process.env.HTTPS_KEY_FILENAME!)
);
const certificate = fs.readFileSync(
  path.join('../certs', process.env.HTTPS_CERT_FILENAME!)
);

// const repo = new Repository();
// repo.connect();
const endpoints = {
  BASE: `https://localhost:${process.env.EXPRESS_PORT}`,
  AUTH_CALLBACK: '/auth/callback',
  HOMEPAGE: 'https://localhost:8080',
};

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
      .createServer({ key: privateKey, cert: certificate }, this.app)
      .listen(process.env.EXPRESS_PORT, () => {
        console.log(`Server running on ${endpoints.BASE}`);
      });

    console.log(process.env.ESI_SCOPES);
  }

  configureRoutes() {
    this.app.get('/auth', (req: any, res: any) => {
      const { authUrl, state } = this.authService.generateSSOurl(
        `${endpoints.BASE}${endpoints.AUTH_CALLBACK}`
      );

      this.state = state;
      res.redirect(authUrl);
    });

    // Callback route after user is authenticated (OAuth callback)
    this.app.get(endpoints.AUTH_CALLBACK, async (req: any, res: any) => {
      const authorizationCode = req.query.code;
      const reqState = req.query.state;

      if (!authorizationCode) {
        return res.status(400).send('No authorization code found');
      }

      // confirm returned state code matches to avoid CSRF
      if (reqState == this.state) {
        try {
          // Exchange authorization code for access token
          const tokenResponse = await this.requestAccessToken(
            authorizationCode
          );
          const accessToken = tokenResponse.data.access_token;
          const refreshToken = tokenResponse.data.refresh_token;

          this.accessToken = accessToken;
          console.log('verifying access token...');
          await this.verifyAccessToken(accessToken);

          res.redirect(endpoints.HOMEPAGE);
        } catch (error) {
          console.error('Error during token exchange:', error);
          res.status(500).send('Error during OAuth token exchange');
        }
      }
    });
  }

  async requestAccessToken(authorizationCode: string) {
    const basicAuth = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString('base64');

    return await axios.post(
      'https://login.eveonline.com/v2/oauth/token',
      new URLSearchParams({
        grant_type: 'authorization_code',
        code: authorizationCode,
      }),
      {
        headers: {
          Authorization: `Basic ${basicAuth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
  }

  async verifyAccessToken(accessToken: string) {
    const ACCEPTED_ISSUERS = [
      'logineveonline.com',
      'https://login.eveonline.com',
    ];
    const EXPECTED_AUDIENCE = 'EVE Online';

    const jwksMetadata = await this.fetchJWKSMetadata();
    const keys = jwksMetadata.keys;

    const header = jwt.decode(accessToken, { complete: true })?.header;
    const key = keys.find(
      (item: any) => item.kid === header?.kid && item.alg === header?.alg
    );

    console.log(header);
    console.log(jwksMetadata);
    console.log(accessToken);

    const pem = jwkToPem(key);
    const decodedToken: JwtPayload | string = jwt.verify(accessToken, pem, {
      algorithms: [key.alg],
      issuer: ACCEPTED_ISSUERS,
      audience: EXPECTED_AUDIENCE,
    });

    // if (decodedToken.tier !== 'live') {
    //   throw new Error('Invalid tier in token');
    // }
    // if (decodedToken.tenant !== 'tranquility') {
    //   throw new Error('Invalid tenant in token');
    // }
    // if (decodedToken.region !== 'world') {
    //   throw new Error('Invalid region in token');
    // }

    console.log(decodedToken);
  }

  async fetchJWKSMetadata() {
    console.log('Getting well known metadata...');
    const wellKnownMetadata = await axios.get(
      'https://login.eveonline.com/.well-known/oauth-authorization-server'
    );

    if (wellKnownMetadata?.data?.jwks_uri) {
      console.log('Getting token issuer uri...');
      const jwksMetadata = await axios.get(wellKnownMetadata?.data?.jwks_uri);
      return jwksMetadata.data;
    }
  }
}
