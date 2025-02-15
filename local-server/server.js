const Buffer = require('buffer').Buffer;
const fs = require('fs');
const path = require('path');
const express = require('express');
const https = require('https');
const axios = require('axios');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const jwkToPem = require('jwk-to-pem');

const dotenv = require('dotenv').config({ path: '../.env' });
const SCOPES = require('./config/scopes');

const app = express();
const PORT = process.env.PORT || 5000;

const privateKey = fs.readFileSync(
  path.join('../certs', process.env.HTTPS_KEY_FILENAME)
);
const certificate = fs.readFileSync(
  path.join('../certs', process.env.HTTPS_CERT_FILENAME)
);

app.use(cors());
app.use(express.json());

https
  .createServer({ key: privateKey, cert: certificate }, app)
  .listen(PORT, () => {
    console.log(`Server running on https://localhost:${PORT}`);
  });

const endpoints = {
  BASE: 'https://localhost:5000',
  AUTH_CALLBACK: '/auth/callback',
  HOMEPAGE: 'https://localhost:8080',
};

const ACCEPTED_ISSUERS = ('logineveonline.com', 'https://login.eveonline.com');
const EXPECTED_AUDIENCE = 'EVE Online';

// Route to start OAuth flow (redirect to OAuth provider)
app.get('/auth', (req, res) => {
  console.log('hit auth');
  const { authUrl, state } = generateSSOurl(
    SCOPES,
    `${endpoints.BASE}${endpoints.AUTH_CALLBACK}`
  );

  this.state = state;
  res.redirect(authUrl);
});

// Callback route after user is authenticated (OAuth callback)
app.get(endpoints.AUTH_CALLBACK, async (req, res) => {
  const authorizationCode = req.query.code;
  const reqState = req.query.state;

  if (!authorizationCode) {
    return res.status(400).send('No authorization code found');
  }

  // confirm returned state code matches to avoid CSRF
  if (reqState == this.state) {
    try {
      // Exchange authorization code for access token
      const tokenResponse = await requestAccessToken(authorizationCode);
      const accessToken = tokenResponse.data.access_token;

      this.accessToken = accessToken;
      console.log('verifying access token...');
      await verifyAccessToken(accessToken);

      res.redirect(endpoints.HOMEPAGE);
    } catch (error) {
      console.error('Error during token exchange:', error);
      res.status(500).send('Error during OAuth token exchange');
    }
  }
});

//Fetch data from external service using access token
// app.get('/data', async (req, res) => {
//   const accessToken = req.session.accessToken;

//   if (!accessToken) {
//     return res.status(403).send('Not authenticated');
//   }

//   try {
//     const response = await axios.get('https://api.example.com/data', {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     res.json(response.data);
//   } catch (error) {
//     console.error('Error fetching data:', error);
//     res.status(500).send('Error fetching data');
//   }
// });

async function verifyAccessToken(accessToken) {
  const jwksMetadata = await fetchJWKSMetadata();
  const keys = jwksMetadata.keys;

  const header = jwt.decode(accessToken, { complete: true }).header;
  const key = keys.find(
    (item) => item.kid === header.kid && item.alg === header.alg
  );

  console.log(header);
  console.log(jwksMetadata);
  console.log(accessToken);

  const pem = jwkToPem(key);
  const decodedToken = jwt.verify(accessToken, pem, {
    algorithms: [header.alg],
    issuer: ACCEPTED_ISSUERS,
    audience: EXPECTED_AUDIENCE,
    tenant: 'tranquility',
    tier: 'livea',
    region: 'world',
  });

  console.log(decodedToken);
}

async function fetchJWKSMetadata() {
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

async function requestAccessToken(authorizationCode) {
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

// Function to generate the authorization URL
function generateSSOurl(scopes, redirectUri) {
  const state = Math.random().toString(36).substring(2, 18);

  const queryParams = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.CLIENT_ID,
    redirect_uri: redirectUri,
    scope: scopes.join(' '),
    state: state,
  });

  const authUrl = `https://login.eveonline.com/v2/oauth/authorize?${queryParams.toString()}`;
  return { authUrl, state };
}
