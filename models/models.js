const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`);
};

exports.selectArticlesById = (id) => {
    return db.query(`SELECT * FROM articles WHERE article_id = $1`, [id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article does not exist' });
        }
        return result.rows[0];
    });
};