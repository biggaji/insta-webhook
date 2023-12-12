# Instagram Webhook Boilerplate

![Node.js](https://img.shields.io/badge/Node.js-v20.x-green.svg)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

A flexible and easy-to-use Node.js boilerplate for implementing Instagram webhook functionality.

## Features

- **Instagram Verification:** Handles verification requests to ensure the webhook is properly set up.
- **Payload Verification:** Compares the received signature with the locally generated HMAC signature for
  payload integrity.
- **Flexible Structure:** Easily customizable and extendable for your specific use cases.
- **Tested:** Includes a comprehensive test suite using Chai and Supertest.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
- [Usage](#usage)
- [Testing](#testing)
- [References](#references)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

Clone the repository:

```bash
git clone https://github.com/biggaji/insta-webhook.git
```

Install dependencies:

Using `npm`

```bash
cd insta-webhook
npm install
```

Using `yarn`

```bash
cd insta-webhook
yarn
```

### Configuration

Create a `.env` file in the root directory and configure the following variables:

```
META_HUB_VERIFY_TOKEN=
META_APP_SECRET=
```

Replace `META_HUB_VERIFY_TOKEN` and `META_APP_SECRET` with your actual Instagram Hub Verify Token and App Secret.

### Usage

#### Verifying Requests

It perfectly handles Instagram verification requests sent by Meta GraphAPI to verify your webhook endpoint.
The endpoint `/meta/webhook/verify_request` handles that. You can modify the API path to suit your use case.
Check the `index.js` file for code implementation.

#### Handling Instagram Webhook Events

Instagram webhook events are sent to this path `/meta/webhook/instagram`. Be sure to modify the logic to
implement your desired business logic in the `index.js` file. For now it only verifies the webhook sha256
signature, saving you the time for writing the logic to verify and compare signatures. Check the `index.js`
file for code implementation.

### Testing

Run the test suite using the following command:

```bash
npm test
```

### References

[Meta Webhook](https://developers.facebook.com/docs/graph-api/webhooks/getting-started)

[Set Up Webhooks for Instagram](https://developers.facebook.com/docs/instagram-api/guides/webhooks)

[Instagram Object Reference](https://developers.facebook.com/docs/graph-api/webhooks/reference/instagram/v12.0)

Thank you and Happy coding!
