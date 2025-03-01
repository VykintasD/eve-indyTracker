import { authenticationScopes } from '../config/authService.ts';
import { endpoints } from '../config/shared.ts';
import axios from 'axios';
import jwt, { JwtPayload } from 'jsonwebtoken';
import jwkToPem from 'jwk-to-pem';
import { Character, AuthToken, AuthenticationState } from '../types/types.ts';
import { AuthenticationError } from '../types/errors.ts';

interface CustomJwtPayload extends JwtPayload {
  tier: string;
  tenant: string;
  region: string;
  name: string;
  owner: string;
}

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

  /**
   * Once we have signed in with the ESI auth provider, we are redirected to this handler
   * We do not trust the returned token blindly, and need to verify:
   * - Whether auth provider returned the same state challenge we sent
   * - Whether algo, issuer and audience match what we expect
   * - Whether the key matches the public key available on JWKS metadata endpoint
   *
   * Once verified, we get the character ID via another request, this time using the provided token
   * TODO: better error handling
   * @param req
   * @param res
   * @returns Promise<AuthenticationState>
   */
  async handleEsiCallback(req: any, res: any): Promise<AuthenticationState> {
    const { code, state } = req.query;

    if (!code) {
      throw new AuthenticationError('No authorization code found');
    }

    // confirm returned state code matches to avoid CSRF
    if (this.verifyIncomingState(state)) {
      try {
        // Exchange authorization code for access token
        const { access_token, refresh_token, token_type } =
          await this.requestAccessToken(code);

        console.log('Verifying access token... 🔒');
        const decodedToken = await this.verifyAccessToken(access_token);

        console.log('Token verified 😎');

        const character: Character = await this.getCharacter(decodedToken.name);

        const authToken: AuthToken = {
          accessToken: access_token,
          refreshToken: refresh_token,
          expiresAt: decodedToken.exp ?? 0,
          tokenType: token_type,
          characterId: character.id,
        };

        const authenticationState: AuthenticationState = {
          character: character,
          token: authToken,
        };

        return authenticationState;
      } catch (error: any) {
        throw error instanceof AuthenticationError
          ? error
          : new AuthenticationError('Auth error: ', error);
      }
    } else {
      throw new AuthenticationError(
        'SSO service returned mismatched state challenge'
      );
    }
  }

  async getCharacter(characterName: string): Promise<Character> {
    const character = await axios.post(
      'https://esi.evetech.net/latest/universe/ids',
      [characterName]
    );

    return character?.data?.characters[0];
  }

  // TODO: error handling
  async verifyAccessToken(accessToken: string): Promise<CustomJwtPayload> {
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
    return jwt.verify(accessToken, pem, {
      algorithms: [key.alg],
      issuer: ACCEPTED_ISSUERS,
      audience: EXPECTED_AUDIENCE,
    }) as CustomJwtPayload;
  }

  async fetchJWKSMetadata() {
    console.log('Getting well known metadata... 🔃');
    const wellKnownMetadata = await axios.get(
      'https://login.eveonline.com/.well-known/oauth-authorization-server'
    );

    if (wellKnownMetadata?.data?.jwks_uri) {
      console.log('Getting token issuer uri... 🔍');
      const jwksMetadata = await axios.get(wellKnownMetadata?.data?.jwks_uri);
      return jwksMetadata.data;
    }
  }

  async requestAccessToken(authorizationCode: string) {
    const basicAuth = Buffer.from(
      `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
    ).toString('base64');

    const accessToken = await axios.post(
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

    return accessToken.data;
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
