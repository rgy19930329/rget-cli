const latestVersion = require('latest-version')

latestVersion('rget-cli').then(version => {
  console.log('cli latest version: ' + version)
});