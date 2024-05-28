const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const apiEndpoints = require('../endpoints.json')
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data');

beforeEach(() => {
    return seed(data);
  });

afterAll(() => db.end());

describe('GET /api/topics', () => {
    test('GET: 200 - return all topics', () => {
        return request(app)
      .get('/api/topics')
      .expect(200)
      .then(({ body }) => {
        expect(body.topics.length).toBe(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
    });
});

describe('Errors', () => {
    test('GET: 404 - invalid endpoint', () => {
        return request(app)
          .get('/api/authors')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe('Not Found');
          });
      });
});

describe('GET /api', () => {
    test('GET: 200 - responds with a JSON object describing all endpoints', async () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
              expect(body.endpoints).toEqual(apiEndpoints);
        });
    });
  });
