// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

let base_url = 'https://staging.api.kts.slatedev.com'; //staging

export const environment = {
  production: false,
  // TODO: update to reflect real url
  apiUrl: base_url
};
