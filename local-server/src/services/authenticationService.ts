import { authenticationScopes } from '../config/authService.ts';
import axios from 'axios';

export default class AuthenticationService {
  authenticationScopes: String[];

  constructor() {
    this.authenticationScopes = authenticationScopes;
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
