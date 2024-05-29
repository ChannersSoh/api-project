const {selectTopics, selectArticlesById, selectArticles, selectCommentsByArticleId} = require('../models/models')
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
    const { sort_by, order } = req.query;

    selectArticles(sort_by, order).then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
}

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params;

    selectArticlesById(article_id).then((articles) => {
        res.status(200).send({articles})
    })
    .catch(next)
};

exports.getCommentsByArticleId = (req, res, next) => {
    const { article_id } = req.params;

    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({comments})
    })
    .catch(next)
}