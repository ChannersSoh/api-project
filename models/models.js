const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`);
};

exports.selectArticles = (sort_by = "created_at", order = "DESC") => {
    const validSortBy = ["created_at", "title", "author"];
    const validOrder = ["ASC", "asc", "DESC", "desc"];

    if ((sort_by && !validSortBy.includes(sort_by)) ||
        (order && ! validOrder.includes(order))) {
            return Promise.reject({ status: 400, msg: 'Invalid Input' })
        };

        let sqlQuery = ` SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, 
                         articles.votes, articles.article_img_url, 
                         COUNT(comments.comment_id)::FLOAT AS comment_count
                         FROM articles
                         LEFT JOIN comments ON articles.article_id = comments.article_id
                         GROUP BY articles.article_id `;

        sqlQuery += ` ORDER BY ${sort_by} ${order}`;

        return db.query(sqlQuery).then(({rows}) => {
            return rows
        });
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