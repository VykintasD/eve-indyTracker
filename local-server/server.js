const Buffer = require('buffer').Buffer;

const express = require('express');
const session = require('express-session');

const axios = require('axios');
const cors = require('cors');

const dotenv = require('dotenv');
const SCOPES = require('./config/scopes');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const endpoints = {
  BASE: 'http://localhost:5000',
  AUTH_CALLBACK: '/auth/callback',
  HOMEPAGE: 'http://localhost:8080',
};

// Route to start OAuth flow (redirect to OAuth provider)
app.get('/auth', (req, res) => {
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
