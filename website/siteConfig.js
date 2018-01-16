/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/* List of projects/orgs using your project for the users page */
const users = [
  {
    caption: 'User1',
    image: 'img/reduxformgen.svg',
    infoLink: 'https://github.com/isobar-us/redux-form-gen',
    pinned: true
  }
];

const siteConfig = {
  title: 'Redux Form Gen' /* title for your website */,
  tagline: 'A pluggable form generator for redux-form',
  url: 'https://isobar-us.github.io/redux-form-gen' /* your website url */,
  baseUrl: '/' /* base url for your project */,
  projectName: 'redux-form-gen',
  headerLinks: [
    {search: true},
    {doc: 'getting-started', label: 'Docs'},
    {doc: 'api', label: 'API'},
    {href: 'https://github.com/isobar-us/redux-form-gen', label: 'GitHub'}
    // {page: 'help', label: 'Help'}
    // {blog: true, label: 'Blog'}
  ],
  users,
  /* path to images for header/footer */
  headerIcon: 'img/reduxformgen.svg',
  footerIcon: 'img/reduxformgen.svg',
  favicon: 'img/favicon-32x32.png',
  /* colors for website */
  colors: {
    primaryColor: '#222222',
    secondaryColor: '#555555'
  },
  // This copyright info is used in /core/Footer.js and blog rss/atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Isobar`,
  // organizationName: 'deltice', // or set an env variable ORGANIZATION_NAME
  // projectName: 'test-site', // or set an env variable PROJECT_NAME
  highlight: {
    // Highlight.js theme to use for syntax highlighting in code blocks
    theme: 'default'
  },
  scripts: ['https://buttons.github.io/buttons.js'],
  // You may provide arbitrary config keys to be used as needed by your template.
  repoUrl: 'https://github.com/isobar-us/redux-form-gen'
};

module.exports = siteConfig;
