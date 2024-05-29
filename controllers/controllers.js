const {selectTopics, selectArticlesById, selectArticles} = require('../models/models')
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

exports.getArticles = (req, res, next) => {
    const { sort_by, order } = req.query
    selectArticles(sort_by, order).then((result) => {
        res.status(200).send({articles: result})
    })
    .catch(next)
}

exports.getArticlesById = (req, res, next) => {
    const {article_id} = req.params
    selectArticlesById(article_id).then((result) => {
        res.status(200).send({articles: result})
    })
    .catch(next)
};