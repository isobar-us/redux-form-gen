/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  render() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className='nav-footer' id='footer'>
        <section className='sitemap'>
          <a href={this.props.config.baseUrl} className='nav-home'>
            <img
              src={this.props.config.baseUrl + this.props.config.footerIcon}
              alt={this.props.config.title}
              width='66'
              height='58'
            />
          </a>
          <div>
            <h5>Docs</h5>
            <a href={`${this.props.config.baseUrl}docs/${this.props.language}/getting-started.html`}>
              Getting Started
            </a>
            <a href={`${this.props.config.baseUrl}docs/${this.props.language}/examples.html`}>
              Examples
            </a>
            <a href={`${this.props.config.baseUrl}docs/${this.props.language}/api.html`}>
              API Reference
            </a>
          </div>
          <div>
            <h5>Community</h5>
            <a href={`${this.props.config.baseUrl + this.props.language}/users.html`}>User Showcase</a>
            <a href='https://stackoverflow.com/questions/tagged/redux-form-gen' target='_blank'>
              Stack Overflow
            </a>
            <a href='https://twitter.com/IsobarUS' target='_blank'>
              Twitter
            </a>
          </div>
          <div>
            <h5>More</h5>
            <a href={`${this.props.config.baseUrl}blog`}>Blog</a>
            <a href='https://github.com/isobar-us/redux-form-gen'>GitHub</a>
            <a
              className='github-button'
              href={this.props.config.repoUrl}
              data-icon='octicon-star'
              data-count-href='/isobar-us/redux-form-gen/stargazers'
              data-show-count={true}
              data-count-aria-label='# stargazers on GitHub'
              aria-label='Star this project on GitHub'
            >
              Star
            </a>
          </div>
        </section>

        <a href='https://github.com/isobar-us/' target='_blank' className='fbOpenSource'>
          <img
            src={`${this.props.config.baseUrl}img/isobar_logo.png`}
            alt='Isobar Open Source'
            width='170'
            height='45'
          />
        </a>
        <section className='copyright'>Copyright &copy; {currentYear} Isobar.</section>
      </footer>
    );
  }
}

module.exports = Footer;
