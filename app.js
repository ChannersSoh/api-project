const express = require("express");

const { getTopics, getEndpoints, getArticlesById, getArticles, getCommentsByArticleId, postCommentToAnArticle, patchArticlesById, deleteComment, getUsers } = require("./controllers/controllers");

const app = express();

app.use(express.json());

app.get('/api', getEndpoints);

app.get('/api/topics', getTopics);

app.get('/api/articles', getArticles);

app.get('/api/articles/:article_id', getArticlesById);

app.get('/api/articles/:article_id/comments', getCommentsByArticleId);

app.get('/api/users', getUsers)

app.post('/api/articles/:article_id/comments', postCommentToAnArticle);

app.patch('/api/articles/:article_id', patchArticlesById);

app.delete('/api/comments/:comment_id', deleteComment)

app.use((req, res, next) => {
    res.status(404).send({ msg: 'Not Found' });
  });
  
app.use((err, req, res, next) => {
    if (err.status && err.msg) {
      res.status(err.status).send({ msg: err.msg });
    } else {next(err)}
  });
  
  app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Invalid Input' });
    } else {next(err)}
  });

  app.use((err, req, res, next) => {
    if (err.code === '23503') {
      res.status(404).send({ msg: 'User does not exist' });
    } else {next(err)}
  });

  app.use((err, req, res, next) => {
    res.status(500).send('Server Error');
  })
  
module.exports = app