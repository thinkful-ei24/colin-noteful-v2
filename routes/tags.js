'use strict';

const express = require('express');
const knex = require('../knex');

const router = express.Router();


/*========== POST/CREATE ITEM ========== */
router.post('/tags', (req, res, next) => {
  const { name } = req.body; //same as /const name = req.body.name
  
  //makes sure user input is valid
  if (!name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  }
  
  const newItem = { name };

  knex.insert(newItem)
    .into('tags')
    .returning(['id', 'name'])
    .then((results) => {
      //results will be an array with one item. next line sets up a constant to only return the first item in the returned array
      const result = results[0];
      res.location(`{req.originalUrl}/${result.id}`).status(201).json(result);
    })
    .catch(err => next(err));
});



module.exports = router;
