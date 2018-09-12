
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

router.put('/:id', (req, res, next) => {
  //make variables to acputre the id and object that will be updated 
  const id = req.params.id;
  const updateObj = {};
  updateObj.name = req.body.name;
  if (!updateObj.name) {
    const err = new Error('Missing `name` in request body');
    err.status = 400;
    return next(err);
  };
  
  knex('folders')
    .where({id: `${id}`})
    .update(updateObj)
    .returning(['id', 'name'])
    .then(reply => {
      res.status(201).json(reply[0])
    })
    .catch (err => next(err));
});

router.post('/', (req, res, next) => {
  const { name } = req.body;
  const newItem = { name };
  newItem.name = req.body.name
  if (!newItem.name) {
    const err = new Error('New folder must contain a `name`');
    err.status = 400;
    return next(err);
  }
  knex('folders')
    .insert(newItem)
    .returning(['name', 'id'])
    .then (reply => {
      res.status(201).json(reply)
    })
    .catch(err => next(err));
});

router.delete('/:id', (req, res, next) => {
  const id = req.params.id;
  knex('folders')
    .where({id: `${id}`})
    .del()
    .then(() => res.sendStatus(204))
    .catch(err => next(err))
});

module.exports = router;
// notes on destructuring objects
//const name = req.body.name // ='foo'
//const newItem = { name } // { name: 'foo' }
