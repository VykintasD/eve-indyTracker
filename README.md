# eve-indyTracker

# Setup

Create `.env` in the root folder

`npm install`

## Using HTTPS

EVE SSO uses OAuth 2.0 - since this is a localhost app, we'd like to use HTTPS.

For that, we need self-signed certificates.

Generate certificates, and add them to the `./certs` folder.

## Generating the certificates

You can use `mkcert` - https://github.com/FiloSottile/mkcert

1. Install mkcert:
   `choco install mkcert`
2. Install the local certificate authority:
   `mkcert -install`
3. Generate the certificates:
   `cd certs && mkcert indytracker.com "*.indytracker.com" localhost 127.0.0.1 ::1`

This will create the following files (NEVER SHARE OR COMMIT THESE FILES):
`indytracker.com+5.pem` (the certificate)
`indytracker.com+5-key.pem` (the private key)

4. Add the file names of your certificates to your `.env` file:
   `HTTPS_CERT_FILENAME=indytracker.com+5.pem`
   `HTTPS_KEY_FILENAME=indytracker.com+5-key.pem`

# Starting the services

We are using `concurrently` here - start both services with `npm run start` from root directory.
