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
                expect(body.articles).toEqual({
                    title: "Sony Vaio; or, The Laptop",
                    topic: "mitch",
                    author: "icellusedkars",
                    body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
                    created_at: "2020-10-16T05:03:00.000Z",
                    article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
                    article_id: 2,
                    votes: 0,
          });
      });
    });

    test('GET: 404 - returns "Not Found" for non-existent article_id', () => {
        return request(app)
            .get('/api/articles/9999')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article does not exist');
            });
    });

    test('GET: 400 - returns "Bad Request" for an invalid parameter', () => {
        return request(app)
            .get('/api/articles/one')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid Input');
            });
    });
  });

  describe('GET /api/articles', () => {
    test('GET: 200 - return all articles', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles.length).toBe(13);
            body.articles.forEach((article) => {
                expect(article).toMatchObject({
                    author: expect.any(String),
                    title: expect.any(String),
                    article_id: expect.any(Number),
                    topic: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
                    article_img_url: expect.any(String),
                    comment_count: expect.any(Number),
          });
        });
      });
    });

    test('GET: 200 - return articles sorted by created at in descending order', () => {
        return request(app)
          .get('/api/articles?sort_by=created_at&order=desc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      });

      test('GET: 200 - return articles sorted by and ordered by non default inputs', () => {
        return request(app)
          .get('/api/articles?sort_by=title&order=asc')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toBeSortedBy('title', {
              ascending: true,
            });
          });
      }); 

    test('GET: 400 - articles sort by invalid column', () => {
        return request(app)
          .get('/api/articles?sort_by=story')
          .expect(400)
          .then(({ body }) => {
            expect(body.msg).toBe('Invalid Query');
          });
      });

      test('GET: 400 - articles ordered by an invalid input', () => {
        return request(app)
            .get('/api/articles?order=left')
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid Query');
            });
    });
});

describe('GET /api/articles/:article_id/comments', () => {
    test('GET: 200 - return all comments from a specific article', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({ body }) => {
            expect(body.comments.length).toBe(11);
            body.comments.forEach((comment) => {
                expect(comment).toMatchObject({
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    created_at: expect.any(String),
                    votes: expect.any(Number),
          });
        });
      });
    });

    test('GET: 200 - return comments sorted by created at in descending order', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      }); 

      test('GET: 404 - return an error when article id does not exist', () => {
        return request(app)
            .get('/api/articles/9999/comments')
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article does not exist');
            });
    });

    test('GET: 200 - returns an empty array when there are no comments for the article_id', () => {
        return request(app)
            .get('/api/articles/2/comments') 
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
            });
    });
});

describe('POST /api/articles/:article_id/comments', () => {
  test('POST: 201 - successfully post a comment and return the posted comment', () => {

    const newComment = {
      username: "lurker",
      body: "Very informative but a little tedious to read",
    };

      return request(app)
            .post('/api/articles/2/comments')
            .send(newComment)
            .expect(201)
            .then(({body}) => {
                expect(body.comment).toMatchObject({
                author: "lurker",
                body: "Very informative but a little tedious to read",
                article_id: 2,
                comment_id: expect.any(Number),
                created_at: expect.any(String),
                votes: expect.any(Number)
              })
            })
  });

  test('POST: 400 - returns Bad Request when required fields are missing', () => {
    const newComment = {
        body: "Not So Fantastic"
    };
    return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Bad Request: required field missing');
        });
  });

  test('POST: 404 - returns User not found when the username does not exist', () => {
    const newComment = {
        username: "Channers",
        body: "Great article"
    };
    return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('User not found');
        });
  });

  test('POST: 404 - returns article does not exist when given an non-existent article id', () => {
    const newComment = {
        username: "lurker",
        body: "Meh!"
    };
    return request(app)
        .post('/api/articles/9999/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('Article does not exist');
        });
  });

  test('POST: 400 - returns invalid input for invalid article id', () => {
    const newComment = {
        username: "lurker",
        body: "So-So"
    };
    return request(app)
        .post('/api/articles/invalid/comments')
        .send(newComment)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid Input');
        });
  });
});