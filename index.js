'use strict';

const { URL, URLSearchParams } = require('url');
const request = require('request-promise-native');

module.exports = class Form {
  constructor (config) {
    this._defaults = {};
    this._config = Object.assign(this._defaults, config);
  }

  async send (body) {
    const { id, key, service } = this._config;
    if (!id || !key || !service) throw new Error('Submission requires a service url, an id and a key.');
    if ([
      typeof body.text === 'string',
      typeof body.html === 'string',
      typeof body.payload === 'object'
    ].filter(value => value).length !== 1) throw new Error('Unexpected input.');
    let url = Object.assign(new URL('/api/submit', service), { search: new URLSearchParams({ id, key }) });
    try {
      await request({
        uri: url.href,
        method: 'POST',
        body,
        json: true
      });
    } catch (error) {
      throw Object.assign(new Error('Error submiting form.', { error }));
    }
  }
};
