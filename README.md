:eyes:

### Pre-requisite

1. Make sure download your Google API private key and store it in `resources/google.private.key` before you can run this app.

### Build & Deployment

1. Run `npx gulp` to extract all production ready code into **build** folder and compress into a `tar.gz` file.

2. `npm install --production` is invoked as part of `npx gulp (install)` so make sure await it to finish.

3. Transfer to server and execute `tar -zxvf contact-lens.tar.gz` to extract the package.

4. Run `node scripts/index.js` to start the server

### Configure environment variables
Set all the environment variables found in `scripts/validate-env.js`

| Variable | Description | Example |
| ----- | ---- | ---- |
| API_KEY | The mickey mouse validation key | 144bebc8-d827-4f9a-9d16-6d6587af281a |
| IFTTT_MAKER | IFTTT Maker ID | oSHH3Rrt8whbs7emLur1s |
| GOOGLE_ISSUER | `client_email` field in API_Project.json | baz@api-project-892138832492.foo.bar.iam.gserviceaccount.com |
| GOOGLE_CALENDER_ID | Calendar ID to be used - get it from Google Calendar | xxx.yyy_98f7ag6nbh8et69fdgb9gndsf@group.calendar.google.com |
