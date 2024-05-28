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
    test('GET: 200 - returns a JSON object describing all endpoints', () => {
        return request(app)
            .get('/api')
            .expect(200)
            .then(({ body }) => {
              expect(body.endpoints).toEqual(apiEndpoints);
        });
    });
  });

  describe('GET /api/articles/:article_id', () => {
    test('GET: 200 - returns an article object', () => {
        return request(app)
        .get('/api/articles/2')
        .expect(200)
        .then(({ body }) => {
                expect(body.articles).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    body: expect.any(String),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String)
          });
      });
    });

    test('GET: 404 - returns "Not Found" for non-existent article_id', () => {
        return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Not Found');
            });
    });

    test('GET: 400 - returns "Bad Request" for an invalid parameter', () => {
        return request(app)
            .get('/api/articles/one')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Bad Request');
            });
    });
  });