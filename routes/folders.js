
const express = require('express');
const knex = require('../knex');

const router = express.Router();

router.get('/', (req, res, next) => {
  knex
    .select('id', 'name')
    .from('folders')
    .orderBy('folders.id')
    .then(results => {
      res.json(results);
    })
    .catch(err => next(err));
});

router.get('/:id', (req, res, next) => {
  const id = req.params.id;
  knex('folders')
    .select()
    .where({id: `${id}`})
    .then(response => {
      res.status(200).json(response[0])
    })
    .catch(err => next(err));
});


module.exports = router;
