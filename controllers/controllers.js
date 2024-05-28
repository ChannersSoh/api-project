const {selectTopics} = require('../models/models')
const endpoints = require('../endpoints.json')

exports.getTopics = (req, res, next) => {
    selectTopics().then((result) => {
        res.status(200).send({ topics: result.rows });
      })
      .catch(next)
};

exports.getEndpoints = (req, res, next) => {
      try{
        res.status(200).send({endpoints: endpoints})
    } catch (err) {
        next(err)
    }

};