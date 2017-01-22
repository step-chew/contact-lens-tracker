:eyes:

## :exclamation: _This is meant to be run in AWS Lambda_ :exclamation:

### Pre-requisite

1. Make sure download your Google API private key and store it in `resources/google.private.key` before you can run this app.

### Running Locally

Run the command `npm start [method] [path-param] [api-key]` to test locally.

e.g.

```sh
npm start POST new abcdef
```

### Build & Deployment

1. Run `gulp dist` to extract all production ready code into **build** folder.

2. `npm install --production` is invoked as part of `gulp dist` so make sure await it to finish.

3. Archive **build** folder into a zip and subsequently upload to AWS Lambda.

### Configure AWS Lambda
1. Set all the environment variables found in `scripts/validate-env.js`

2. Set **Handler** value to **scripts/index.handler**.
