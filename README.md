# Lambda Events

[![GitHub][github-badge]][github-url]
[![Documentation][hosted-docs-badge]][hosted-docs-url]
[![License][license-badge]][license-url]
[![Gitter][gitter-badge]][gitter-url]
[![Issue Count][issues-badge]][issues-url]

[![npm version][npm-badge]][npm-url]
[![Known Vulnerabilities][snyk-badge]][snyk-url]
[![Build Status][travis-badge]][travis-url]
[![Coverage Status][coverage-badge]][coverage-url]
[![Code Climate][codeclimate-badge]][codeclimate-url]
[![Dependency Status][david-badge]][david-url]
[![Inline docs][docs-badge]][docs-url]

Provides classes that ease the integration of receiving, handling and responding to AWS Lambda Events.

See below for the supported events.

### Cloudformation

Provides a simple interface for working with [Custom Cloudformation Resource](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/template-custom-resources.html) events.

```javascript
import uuidV4 from 'uuid/v4';
import { Cloudformation, OK, ERROR } from 'node-lambda-events';

class UUIDGenerator extends Cloudformation {
  create() {
    const id = uuidV4();
    const data = { foo: 'bar' };
    this.response.respond(OK, { id, data });
  }

  update() {
    this.create();
  }

  delete() {
    this.response.respond(OK, { id: this.id });
  }
}

export default Cloudformation.wrap(UUIDGenerator);
```

## Development

A handy [Dockerfile](/Dockerfile.development) and [docker-compose.yml](/docker-compose.yml) are provided to let you get easily setup for developing with the project.

Run `docker-compose build` to build and install project dependencies. The entrypoint for the resulting development container is `npm run`, allowing you to easily run any of the scripts defined inside [package.json](/package.json).

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/notonthehighstreet/node-lambda-events. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The project is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).

[npm-badge]: https://badge.fury.io/js/node-lambda-events.svg
[npm-url]: https://badge.fury.io/js/node-lambda-events
[gitter-badge]: http://img.shields.io/badge/gitter-chat-red.svg
[gitter-url]: https://gitter.im/notonthehighstreet/node-lambda-events
[github-badge]: https://img.shields.io/badge/github-link-blue.svg
[github-url]: https://github.com/notonthehighstreet/node-lambda-events
[license-badge]: http://img.shields.io/badge/license-MIT-yellowgreen.svg
[license-url]: #license
[docs-badge]: http://inch-ci.org/github/notonthehighstreet/node-lambda-events.svg?branch=master
[docs-url]: http://inch-ci.org/github/notonthehighstreet/node-lambda-events
[hosted-docs-badge]: http://img.shields.io/badge/docs-github.io-blue.svg
[hosted-docs-url]: https://notonthehighstreet.github.io/node-lambda-events
[snyk-badge]: https://snyk.io/test/github/notonthehighstreet/node-lambda-events/badge.svg
[snyk-url]: https://snyk.io/test/github/notonthehighstreet/node-lambda-events
[david-badge]: https://david-dm.org/notonthehighstreet/node-lambda-events.svg
[david-url]: https://david-dm.org/notonthehighstreet/node-lambda-events
[travis-badge]: https://api.travis-ci.org/notonthehighstreet/node-lambda-events.svg
[travis-url]: https://travis-ci.org/notonthehighstreet/node-lambda-events
[codeclimate-badge]: https://codeclimate.com/github/notonthehighstreet/node-lambda-events/badges/gpa.svg
[codeclimate-url]: https://codeclimate.com/github/notonthehighstreet/node-lambda-events
[coverage-badge]: https://codeclimate.com/github/notonthehighstreet/node-lambda-events/badges/coverage.svg
[coverage-url]: https://codeclimate.com/github/notonthehighstreet/node-lambda-events/coverage
[issues-badge]: https://codeclimate.com/github/notonthehighstreet/node-lambda-events/badges/issue_count.svg
[issues-url]: https://codeclimate.com/github/notonthehighstreet/node-lambda-events
