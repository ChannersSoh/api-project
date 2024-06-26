const db = require('../db/connection')

exports.selectTopics = () => {
    return db.query(`SELECT * FROM topics`);
};

exports.selectArticles = (sort_by = "created_at", order = "DESC", topic) => {
    const validSortBy = ["created_at", "title", "author", "topic", "votes", "comment_count"];
    const validOrder = ["ASC", "asc", "DESC", "desc"];

    if ((sort_by && !validSortBy.includes(sort_by)) ||
        (order && ! validOrder.includes(order))) {
            return Promise.reject({ status: 400, msg: 'Invalid Query' })
        };

        let sqlQuery = ` SELECT articles.article_id, articles.author, articles.title, articles.topic, articles.created_at, 
                         articles.votes, articles.article_img_url, 
                         COUNT(comments.comment_id)::INT AS comment_count
                         FROM articles
                         LEFT JOIN comments ON articles.article_id = comments.article_id `;
        
        let queryParams = [];

        if (topic){
            sqlQuery += ` WHERE articles.topic = $1`;
            queryParams.push(topic);
        }

        sqlQuery += ` GROUP BY articles.article_id ORDER BY ${sort_by} ${order}`;

        return db.query(sqlQuery, queryParams).then(({rows}) => {
            if(topic && rows.length === 0) {
                return db.query(`SELECT * FROM topics
                                 WHERE slug = $1`, [topic])
                .then(({rows: topicRows}) => {
                    if(topicRows.length === 0) {
                        return Promise.reject({ status: 404, msg: 'Topic does not exist' })
                    }
                    return []
                });
            }
            return rows;
        });
};

exports.selectArticlesById = (id) => {
    return db.query(`SELECT articles.*, COUNT(comments.comment_id)::INT AS comment_count 
                     FROM articles 
                     LEFT JOIN comments ON articles.article_id = comments.article_id
                     WHERE articles.article_id = $1
                     GROUP BY articles.article_id`, [id])
    .then((result) => {
        if (result.rows.length === 0) {
            return Promise.reject({ status: 404, msg: 'Article does not exist' })
        }
        return result.rows[0];
    });
};

exports.selectCommentsByArticleId = (id) => {
    return db.query('SELECT * FROM articles WHERE article_id = $1', [id])
        .then((result) => {
            if (result.rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article does not exist' });
            } else {
                return db.query(` SELECT comment_id, votes, created_at, author, body, article_id 
                                  FROM comments 
                                  WHERE article_id = $1 
                                  ORDER BY created_at DESC;`, [id]);
            }
        })
        .then((result) => {
            return result.rows;
        });
};

exports.selectUsers = () => {
    return db.query(`SELECT username, name, avatar_url 
                     FROM users`)
    .then(({rows}) => {
        return rows
    })
}

exports.insertComment = (newComment) => {
    const { author, body, article_id} = newComment
    return db.query(`INSERT INTO comments
                     (author, body, article_id)
                     VALUES
                     ($1, $2, $3) RETURNING *`,
                     [author, body, article_id])
    .then(({rows}) => {
        return rows[0]
    })
};

exports.updateArticles = (article_id, inc_votes) => {
    if(!inc_votes){
        return Promise.reject({ status: 400, msg: 'Required key missing' })
    }

  return db.query(`UPDATE articles 
                   SET votes = votes + $1
                   WHERE article_id = $2
                   Returning *`, [inc_votes, article_id])
        .then(({rows}) => {
            if(rows.length === 0) {
                return Promise.reject({ status: 404, msg: 'Article does not exist' })
            }
            return rows[0]
        });
};

exports.removeComment = (comment_id) => {
   return db.query(`DELETE FROM comments 
              WHERE comment_id = $1`, [comment_id])
              .then((result) => {
                if (result.rowCount === 0) {
                    return Promise.reject({ status: 404, msg: 'Comment does not exist' });
                }
            });
};