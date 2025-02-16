# eve-indyTracker

# Setup

## Register your app with ESI

1. Go to https://developers.eveonline.com/applications to register your application
2. For auth callback, use `https://localhost:5000/auth/callback` (you may change the port, but be sure to update `.env` accordingly)
3. Once registered, you can obtain your `CLIENT_ID` and `CLIENT_SECRET` from there. These go in your `.env` file.
4. Grab your selected scopes and update `./local-server/src/config/authService.ts` to export your `authenticationScopes`

## General setup

Create `.env` file and a `certs` folder in root

`npm install`

You need to set up PostreSQL - download here https://www.postgresql.org/download/windows/

Set an admin password, and note down which port you are using for the db server (5432 by default).

To verify your DB is running - https://www.w3schools.com/postgresql/postgresql_getstarted.php

Update your `.env` in root with your values

## Using HTTPS

EVE SSO uses OAuth 2.0 - since this is a localhost app, we'd like to use HTTPS.

For that, we need self-signed certificates.

Generate certificates, and add them to the `./certs` folder.

### Generating the certificates

TODO: migrate to CLI-only steps for installing CA (OpenSSL maybe, idk for now)

You can use any method you like to generate this.

I have used `mkcert` - https://github.com/FiloSottile/mkcert

1. Install `mkcert`:

   `choco install mkcert`

2. Install the local certificate authority:

   `mkcert -install`

3. Generate the certificates in `certs` folder for `{yourAppName}` (NEVER SHARE OR COMMIT THESE FILES):

   `cd certs && mkcert yourAppName.com "*.yourAppName.com" localhost 127.0.0.1 ::1`

4. Add the file names of your certificates to your `.env` file:

   `HTTPS_CERT_FILENAME=yourAppName.com+5.pem`

   `HTTPS_KEY_FILENAME=yourAppName.com+5-key.pem`

### Example .env file using :5000 for server, :8080 for frontend and :5432 for DB

```
HTTPS_CERT_FILENAME=yourAppName.com+5.pem
HTTPS_KEY_FILENAME=yourAppName.com+5-key.pem
CLIENT_ID={your cliend id from ESI}
CLIENT_SECRET={your super secret client secret from ESI}
EXPRESS_PORT=5000
VUE_PORT=8080
PG_PASSWORD={your postgres password}
PG_PORT=5432
PG_DATABASE=postgres
PG_HOST=localhost
PG_USER=postgres
```

# Starting the services

We are using `concurrently` here - start both services with `npm run start` from root directory.
