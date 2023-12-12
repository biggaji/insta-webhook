const { expect } = require('chai');
const request = require('supertest');
const server = require('../index');
const { genHmac } = require('../utils/crypto');

describe('Instagram webhook router unit tests', () => {
  describe('GET /meta/webhook/verify_request', () => {
    const query = {
      'hub.mode': 'subscribe',
      'hub.challenge': 1158201444,
      'hub.verify_token': process.env.META_HUB_VERIFY_TOKEN,
    };

    const misMatchedQuery = {
      'hub.mode': 'subscribe',
      'hub.challenge': 1158201444,
      'hub.verify_token': 'meatyyorkhocky',
    };

    it('Should return a 200 status code', (done) => {
      request(server).get('/meta/webhook/verify_request').query(query).expect(200, done);
    });

    it('Should return a 200 status code and the hub.challenge value', (done) => {
      request(server).get('/meta/webhook/verify_request').query(query).expect(200, '1158201444', done);
    });

    it('Should return a 500 status code if hub.verify_token mismatch', (done) => {
      request(server).get('/meta/webhook/verify_request').query(misMatchedQuery).expect(500, done);
    });
  });

  describe('POST /meta/webhook/instagram', () => {
    const sampleInstagramWebhookPayload = {
      entry: [
        {
          time: 1520383571,
          changes: [
            {
              field: 'photos',
              value: {
                verb: 'update',
                object_id: '10211885744794461',
              },
            },
          ],
          id: '10210299214172187',
          uid: '10210299214172187',
        },
      ],
      object: 'user',
    };

    const sha256Signature = genHmac(sampleInstagramWebhookPayload, process.env.META_APP_SECRET);

    it('Should return a 200 status code and successfully compare signatures', (done) => {
      request(server)
        .post('/meta/webhook/instagram')
        .send(sampleInstagramWebhookPayload)
        .set('Accept', 'application/json')
        .set('Content-Type', 'application/json')
        .set('X-Hub-Signature-256', `sha256=${sha256Signature}`)
        .expect(200, done);
    });
  });
});
