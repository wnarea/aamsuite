// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,

  region: 'us-east-1',

  identityPoolId: 'us-east-1:d08bd9e0-483e-44f9-8d70-ff5222b63932',
  userPoolId: 'us-east-1_HgrA6dVky',
  clientId: '5b8v62c3i60tje12hfdjt5cnu0',

  rekognitionBucket: 'rekognition-pics',
  bucketName: "docs.afianza.pro",
  bucketRegion: 'us-east-1',
  albumName: 'futureUse',

  ddbRegion: '',
  ddbTableName: 'LoginTrail',

  webApiUrl: 'http://localhost:5000/api'
};
