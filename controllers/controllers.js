const {selectTopics, selectArticlesById, selectArticles, selectCommentsByArticleId, insertComment, checkAuthorExists} = require('../models/models')
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
};

exports.postCommentToAnArticle = (req, res, next) => {
    const { article_id } = req.params;
    const {username, body} = req.body;
    const newComment = {author: username, body, article_id}

    if(!username || !body) {
        return res.status(400).send({ status: 400, msg: "Bad Request: required field missing"})
    }

    Promise.all([selectArticlesById(article_id), checkAuthorExists(username)])
    .then(([article, userExists]) => {
        if (!article) {
            return Promise.reject({ status: 404, msg: 'Article does not exist' });
        }
        if (!userExists) {
            return Promise.reject({ status: 404, msg: 'User not found' });
        }
        const newComment = { author: username, body, article_id };
        return insertComment(newComment);
    })
    .then((comment) => {
        res.status(201).send({ comment });
    })
    .catch(next);
}