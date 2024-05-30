const {selectTopics, selectArticlesById, selectArticles, selectCommentsByArticleId, insertComment, checkAuthorExists, updateArticles, removeComment, selectUsers} = require('../models/models')
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
    const { sort_by, order, topic } = req.query;

    selectArticles(sort_by, order, topic).then((articles) => {
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

exports.getUsers = (req, res, next) => {
    selectUsers().then((users) => {
        res.status(200).send({users})
    })
    .catch(next)
}

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
};

exports.patchArticlesById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body

    return updateArticles(article_id, inc_votes) 
    .then((article) => {
        res.status(200).send({ article })
    })
    .catch(next)
};

exports.deleteComment = (req, res, next) => {
    const { comment_id } = req.params

    return removeComment(comment_id)
    .then(() => {
        res.status(204).send()
    })
    .catch(next)
};