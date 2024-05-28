const express = require("express")

const {getTopics, getEndpoints} = require("./controllers/controllers")

const app = express()

app.get('/api/topics', getTopics);

app.get('/api', getEndpoints)


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
      res.status(400).send({ msg: 'Bad Request' });
    } else {next(err)}
  });

  app.use((err, req, res, next) => {
    res.status(500).send('Server Error!');
  })
  
module.exports = app