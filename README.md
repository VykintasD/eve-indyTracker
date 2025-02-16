# eve-indyTracker

# Setup

Create `.env` file and a `certs` folder in root

`npm install`

You need to set up PostreSQL - download here https://www.postgresql.org/download/windows/

Set an admin password, and note down which port you are using for the db server (5432 by default).

To verify your DB is running - https://www.w3schools.com/postgresql/postgresql_getstarted.php

Update your `.env` in root with your values

```
PG_PASSWORD=YourDBPassword
PG_PORT=PortDBListeningOn
PG_DATABASE=DatabaseName
PG_HOST=localhost
PG_USER=YourUser
```

## Using HTTPS

EVE SSO uses OAuth 2.0 - since this is a localhost app, we'd like to use HTTPS.

For that, we need self-signed certificates.

Generate certificates, and add them to the `./certs` folder.

### Generating the certificates

You can use any method you like to generate this.

I have used `mkcert` - https://github.com/FiloSottile/mkcert

1. Install `mkcert`:

   `choco install mkcert`

2. Install the local certificate authority:

   `mkcert -install`

3. Generate the certificates in `certs` folder (NEVER SHARE OR COMMIT THESE FILES):

   `cd certs && mkcert indytracker.com "*.indytracker.com" localhost 127.0.0.1 ::1`

4. Add the file names of your certificates to your `.env` file:

   `HTTPS_CERT_FILENAME=indytracker.com+5.pem`

   `HTTPS_KEY_FILENAME=indytracker.com+5-key.pem`

# Starting the services

We are using `concurrently` here - start both services with `npm run start` from root directory.
