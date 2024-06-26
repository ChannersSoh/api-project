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
                    comment_count: 2
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

      test('GET: 200 - returns articles filtered by topic', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then(({ body }) => {
            body.articles.forEach((article) => {
              expect(article.topic).toBe('cats')
            });
          });
      });

      test('GET: 200 - returns an empty array when the topic does exist but had no comments', () => {
        return request(app)
          .get('/api/articles?topic=paper')
          .expect(200)
          .then(({ body }) => {
            expect(body.articles).toEqual([]);
          });
      });

      test('GET: 404 - returns an error when topic does not exist', () => {
        return request(app)
          .get('/api/articles?topic=banana')
          .expect(404)
          .then(({ body }) => {
            expect(body.msg).toBe("Topic does not exist");
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
            .get('/api/articles/7/comments') 
            .expect(200)
            .then(({ body }) => {
                expect(body.comments).toEqual([]);
            });
    });

    test('GET: 400 - returns invalid input for invalid article id', () => {

      return request(app)
          .get('/api/articles/invalid/comments')
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Invalid Input');
          });
    });
});

describe('GET /api/users', () => {
  test('GET: 200 - returns an array of users', () => {
    
    return request(app)
    .get('/api/users')
    .expect(200)
    .then(({ body }) => {
      expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
            expect(user).toMatchObject({
                username: expect.any(String),
                name: expect.any(String),
                avatar_url: expect.any(String),
            })
        });
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

  test('POST: 404 - returns Invalid Input when the username does not exist', () => {
    const newComment = {
        username: "Channers",
        body: "Great article"
    };
    return request(app)
        .post('/api/articles/2/comments')
        .send(newComment)
        .expect(404)
        .then(({ body }) => {
            expect(body.msg).toBe('User does not exist');
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

describe('PATCH /api/articles/:article_id', () => {
      test('PATCH: 200 - returns article with the updated votes', () => {
    
        const newVotes = {
          inc_votes: 5
        }

        return request(app)
            .patch('/api/articles/2')
            .send(newVotes)
            .expect(200)
            .then(({body}) => {
              expect(body.article).toMatchObject({
                author: "icellusedkars",
                title: "Sony Vaio; or, The Laptop",
                article_id: 2,
                topic: "mitch",
                created_at: expect.any(String),
                votes: 5,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        })
      });

      test('PATCH: 200 - returns article with the updated votes even with unwanted object properties', () => {
    
        const newVotes = {
          inc_votes: 5,
          comment: "Fantastic"
        }

        return request(app)
            .patch('/api/articles/2')
            .send(newVotes)
            .expect(200)
            .then(({body}) => {
              expect(body.article).toMatchObject({
                author: "icellusedkars",
                title: "Sony Vaio; or, The Laptop",
                article_id: 2,
                topic: "mitch",
                created_at: expect.any(String),
                votes: 5,
                article_img_url: "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          })
        })
      });
    
      test('PATCH: 400 - returns an error when new votes is not a number', () => {

        const newVotes = { 
          inc_votes: 'author'
        }

        return request(app)
            .patch('/api/articles/2')
            .send(newVotes)
            .expect(400)
            .then(({ body }) => {
                expect(body.msg).toBe('Invalid Input');
            });
    });

    test('PATCH: 400 - returns an error when passed nothing into inc votes', () => {

      const newVotes = {}

      return request(app)
          .patch('/api/articles/2')
          .send(newVotes)
          .expect(400)
          .then(({ body }) => {
              expect(body.msg).toBe('Required key missing');
          });
  });

  test('PATCH: 400 - responds with an error when article id is not a valid value', () => {

    const newVotes = {
      inc_votes: 5
    }

    return request(app)
        .patch('/api/articles/author')
        .send(newVotes)
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid Input');
      });
});

      test('PATCH: 404 - responds with an error when article_id does not exist', () => {

        const newVotes = {
          inc_votes: 5
        }

        return request(app)
            .patch('/api/articles/9999')
            .send(newVotes)
            .expect(404)
            .then(({ body }) => {
                expect(body.msg).toBe('Article does not exist');
          });
  });
});

describe('DELETE /api/comments/:comment_id', () => {
  test('DELETE: 204 - delete a comment and return nothing', () => {

    return request(app)
        .delete('/api/comments/5')
        .expect(204)  
  });
  
  test('DELETE: 400 - returns an error when comment id is invalid', () => {
    return request(app)
        .delete('/api/comments/author')
        .expect(400)
        .then(({ body }) => {
            expect(body.msg).toBe('Invalid Input');
        });
});

test('DELETE: 404 - returns an error when comment id does not exist', () => {
  return request(app)
      .delete('/api/comments/9999')
      .expect(404)
      .then(({ body }) => {
          expect(body.msg).toBe('Comment does not exist');
      });
});
});