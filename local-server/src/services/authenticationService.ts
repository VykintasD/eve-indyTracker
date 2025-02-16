import { authenticationScopes } from '../config/authService.ts';
import { endpoints } from '../config/shared.ts';
import axios from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';

export default class AuthenticationService {
  authenticationScopes: string[];
  challengeState: string = '';
  homepage: string;

  constructor() {
    this.authenticationScopes = authenticationScopes;
    this.homepage = endpoints.HOMEPAGE;
  }

  registerOutboundState(state: string) {
    this.challengeState = state;
  }

  verifyIncomingState(state: string) {
    return this.challengeState === state;
  }

  async handleEsiCallback(req: any, res: any) {
    const authorizationCode = req.query.code;

    if (!authorizationCode) {
      return res.status(400).send('No authorization code found');
    }

    // confirm returned state code matches to avoid CSRF
    if (this.verifyIncomingState(req.query.state)) {
      try {
        // Exchange authorization code for access token
        const tokenResponse = await this.requestAccessToken(authorizationCode);

        const accessToken = tokenResponse.data.access_token;
        const refreshToken = tokenResponse.data.refresh_token;

        console.log('verifying access token...');
        await this.verifyAccessToken(accessToken);
        console.log('success!');

        res.redirect(endpoints.HOMEPAGE);
      } catch (error) {
        console.error('Error during token exchange:', error);
        res.status(500).send('Error during OAuth token exchange');
      }
    } else {
      res.status(500).send('SSO service returned mismatched state challenge');
    }
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

    const pem = jwkToPem(key);
    const decodedToken: JwtPayload | string = jwt.verify(accessToken, pem, {
      algorithms: [key.alg],
      issuer: ACCEPTED_ISSUERS,
      audience: EXPECTED_AUDIENCE,
    });
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

  generateSSOurl(redirectUri: string) {
    const state: string = Math.random().toString(36).substring(2, 18);
    const CLIENT_ID: string = process.env.CLIENT_ID as string;

    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: redirectUri,
      scope: this.authenticationScopes.join(' '),
      state: state,
    });

    const authUrl = `https://login.eveonline.com/v2/oauth/authorize?${queryParams.toString()}`;
    return { authUrl, state };
  }
}
