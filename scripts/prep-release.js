const prompts = require('prompts');
const semver = require('semver');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const _ = require('lodash');

/* eslint-disable no-console */

// HELPERS
const resolvePath = (...parts) => path.resolve(__dirname, ...parts);

const writePackageJson = async function(path, json) {
  return fs.writeFileAsync(path, `${JSON.stringify(json, null, 2)}\n`, 'utf-8');
};

const upgradeExample = async function(exampleName, newVersion) {
  const examplePackageJsonPath = `../examples/${exampleName}/package.json`;
  const examplePackageJson = require(examplePackageJsonPath);
  examplePackageJson.dependencies['@isobar-us/redux-form-gen'] = newVersion;
  await writePackageJson(resolvePath(examplePackageJsonPath), examplePackageJson);
};

const paths = {
  packageJson: resolvePath('../package.json'),
  examples: resolvePath('../examples/'),
  readme: resolvePath('../README.md'),
  changelog: resolvePath('../CHANGELOG.md')
};
const packageJson = require('../package.json');

const currentVersion = packageJson.version;

console.log('Current Version:', currentVersion);
(async function() {
  const options = await prompts([
    {
      type: 'select',
      name: 'releaseType',
      message: 'Release Type?',
      choices: [
        {title: 'Patch', value: 'patch'},
        {title: 'Minor', value: 'minor'},
        {title: 'Major', value: 'major'},
        {title: 'Other', value: 'other'}
      ],
      initial: 0
    },
    {
      type: (prev) => prev === 'other' ? 'text' : null,
      name: 'newVersion',
      message: 'Enter a custom version:'
    }
  ]);
  if (options.releaseType !== 'other') {
    options.newVersion = semver.inc(currentVersion, options.releaseType);
  }

  // update package.json
  packageJson.version = options.newVersion;
  writePackageJson(paths.packageJson, packageJson);
  console.log('Wrote package.json');

  // update the package.json file for each example with new dependency version
  const examples = await fs.readdirAsync(paths.examples);
  for (let i in examples) {
    const example = examples[i];
    await upgradeExample(example, options.newVersion);
    console.log(`Wrote examples/${example}/package.json`);
  }

  // update example links in readme
  let readme = await fs.readFileAsync(paths.readme, 'utf-8');
  const exampleLinksRegex = /EXAMPLE-LINKS-LIST:START[\s\S]*EXAMPLE-LINKS-LIST:END/gm;
  const exampleLinks = _.first(readme.match(exampleLinksRegex));
  const newExampleLinks = exampleLinks.replace(new RegExp(`v${currentVersion}`, 'g'), `v${options.newVersion}`);
  readme = readme.replace(exampleLinksRegex, newExampleLinks);
  await fs.writeFileAsync(paths.readme, readme, 'utf-8');
  console.log('Wrote example links in README.md');

  // TODO add updates for CHANGELOG links
})();
