const {selectTopics, selectArticlesById} = require('../models/models')
const endpoints = require('../endpoints.json')

exports.getTopics = (req, res, next) => {
    selectTopics().then((result) => {
        res.status(200).send({ topics: result.rows });
      })
      .catch(next)
};

exports.getEndpoints = (req, res, next) => {
        res.status(200).send({endpoints})
};

exports.getArticlesById = (req, res, next) => {
    const {article_id} = req.params
    selectArticlesById(article_id).then((result) => {
        res.status(200).send({articles: result})
    })
    .catch(next)
};